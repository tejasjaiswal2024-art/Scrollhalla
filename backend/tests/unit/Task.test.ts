import { Task, TaskStatus, MoscowPriority } from '../../src/models/Task';

describe('Task (domain model)', () => {
  it('applies defaults when optional params are omitted', () => {
    const t = new Task({ title: 'T', description: 'D' });
    expect(t.id).toMatch(/^TASK-\d{4}$/);
    expect(t.status).toBe(TaskStatus.TO_DO);
    expect(t.moscow).toBe(MoscowPriority.SHOULD_HAVE);
    expect(t.storyPoints).toBe(3);
    expect(t.assignee).toBe('Unassigned');
    expect(t.views).toBe(0);
    expect(t.comments).toEqual([]);
    expect(Date.parse(t.createdAt)).not.toBeNaN();
  });

  it('keeps explicitly supplied values', () => {
    const t = new Task({
      id: 'TASK-1', title: 'T', description: 'D', status: TaskStatus.DONE,
      moscow: MoscowPriority.MUST_HAVE, storyPoints: 8, assignee: 'Ria', views: 7
    });
    expect(t).toMatchObject({ id: 'TASK-1', status: 'DONE', moscow: 'MUST_HAVE', storyPoints: 8, assignee: 'Ria', views: 7 });
  });

  it('incrementViews adds exactly one view', () => {
    const t = new Task({ title: 'T', description: 'D', views: 4 });
    t.incrementViews();
    expect(t.views).toBe(5);
  });

  it('addComment appends and defaults the author to Anonymous', () => {
    const t = new Task({ title: 'T', description: 'D' });
    const c = t.addComment('', 'hello');
    expect(c.author).toBe('Anonymous');
    expect(c.text).toBe('hello');
    expect(c.id).toMatch(/^CMT-\d+$/);
    expect(t.comments).toHaveLength(1);
    expect(t.addComment('Ria', 'x').author).toBe('Ria');
  });

  describe('getDaysInBacklog', () => {
    const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
    it('is never below 1 for a task created just now', () => {
      expect(new Task({ title: 'T', description: 'D' }).getDaysInBacklog()).toBe(1);
    });
    it('rounds partial days up', () => {
      expect(new Task({ title: 'T', description: 'D', createdAt: daysAgo(4.2) }).getDaysInBacklog()).toBe(5);
    });
    it('counts whole days exactly', () => {
      expect(new Task({ title: 'T', description: 'D', createdAt: daysAgo(10) }).getDaysInBacklog()).toBeGreaterThanOrEqual(10);
      expect(new Task({ title: 'T', description: 'D', createdAt: daysAgo(10) }).getDaysInBacklog()).toBeLessThanOrEqual(11);
    });
  });
});
