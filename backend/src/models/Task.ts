export enum MoscowPriority {
  MUST_HAVE = 'MUST_HAVE',
  SHOULD_HAVE = 'SHOULD_HAVE',
  COULD_HAVE = 'COULD_HAVE',
  WONT_HAVE = 'WONT_HAVE'
}

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE'
}

export interface IComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ITaskParams {
  id?: string;
  title: string;
  description: string;
  status?: TaskStatus;
  moscow?: MoscowPriority;
  storyPoints?: number;
  assignee?: string;
  views?: number;
  comments?: IComment[];
  createdAt?: string;
}

export class Task {
  public id: string;
  public title: string;
  public description: string;
  public status: TaskStatus;
  public moscow: MoscowPriority;
  public storyPoints: number;
  public assignee: string;
  public views: number;
  public comments: IComment[];
  public createdAt: string;

  constructor(params: ITaskParams) {
    this.id = params.id || `TASK-${Math.floor(1000 + Math.random() * 9000)}`;
    this.title = params.title;
    this.description = params.description;
    this.status = params.status || TaskStatus.TO_DO;
    this.moscow = params.moscow || MoscowPriority.SHOULD_HAVE;
    this.storyPoints = params.storyPoints || 3;
    this.assignee = params.assignee || 'Unassigned';
    this.views = params.views || 0;
    this.comments = params.comments || [];
    this.createdAt = params.createdAt || new Date().toISOString();
  }

  public incrementViews(): void {
    this.views += 1;
  }

  public addComment(author: string, text: string): IComment {
    const comment: IComment = {
      id: `CMT-${Date.now()}`,
      author: author || 'Anonymous',
      text,
      timestamp: new Date().toISOString()
    };
    this.comments.push(comment);
    return comment;
  }

  public getDaysInBacklog(): number {
    const createdDate = new Date(this.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }
}
