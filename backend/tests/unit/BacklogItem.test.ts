import { BacklogItem } from '../../src/models/BacklogItem';
import { Task, MoscowPriority } from '../../src/models/Task';

describe('BacklogItem (domain model)', () => {
  it.each([
    [MoscowPriority.MUST_HAVE, 2.5],
    [MoscowPriority.SHOULD_HAVE, 1.8],
    [MoscowPriority.COULD_HAVE, 1.2],
    [MoscowPriority.WONT_HAVE, 0.5],
    ['UNKNOWN' as MoscowPriority, 1.0]
  ])('maps %s to weight %d', (p, w) => {
    expect(BacklogItem.getMoscowWeight(p)).toBe(w);
  });

  it('snapshots the task metrics at construction', () => {
    const task = new Task({ title: 'T', description: 'D', views: 9, storyPoints: 5, moscow: MoscowPriority.COULD_HAVE });
    task.addComment('a', 'b');
    const item = new BacklogItem(task);
    expect(item).toMatchObject({ views: 9, commentCount: 1, storyPoints: 5, moscowWeight: 1.2, priorityScore: 0 });
    expect(item.daysInBacklog).toBe(1);
  });

  it('toJSON flattens the task and rounds the score to 2 dp', () => {
    const task = new Task({ id: 'TASK-9', title: 'T', description: 'D' });
    const item = new BacklogItem(task);
    item.priorityScore = 12.3456;
    const json = item.toJSON();
    expect(json.id).toBe('TASK-9');
    expect(json.priorityScore).toBe(12.35);
    expect(json).toHaveProperty('commentCount', 0);
    expect(json).toHaveProperty('moscowWeight', 1.8);
    expect(json).toHaveProperty('daysInBacklog', 1);
  });
});
