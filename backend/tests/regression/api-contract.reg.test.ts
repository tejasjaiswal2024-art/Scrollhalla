// Regression pack: pins the externally observable contract of every endpoint
// (status codes + response shapes) and the ranking of the seed backlog.
// Any change that alters these must update the snapshot deliberately.
jest.mock('../../src/config/prisma', () => require('../helpers/mockInfra').prismaModuleMock());
jest.mock('../../src/config/redis', () => require('../helpers/mockInfra').cacheModuleMock());
jest.mock('rss-parser', () => require('../helpers/rssParserMock').rssParserModuleMock());

import request from 'supertest';
import app from '../../src/app';
import { parseURL } from '../helpers/rssParserMock';

/** Replace volatile values (ids, timestamps, latencies) with their type so snapshots are stable. */
const shape = (v: any): any => {
  if (Array.isArray(v)) return v.length ? [shape(v[0])] : [];
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, shape(v[k])]));
  return typeof v;
};

beforeAll(() => parseURL.mockResolvedValue({ title: 'S', items: [{ guid: 'g', title: 't', link: 'l', pubDate: '2026-10-01T00:00:00Z' }] }));

describe('REG-01 response contracts', () => {
  it.each([
    ['GET', '/health'],
    ['GET', '/api/tasks'],
    ['GET', '/api/tasks/TASK-101'],
    ['GET', '/api/smart-backlog'],
    ['GET', '/api/team'],
    ['GET', '/api/feed'],
    ['GET', '/api/sprint-risk'],
    ['GET', '/api/tasks/TASK-0000'],
    ['GET', '/api/auth/me']
  ])('%s %s', async (_m, url) => {
    const r = await request(app).get(url);
    expect({ status: r.status, body: shape(r.body) }).toMatchSnapshot();
  });
});

describe('REG-02 seed backlog ranking (golden master)', () => {
  it('orders the seeded tasks identically to the released build', async () => {
    const r = await request(app).get('/api/smart-backlog');
    expect(r.body.data.map((t: any) => `${t.id} ${t.moscow}`)).toMatchSnapshot();
  });
});

describe('REG-03 previously-fixed / easily-broken behaviours', () => {
  it('storyPoints of 0 is coerced to the default 3 (documented quirk, not silently changed)', async () => {
    const r = await request(app).post('/api/tasks').send({ title: 't', description: 'd', storyPoints: 0 });
    expect(r.body.data.storyPoints).toBe(3);
  });

  it('team utilisation is capped at 100%', async () => {
    for (let i = 0; i < 5; i++) await request(app).post('/api/tasks').send({ title: 't', description: 'd', storyPoints: 13, assignee: 'Ria Sen' });
    const ria = (await request(app).get('/api/team')).body.data.find((m: any) => m.name === 'Ria Sen');
    expect(ria.capacityUtilizationPercentage).toBe(100);
  });

  it('auth error messages do not reveal whether an email is registered', async () => {
    const r = await request(app).post('/api/auth/login').send({ email: 'nobody@x', password: 'p' });
    expect(r.body.message).toBe('Invalid email or password.');
  });

  it('malformed JSON bodies are handled by the global error handler, not crash the process', async () => {
    const r = await request(app).post('/api/tasks').set('Content-Type', 'application/json').send('{"title":');
    expect([400, 500]).toContain(r.status);
    expect(r.body.success).toBe(false);
  });
});
