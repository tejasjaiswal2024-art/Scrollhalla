import { Task, MoscowPriority, TaskStatus } from '../models/Task';

export const initialTasks: Task[] = [
  new Task({
    id: 'TASK-101',
    title: 'Implement OAuth 2.0 User Authentication',
    description: 'Setup JWT authentication and secure session tokens for frontend client access.',
    status: TaskStatus.IN_PROGRESS,
    moscow: MoscowPriority.MUST_HAVE,
    storyPoints: 5,
    assignee: 'Tejas Jaiswal',
    views: 42,
    comments: [
      { id: 'CMT-1', author: 'Ria', text: 'Ensure refresh tokens are HTTP-only cookies.', timestamp: new Date().toISOString() },
      { id: 'CMT-2', author: 'DevOps Lead', text: 'Configured secret keys in environment vault.', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  }),
  new Task({
    id: 'TASK-102',
    title: 'Smart Backlog Engagement Algorithm',
    description: 'Design OOAD scoring engine evaluating views, comments, and backlog time.',
    status: TaskStatus.IN_REVIEW,
    moscow: MoscowPriority.MUST_HAVE,
    storyPoints: 8,
    assignee: 'Tejas Jaiswal',
    views: 89,
    comments: [
      { id: 'CMT-3', author: 'Agile Coach', text: 'Great algorithm inspired by Xikipedia dynamic ranking!', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  }),
  new Task({
    id: 'TASK-103',
    title: 'Sprint Risk Score Telemetry Ingestion',
    description: 'Fetch external GitHub RSS feeds and dynamically calculate deployment risk percentage.',
    status: TaskStatus.TO_DO,
    moscow: MoscowPriority.SHOULD_HAVE,
    storyPoints: 5,
    assignee: 'Aarav Sharma',
    views: 28,
    comments: [
      { id: 'CMT-4', author: 'DevOps Lead', text: 'Add resilience fallback when RSS is offline.', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  }),
  new Task({
    id: 'TASK-104',
    title: 'Interactive Agile Kanban Board',
    description: 'Build responsive drag-and-drop Kanban view with MoSCoW prioritization tags.',
    status: TaskStatus.IN_PROGRESS,
    moscow: MoscowPriority.MUST_HAVE,
    storyPoints: 8,
    assignee: 'Priya Patel',
    views: 64,
    comments: [
      { id: 'CMT-5', author: 'UI Designer', text: 'Colors must match MUST_HAVE (Red), SHOULD_HAVE (Gold).', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  }),
  new Task({
    id: 'TASK-105',
    title: 'Export Sprint Analytics to PDF',
    description: 'Allow Scrum Masters to export velocity and burndown charts to downloadable PDF reports.',
    status: TaskStatus.TO_DO,
    moscow: MoscowPriority.COULD_HAVE,
    storyPoints: 3,
    assignee: 'Rohan Gupta',
    views: 12,
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }),
  new Task({
    id: 'TASK-106',
    title: 'Legacy Database Schema Migration Script',
    description: 'Deprecated SQL migration script from legacy project system.',
    status: TaskStatus.TO_DO,
    moscow: MoscowPriority.WONT_HAVE,
    storyPoints: 2,
    assignee: 'Unassigned',
    views: 4,
    comments: [],
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
  })
];

export const initialTeamMembers = [
  {
    id: 'DEV-01',
    name: 'Tejas Jaiswal',
    role: 'Senior Full-Stack Engineer',
    avatar: '👨‍💻',
    velocity: 21,
    assignedTasksCount: 2,
    status: 'ACTIVE'
  },
  {
    id: 'DEV-02',
    name: 'Priya Patel',
    role: 'Frontend UI/UX Specialist',
    avatar: '👩‍🎨',
    velocity: 18,
    assignedTasksCount: 1,
    status: 'ACTIVE'
  },
  {
    id: 'DEV-03',
    name: 'Aarav Sharma',
    role: 'DevOps & Cloud Engineer',
    avatar: '🛠️',
    velocity: 15,
    assignedTasksCount: 1,
    status: 'ACTIVE'
  },
  {
    id: 'DEV-04',
    name: 'Ria Sen',
    role: 'Scrum Master & Product Owner',
    avatar: '👩‍💼',
    velocity: 12,
    assignedTasksCount: 0,
    status: 'ACTIVE'
  }
];
