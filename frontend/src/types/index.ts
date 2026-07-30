export type MoscowType = 'MUST_HAVE' | 'SHOULD_HAVE' | 'COULD_HAVE' | 'WONT_HAVE';
export type TaskStatusType = 'TO_DO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface IComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatusType;
  moscow: MoscowType;
  storyPoints: number;
  assignee: string;
  views: number;
  commentCount?: number;
  comments: IComment[];
  daysInBacklog?: number;
  priorityScore?: number;
  createdAt: string;
}

export interface ISprintRisk {
  riskScorePercentage: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  feedSource: string;
  totalIncidentsAnalyzed: number;
  recentIncidents: Array<{
    title: string;
    pubDate: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
  summary: string;
  mitigationAdvice: string;
}

export interface ITeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  velocity: number;
  assignedTasksCount: number;
  capacityUtilizationPercentage: number;
}

export interface IUserProfile {
  id?: string;
  name: string;
  email?: string;
  role: string;
  token?: string;
  onboarded?: boolean;
  selectedInterestTags?: string[];
  articlesReadCount?: number;
  savedArticlesCount?: number;
  likedArticlesCount?: number;
  algorithmWeights?: {
    techWeight: number;
    newsWeight: number;
    designWeight: number;
    scienceWeight: number;
  };
  uiSettings?: {
    theme: 'dark' | 'light' | 'paper';
    density: 'compact' | 'comfortable';
  };
}

/* RSS Aggregator Interfaces */
export interface IRssArticle {
  id: string;
  title: string;
  link: string;
  content: string;
  pubDate: string; // Original published date from feed
  harvestDate?: string; // Time fetched by background worker
  feedType: 'RSS' | 'ATOM';
  sourceTitle: string;
  category?: string;
  estimatedReadTimeMinutes?: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

export interface IRssSubscription {
  id: string;
  title: string;
  feedUrl: string;
  category?: string;
  itemCount?: number;
  icon?: string;
  createdAt: string;
}
