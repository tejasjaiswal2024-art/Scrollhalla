import { parseURL, rssParserModuleMock } from '../helpers/rssParserMock';
jest.mock('rss-parser', () => require('../helpers/rssParserMock').rssParserModuleMock());

import { SprintRiskService } from '../../src/services/SprintRiskService';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toUTCString();
const feed = (...items: object[]) => ({ items });

beforeEach(() => parseURL.mockReset());

describe('SprintRiskService', () => {
  it('reads the configured URL', async () => {
    parseURL.mockResolvedValue(feed());
    const r = await new SprintRiskService('https://status/x.rss').fetchAndCalculateRisk();
    expect(parseURL).toHaveBeenCalledWith('https://status/x.rss');
    expect(r.feedSource).toBe('https://status/x.rss');
  });

  it('floors the score at 5% when there are no recent incidents', async () => {
    parseURL.mockResolvedValue(feed({ title: 'Major outage', pubDate: hoursAgo(24 * 8) }, { title: 'no date' }));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r).toMatchObject({ riskScorePercentage: 5, riskLevel: 'LOW', totalIncidentsAnalyzed: 0, recentIncidents: [] });
  });

  it.each([
    ['Major outage on API', '', 'CRITICAL', 30],
    ['Everything down', 'a major outage occurred', 'CRITICAL', 30],
    ['Degraded performance', '', 'HIGH', 20],
    ['Partial unavailability', '', 'HIGH', 20],
    ['Resolved', 'incident report', 'HIGH', 20],
    ['Investigating reports', '', 'MEDIUM', 12],
    ['Brief disruption', '', 'MEDIUM', 12],
    ['Scheduled maintenance', '', 'LOW', 5]
  ])('classifies "%s" / "%s" as %s (weight %d)', async (title, contentSnippet, severity, weight) => {
    parseURL.mockResolvedValue(feed({ title, contentSnippet, pubDate: hoursAgo(1), link: 'l' }));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r.recentIncidents[0]).toMatchObject({ title, severity, link: 'l', pubDate: expect.any(String) });
    expect(r.riskScorePercentage).toBe(Math.max(5, weight));
  });

  it.each([
    [[5, 5, 5], 15, 'LOW'],
    [[20], 20, 'MEDIUM'],
    [[20, 12, 5], 37, 'MEDIUM'],
    [[20, 20], 40, 'HIGH'],
    [[30, 30], 60, 'HIGH'],
    [[30, 20, 20], 70, 'CRITICAL'],
    [[30, 30, 30, 30], 100, 'CRITICAL']
  ])('weights %j → %d%% %s (capped at 100)', async (weights, score, level) => {
    const titleFor: Record<number, string> = { 30: 'Major outage', 20: 'Degraded', 12: 'Investigating', 5: 'Notice' };
    parseURL.mockResolvedValue(feed(...weights.map(w => ({ title: titleFor[w], pubDate: hoursAgo(2) }))));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r.riskScorePercentage).toBe(score);
    expect(r.riskLevel).toBe(level);
    expect(r.totalIncidentsAnalyzed).toBe(weights.length);
    expect(r.summary).toContain(`${score}%`);
    expect(r.mitigationAdvice.length).toBeGreaterThan(10);
  });

  it('passes the original pubDate through', async () => {
    const pubDate = hoursAgo(3);
    parseURL.mockResolvedValue(feed({ title: 'x', pubDate }));
    expect((await new SprintRiskService().fetchAndCalculateRisk()).recentIncidents[0].pubDate).toBe(pubDate);
  });

  it('uses placeholder title for untitled items', async () => {
    parseURL.mockResolvedValue(feed({ pubDate: hoursAgo(1) }));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r.recentIncidents[0].title).toBe('Service Status Alert');
  });

  it('degrades to the resilience fallback when the feed is unreachable', async () => {
    parseURL.mockRejectedValue(new Error('ENOTFOUND'));
    const r = await new SprintRiskService('https://down').fetchAndCalculateRisk();
    expect(r.riskScorePercentage).toBe(18);
    expect(r.riskLevel).toBe('LOW');
    expect(r.feedSource).toBe('https://down (Resilience Fallback Mode)');
    expect(r.recentIncidents).toHaveLength(2);
  });
});

describe('SprintRiskService — boundaries and keyword precedence', () => {
  afterEach(() => jest.useRealTimers());

  it('includes an incident published exactly 7 days ago, excludes one a second older', async () => {
    const now = new Date('2026-10-14T12:00:00Z');
    jest.useFakeTimers({ now });
    const seven = new Date(now.getTime() - 7 * 86_400_000).toUTCString();
    const older = new Date(now.getTime() - 7 * 86_400_000 - 1000).toUTCString();
    parseURL.mockResolvedValue(feed({ title: 'Degraded', pubDate: seven }, { title: 'Degraded', pubDate: older }));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r.totalIncidentsAnalyzed).toBe(1);
  });

  it.each(['Major incident', 'Total outage'])('"%s" alone is enough for CRITICAL', async title => {
    parseURL.mockResolvedValue(feed({ title, pubDate: hoursAgo(1) }));
    expect((await new SprintRiskService().fetchAndCalculateRisk()).recentIncidents[0].severity).toBe('CRITICAL');
  });

  it('an empty title/body is treated as LOW, not matched against placeholder text', async () => {
    parseURL.mockResolvedValue(feed({ title: '', contentSnippet: '', pubDate: hoursAgo(1) }));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r.recentIncidents[0].severity).toBe('LOW');
  });

  it('defaults to the GitHub status feed', async () => {
    parseURL.mockResolvedValue(feed());
    await new SprintRiskService().fetchAndCalculateRisk();
    expect(parseURL).toHaveBeenCalledWith('https://www.githubstatus.com/history.rss');
  });

  it('fallback incidents are fully populated and in the past', async () => {
    parseURL.mockRejectedValue(new Error('offline'));
    const r = await new SprintRiskService().fetchAndCalculateRisk();
    expect(r.recentIncidents.map(i => i.severity)).toEqual(['MEDIUM', 'LOW']);
    const now = Date.now();
    const ages = r.recentIncidents.map(i => (now - Date.parse(i.pubDate)) / 3_600_000);
    expect(ages[0]).toBeCloseTo(36, 0);
    expect(ages[1]).toBeCloseTo(72, 0);
    r.recentIncidents.forEach(i => expect(i.title.length).toBeGreaterThan(0));
    expect(r.summary).toMatch(/18% risk/);
    expect(r.mitigationAdvice).toMatch(/healthy/i);
  });
});
