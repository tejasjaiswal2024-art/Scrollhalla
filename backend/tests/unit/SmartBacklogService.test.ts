import { SmartBacklogService } from '../../src/services/SmartBacklogService';
import { BacklogItem } from '../../src/models/BacklogItem';
import { Task, MoscowPriority } from '../../src/models/Task';

const item = (over: Partial<BacklogItem>) =>
  Object.assign(new BacklogItem(new Task({ title: 'T', description: 'D' })), over);

describe('SmartBacklogService', () => {
  const svc = new SmartBacklogService();

  it('computes the documented formula with default weights', () => {
    const it1 = item({ views: 10, commentCount: 2, daysInBacklog: 4, storyPoints: 5, moscowWeight: 2.5 });
    const expected = (10 * 1.5 + 2 * 4.0 + Math.log(5) * 10 * 2.5 + 5 * 1.2) * 2.5;
    expect(svc.calculatePriorityScore(it1)).toBeCloseTo(expected, 10);
    expect(it1.priorityScore).toBeCloseTo(expected, 10);
  });

  it('honours injected weights (configurable strategy)', () => {
    const custom = new SmartBacklogService({ weightViews: 0, weightComments: 0, weightBacklogAge: 0, weightStoryPoints: 1 });
    expect(custom.calculatePriorityScore(item({ views: 99, commentCount: 99, daysInBacklog: 99, storyPoints: 7, moscowWeight: 1 }))).toBe(7);
  });

  it('keeps defaults for weights that are not overridden', () => {
    const partial = new SmartBacklogService({ weightViews: 0 });
    const it1 = item({ views: 100, commentCount: 1, daysInBacklog: 0, storyPoints: 0, moscowWeight: 1 });
    expect(partial.calculatePriorityScore(it1)).toBeCloseTo(4.0, 10);
  });

  it('clamps negative scores to zero', () => {
    const neg = new SmartBacklogService({ weightViews: -10 });
    expect(neg.calculatePriorityScore(item({ views: 100, commentCount: 0, daysInBacklog: 0, storyPoints: 0, moscowWeight: 1 }))).toBe(0);
  });

  it('ranks tasks in descending score order', () => {
    const low = new Task({ id: 'LOW', title: 'a', description: 'b', moscow: MoscowPriority.WONT_HAVE, storyPoints: 1 });
    const high = new Task({ id: 'HIGH', title: 'a', description: 'b', moscow: MoscowPriority.MUST_HAVE, views: 50, storyPoints: 8 });
    const mid = new Task({ id: 'MID', title: 'a', description: 'b', views: 10 });
    const ranked = svc.getRankedBacklog([low, high, mid]);
    expect(ranked.map(r => r.task.id)).toEqual(['HIGH', 'MID', 'LOW']);
    for (let i = 1; i < ranked.length; i++) expect(ranked[i - 1].priorityScore).toBeGreaterThanOrEqual(ranked[i].priorityScore);
  });

  it('returns an empty list for an empty backlog', () => {
    expect(svc.getRankedBacklog([])).toEqual([]);
  });
});
