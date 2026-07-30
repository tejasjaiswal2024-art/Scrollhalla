import { Task } from '../models/Task';
import { BacklogItem } from '../models/BacklogItem';

export interface ISmartBacklogConfig {
  weightViews: number;
  weightComments: number;
  weightBacklogAge: number;
  weightStoryPoints: number;
}

export class SmartBacklogService {
  private config: ISmartBacklogConfig;

  constructor(config?: Partial<ISmartBacklogConfig>) {
    this.config = {
      weightViews: config?.weightViews ?? 1.5,
      weightComments: config?.weightComments ?? 4.0,
      weightBacklogAge: config?.weightBacklogAge ?? 2.5,
      weightStoryPoints: config?.weightStoryPoints ?? 1.2
    };
  }

  /**
   * Calculates dynamic priority score for a BacklogItem based on user interaction metrics.
   */
  public calculatePriorityScore(item: BacklogItem): number {
    const viewScore = item.views * this.config.weightViews;
    const commentScore = item.commentCount * this.config.weightComments;
    // Logarithmic decay/growth for time in backlog to avoid extreme skew
    const ageScore = Math.log(item.daysInBacklog + 1) * 10 * this.config.weightBacklogAge;
    const complexityScore = item.storyPoints * this.config.weightStoryPoints;

    const baseScore = viewScore + commentScore + ageScore + complexityScore;
    const finalScore = baseScore * item.moscowWeight;

    item.priorityScore = Math.max(0, finalScore);
    return item.priorityScore;
  }

  /**
   * Scores and sorts an array of Task domain entities.
   */
  public getRankedBacklog(tasks: Task[]): BacklogItem[] {
    const backlogItems = tasks.map(task => new BacklogItem(task));
    
    // Calculate scores
    backlogItems.forEach(item => this.calculatePriorityScore(item));

    // Sort descending by priority score
    return backlogItems.sort((a, b) => b.priorityScore - a.priorityScore);
  }
}
