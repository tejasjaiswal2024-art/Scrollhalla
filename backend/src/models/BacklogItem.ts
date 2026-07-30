import { Task, MoscowPriority } from './Task';

export interface IBacklogItemMetrics {
  views: number;
  commentCount: number;
  daysInBacklog: number;
  storyPoints: number;
  moscowWeight: number;
  priorityScore: number;
}

export class BacklogItem {
  public task: Task;
  public views: number;
  public commentCount: number;
  public daysInBacklog: number;
  public storyPoints: number;
  public moscowWeight: number;
  public priorityScore: number;

  constructor(task: Task) {
    this.task = task;
    this.views = task.views;
    this.commentCount = task.comments.length;
    this.daysInBacklog = task.getDaysInBacklog();
    this.storyPoints = task.storyPoints;
    this.moscowWeight = BacklogItem.getMoscowWeight(task.moscow);
    this.priorityScore = 0; // Computed by SmartBacklogService
  }

  public static getMoscowWeight(priority: MoscowPriority): number {
    switch (priority) {
      case MoscowPriority.MUST_HAVE:
        return 2.5;
      case MoscowPriority.SHOULD_HAVE:
        return 1.8;
      case MoscowPriority.COULD_HAVE:
        return 1.2;
      case MoscowPriority.WONT_HAVE:
        return 0.5;
      default:
        return 1.0;
    }
  }

  public toJSON() {
    return {
      ...this.task,
      commentCount: this.commentCount,
      daysInBacklog: this.daysInBacklog,
      moscowWeight: this.moscowWeight,
      priorityScore: Number(this.priorityScore.toFixed(2))
    };
  }
}
