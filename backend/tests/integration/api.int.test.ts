// Integration: real Express app → router → controllers → services → models.
// Only Layer-5 adapters (Prisma, Redis, outbound HTTP) are replaced.
jest.mock('../../src/config/prisma', () => require('../helpers/mockInfra').prismaModuleMock());
jest.mock('../../src/config/redis', () => require('../helpers/mockInfra').cacheModuleMock());
jest.mock('rss-parser', () => require('../helpers/rssParserMock').rssParserModuleMock());

import request from 'supertest';
import app from '../../src/app';
import { memoryCache } from '../helpers/mockInfra';
import { parseURL } from '../helpers/rssParserMock';

describe('Health & routing', () => {
  it('GET /health reports UP', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ status: 'UP', service: 'Scrollhalla Backend API' });
  });

  it('unknown routes return the JSON 404 envelope', async () => {
    const r = await request(app).get('/api/nope');
    expect(r.status).toBe(404);
    expect(r.body).toEqual({ success: false, message: "API Route '/api/nope' not found." });
  });
});

describe('Task CRUD flow (TaskController ⇄ Task)', () => {
  let id: string;

  it('lists the seeded tasks', async () => {
    const r = await request(app).get('/api/tasks');
    expect(r.status).toBe(200);
    expect(r.body.count).toBe(r.body.data.length);
    expect(r.body.count).toBeGreaterThan(0);
  });

  it('filters by MoSCoW alone', async () => {
    const all = (await request(app).get('/api/tasks')).body.data;
    const r = await request(app).get('/api/tasks?moscow=WONT_HAVE');
    expect(r.body.success).toBe(true);
    expect(r.body.count).toBe(all.filter((t: any) => t.moscow === 'WONT_HAVE').length);
    expect(r.body.count).toBeLessThan(all.length);
  });

  it('filters by status and MoSCoW', async () => {
    const r = await request(app).get('/api/tasks?status=IN_PROGRESS&moscow=MUST_HAVE');
    expect(r.body.data.length).toBeGreaterThan(0);
    r.body.data.forEach((t: any) => expect(t).toMatchObject({ status: 'IN_PROGRESS', moscow: 'MUST_HAVE' }));
  });

  it('rejects a task without title/description', async () => {
    const r = await request(app).post('/api/tasks').send({ title: 'only title' });
    expect(r.status).toBe(400);
    expect(r.body).toEqual({ success: false, message: 'Title and description are required.' });
  });

  it('creates a task with defaults', async () => {
    const r = await request(app).post('/api/tasks').send({ title: 'Write tests', description: 'DA3', storyPoints: '5' });
    expect(r.status).toBe(201);
    expect(r.body.success).toBe(true);
    expect(r.body.data).toMatchObject({ title: 'Write tests', status: 'TO_DO', moscow: 'SHOULD_HAVE', storyPoints: 5, assignee: 'Unassigned' });
    id = r.body.data.id;
  });

  it('reading a task increments its view count', async () => {
    const a = await request(app).get(`/api/tasks/${id}`);
    const b = await request(app).get(`/api/tasks/${id}`);
    expect(b.body.data.views).toBe(a.body.data.views + 1);
  });

  it('updates only supplied fields', async () => {
    const r = await request(app).put(`/api/tasks/${id}`).send({ status: 'IN_REVIEW', storyPoints: '8' });
    expect(r.body.data).toMatchObject({ title: 'Write tests', status: 'IN_REVIEW', storyPoints: 8 });
  });

  it('adds a comment, rejects an empty one', async () => {
    expect((await request(app).post(`/api/tasks/${id}/comments`).send({ author: 'Ria' })).status).toBe(400);
    const r = await request(app).post(`/api/tasks/${id}/comments`).send({ author: 'Ria', text: 'LGTM' });
    expect(r.status).toBe(201);
    expect(r.body.task.comments).toHaveLength(1);
  });

  it('deletes the task, then 404s on every verb', async () => {
    expect((await request(app).delete(`/api/tasks/${id}`)).body.data.id).toBe(id);
    expect((await request(app).get(`/api/tasks/${id}`)).status).toBe(404);
    expect((await request(app).put(`/api/tasks/${id}`).send({})).status).toBe(404);
    expect((await request(app).delete(`/api/tasks/${id}`)).status).toBe(404);
    expect((await request(app).post(`/api/tasks/${id}/comments`).send({ text: 'x' })).status).toBe(404);
  });
});

describe('Cross-controller integration (shared TaskController via DI)', () => {
  it('a newly created high-engagement task rises to the top of the smart backlog', async () => {
    const c = await request(app).post('/api/tasks').send({ title: 'Hot', description: 'd', moscow: 'MUST_HAVE', storyPoints: 13 });
    for (let i = 0; i < 80; i++) await request(app).get(`/api/tasks/${c.body.data.id}`);
    for (let i = 0; i < 20; i++) await request(app).post(`/api/tasks/${c.body.data.id}/comments`).send({ text: `c${i}` });
    const r = await request(app).get('/api/smart-backlog');
    expect(r.body.data[0].id).toBe(c.body.data.id);
    const scores = r.body.data.map((t: any) => t.priorityScore);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it('team workload reflects reassignment made through the task API', async () => {
    const before = (await request(app).get('/api/team')).body.data.find((m: any) => m.name === 'Ria Sen');
    const c = await request(app).post('/api/tasks').send({ title: 'x', description: 'y', storyPoints: 4, assignee: 'Ria Sen' });
    const after = (await request(app).get('/api/team')).body.data.find((m: any) => m.name === 'Ria Sen');
    expect(after.capacityUtilizationPercentage).toBe(Math.min(100, Math.round((after.assignedStoryPoints / after.velocity) * 100)));
    expect(after.assignedTasksCount).toBe(before.assignedTasksCount + 1);
    expect(after.assignedStoryPoints).toBe(before.assignedStoryPoints + 4);
    expect(after.capacityUtilizationPercentage).toBeLessThanOrEqual(100);
    await request(app).delete(`/api/tasks/${c.body.data.id}`);
  });
});

describe('Feed pipeline (FeedController → CronWorker → Factory → Parsers → Cache)', () => {
  beforeEach(() => { memoryCache.clear(); parseURL.mockReset(); });

  it('cold cache: harvests on demand, merges feeds newest-first, then serves from cache', async () => {
    parseURL.mockImplementation(async (url: string) => ({
      title: url,
      items: [{ guid: `${url}#1`, title: `from ${url}`, link: url, pubDate: url.includes('dev.to') ? '2026-10-10T00:00:00Z' : '2026-10-01T00:00:00Z' }]
    }));
    const first = await request(app).get('/api/feed');
    expect(first.body).toMatchObject({ success: true, source: 'ON_DEMAND_HARVEST', count: 3 });
    expect(first.body.data[0].link).toBe('https://dev.to/feed');
    expect(parseURL).toHaveBeenCalledTimes(3);

    const second = await request(app).get('/api/feed');
    expect(second.body.source).toBe('REDIS_CACHE_HIT');
    expect(second.body.data).toEqual(first.body.data);
    expect(parseURL).toHaveBeenCalledTimes(3);
  });

  it('one failing source does not break the timeline', async () => {
    parseURL.mockImplementation(async (url: string) => {
      if (url.includes('ycombinator')) throw new Error('down');
      return { items: [{ guid: url, pubDate: '2026-10-01T00:00:00Z' }] };
    });
    const r = await request(app).get('/api/feed');
    expect(r.status).toBe(200);
    expect(r.body.count).toBe(2);
  });
});

describe('Sprint risk endpoint', () => {
  it('returns the fallback assessment when the status feed is offline', async () => {
    parseURL.mockRejectedValue(new Error('offline'));
    const r = await request(app).get('/api/sprint-risk');
    expect(r.status).toBe(200);
    expect(r.body.data).toMatchObject({ riskScorePercentage: 18, riskLevel: 'LOW' });
  });
});

describe('Auth flow (AuthController ⇄ bcrypt ⇄ JWT ⇄ middleware)', () => {
  const creds = { email: 'reader@scrollhalla.test', password: 'pa55word' };
  let token: string;

  it('validates required fields', async () => {
    expect((await request(app).post('/api/auth/register').send({ email: 'x' })).status).toBe(400);
    expect((await request(app).post('/api/auth/login').send({})).status).toBe(400);
  });

  it('registers, never echoing the password hash', async () => {
    const r = await request(app).post('/api/auth/register').send(creds);
    expect(r.status).toBe(201);
    expect(r.body.user).toMatchObject({ email: creds.email, uiSettings: { theme: 'dark', density: 'compact' } });
    expect(JSON.stringify(r.body)).not.toContain('password');
  });

  it('refuses duplicate registration', async () => {
    expect((await request(app).post('/api/auth/register').send(creds)).status).toBe(409);
  });

  it('rejects wrong password and unknown user with the same 401', async () => {
    const a = await request(app).post('/api/auth/login').send({ ...creds, password: 'nope' });
    const b = await request(app).post('/api/auth/login').send({ email: 'ghost@x', password: 'nope' });
    expect(a.status).toBe(401);
    expect(b.status).toBe(401);
    expect(a.body.message).toBe(b.body.message);
  });

  it('logs in and reaches the protected profile', async () => {
    const r = await request(app).post('/api/auth/login').send(creds);
    expect(r.status).toBe(200);
    token = r.body.token;
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.data).toMatchObject({ email: creds.email, subscriptions: [], bookmarks: [] });
  });

  it('blocks the profile without a token', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });
});

describe('Team workload is computed per member', () => {
  it('each member only counts their own tasks', async () => {
    const tasks = (await request(app).get('/api/tasks')).body.data;
    const team = await request(app).get('/api/team');
    expect(team.body.success).toBe(true);
    team.body.data.forEach((m: any) => {
      const mine = tasks.filter((t: any) => t.assignee === m.name);
      expect(m.assignedTasksCount).toBe(mine.length);
      expect(m.assignedStoryPoints).toBe(mine.reduce((s: number, t: any) => s + t.storyPoints, 0));
    });
  });
});
