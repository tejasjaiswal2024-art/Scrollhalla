import { IRssArticle, IRssSubscription } from '../types';

const API_BASE = '/api';

export const mockTasksData = [
  {
    id: 'TASK-101',
    title: 'Implement OAuth 2.0 User Authentication',
    description: 'Setup JWT authentication and secure session tokens for frontend client access.',
    status: 'IN_PROGRESS',
    moscow: 'MUST_HAVE',
    storyPoints: 5,
    assignee: 'Tejas Jaiswal',
    views: 42,
    commentCount: 2,
    daysInBacklog: 5,
    priorityScore: 148.5,
    comments: [
      { id: 'CMT-1', author: 'Ria', text: 'Ensure refresh tokens are HTTP-only cookies.', timestamp: new Date().toISOString() },
      { id: 'CMT-2', author: 'DevOps Lead', text: 'Configured secret keys in environment vault.', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'TASK-102',
    title: 'Smart Backlog Engagement Algorithm',
    description: 'Design OOAD scoring engine evaluating views, comments, and backlog time.',
    status: 'IN_REVIEW',
    moscow: 'MUST_HAVE',
    storyPoints: 8,
    assignee: 'Tejas Jaiswal',
    views: 89,
    commentCount: 1,
    daysInBacklog: 10,
    priorityScore: 235.8,
    comments: [
      { id: 'CMT-3', author: 'Agile Coach', text: 'Great algorithm inspired by Xikipedia dynamic ranking!', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'TASK-103',
    title: 'Sprint Risk Score Telemetry Ingestion',
    description: 'Fetch external GitHub RSS feeds and dynamically calculate deployment risk percentage.',
    status: 'TO_DO',
    moscow: 'SHOULD_HAVE',
    storyPoints: 5,
    assignee: 'Aarav Sharma',
    views: 28,
    commentCount: 1,
    daysInBacklog: 3,
    priorityScore: 92.4,
    comments: [
      { id: 'CMT-4', author: 'DevOps Lead', text: 'Add resilience fallback when RSS is offline.', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  }
];

export const getAuthToken = (): string | null => {
  return localStorage.getItem('scrollhalla_jwt');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('scrollhalla_jwt', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('scrollhalla_jwt');
};

/**
 * Register User
 */
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, uiSettings: { name } })
    });
    const json = await res.json();
    if (json.token) setAuthToken(json.token);
    return json;
  } catch (err) {
    return { success: false, message: 'Registration server error.' };
  }
};

/**
 * Login User
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (json.token) setAuthToken(json.token);
    return json;
  } catch (err) {
    return { success: false, message: 'Login server error.' };
  }
};

/**
 * Fetch Timeline Feed securely using JWT token
 */
export const fetchFeedTimeline = async (): Promise<IRssArticle[]> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}/feed`, { headers });
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    
    // Add estimated read time
    return (json.data || []).map((art: IRssArticle) => {
      const words = (art.content || art.title || '').split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(words / 200));
      return { ...art, estimatedReadTimeMinutes: readTime };
    });
  } catch (err) {
    console.warn('[apiService] Using fallback timeline items:', err);
    return [
      {
        id: 'ART-1',
        title: 'Building Resilient Microservices with Node.js & Redis',
        link: 'https://dev.to',
        content: 'Learn how to architect high-performance distributed systems using Node.js, Express, and Redis caching layers for zero latency.',
        pubDate: new Date(Date.now() - 3600 * 1000).toISOString(),
        feedType: 'RSS',
        sourceTitle: 'DEV Community',
        estimatedReadTimeMinutes: 4,
        isBookmarked: true
      },
      {
        id: 'ART-2',
        title: 'GitHub Incident Telemetry & System Status Updates',
        link: 'https://www.githubstatus.com',
        content: 'GitHub Actions and Webhooks performance degradation resolved. All systems operating nominally.',
        pubDate: new Date(Date.now() - 7200 * 1000).toISOString(),
        feedType: 'RSS',
        sourceTitle: 'GitHub System Status',
        estimatedReadTimeMinutes: 2,
        isBookmarked: false
      },
      {
        id: 'ART-3',
        title: 'Object-Oriented Analysis & Design Patterns in Modern Web Apps',
        link: 'https://news.ycombinator.com',
        content: 'Discussion on leveraging clean architecture, domain-driven design, and the Factory Pattern for modular software systems.',
        pubDate: new Date(Date.now() - 14400 * 1000).toISOString(),
        feedType: 'ATOM',
        sourceTitle: 'Hacker News RSS',
        estimatedReadTimeMinutes: 5,
        isBookmarked: false
      }
    ];
  }
};

/* Agile Project Management API Helpers */
export const fetchSmartBacklog = async () => {
  try {
    const res = await fetch(`${API_BASE}/smart-backlog`);
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
};

export const fetchSprintRisk = async () => {
  try {
    const res = await fetch(`${API_BASE}/sprint-risk`);
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
};

export const fetchTeam = async () => {
  try {
    const res = await fetch(`${API_BASE}/team`);
    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
};
