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
  }
];

export const curatedAwesomeFeeds: IRssSubscription[] = [
  { id: 'SUB-1', title: 'Reuters World News', feedUrl: 'https://www.reutersagency.com/feed/?best-topics=world-news', category: 'World News', itemCount: 45, icon: '🌐', createdAt: new Date().toISOString() },
  { id: 'SUB-2', title: 'BBC News World', feedUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World News', itemCount: 60, icon: '🌍', createdAt: new Date().toISOString() },
  { id: 'SUB-3', title: 'The Hindu Top Stories', feedUrl: 'https://www.thehindu.com/feeder/default.rss', category: 'India & World', itemCount: 35, icon: '📰', createdAt: new Date().toISOString() },
  { id: 'SUB-4', title: 'NDTV Top Stories', feedUrl: 'https://feeds.feedburner.com/ndtvnews-top-stories', category: 'India & World', itemCount: 40, icon: '📺', createdAt: new Date().toISOString() },
  { id: 'SUB-5', title: 'Hacker News RSS', feedUrl: 'https://news.ycombinator.com/rss', category: 'Tech & Engineering', itemCount: 30, icon: '💻', createdAt: new Date().toISOString() },
  { id: 'SUB-6', title: 'TechCrunch', feedUrl: 'https://techcrunch.com/feed/', category: 'Tech & Startups', itemCount: 25, icon: '🚀', createdAt: new Date().toISOString() },
  { id: 'SUB-7', title: 'Ars Technica', feedUrl: 'http://feeds.arstechnica.com/arstechnica/index', category: 'Tech & Science', itemCount: 20, icon: '🔬', createdAt: new Date().toISOString() },
  { id: 'SUB-8', title: 'MIT Technology Review', feedUrl: 'https://www.technologyreview.com/feed/', category: 'Science & AI', itemCount: 15, icon: '🤖', createdAt: new Date().toISOString() },
  { id: 'SUB-9', title: 'Reddit r/technology RSS', feedUrl: 'https://www.reddit.com/r/technology/.rss', category: 'Tech & Engineering', itemCount: 50, icon: '👾', createdAt: new Date().toISOString() }
];

export const sampleArticlesList: IRssArticle[] = [
  {
    id: 'ART-101',
    title: 'Reuters World News: Global Economic Telemetry & Trade Outlook 2026',
    link: 'https://www.reuters.com',
    content: 'Global supply chains stabilize as new digital infrastructure standards reduce cross-border clearance latency. Central banks report positive inflation convergence metrics.',
    pubDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    harvestDate: new Date().toISOString(),
    feedType: 'RSS',
    sourceTitle: 'Reuters World News',
    category: 'World News',
    estimatedReadTimeMinutes: 4,
    isBookmarked: false,
    isLiked: false
  },
  {
    id: 'ART-102',
    title: 'BBC News: Breakthrough Solar Storage Grid Deployed in Southern Europe',
    link: 'https://www.bbc.com/news',
    content: 'Next-generation solid-state energy storage facilities reach 94% round-trip efficiency in municipal trials across Spain and Portugal.',
    pubDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    harvestDate: new Date().toISOString(),
    feedType: 'RSS',
    sourceTitle: 'BBC News World',
    category: 'World News',
    estimatedReadTimeMinutes: 3,
    isBookmarked: false,
    isLiked: true
  },
  {
    id: 'ART-103',
    title: 'The Hindu: ISRO Announces Mission Parameters for Advanced Telemetry Satellite',
    link: 'https://www.thehindu.com',
    content: 'India space agency confirms successful static engine tests for upcoming geostationary payload designed for high-resolution oceanographic monitoring.',
    pubDate: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    harvestDate: new Date().toISOString(),
    feedType: 'RSS',
    sourceTitle: 'The Hindu',
    category: 'India & World',
    estimatedReadTimeMinutes: 5,
    isBookmarked: true,
    isLiked: true
  },
  {
    id: 'ART-104',
    title: 'Hacker News: Building Distributed Zero-Latency RSS Aggregators with Redis',
    link: 'https://news.ycombinator.com',
    content: 'An architectural review on pairing node-cron background feed harvesters with Redis in-memory caches to serve millions of concurrent readers under 50ms.',
    pubDate: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    harvestDate: new Date().toISOString(),
    feedType: 'ATOM',
    sourceTitle: 'Hacker News RSS',
    category: 'Tech & Engineering',
    estimatedReadTimeMinutes: 6,
    isBookmarked: true,
    isLiked: true
  },
  {
    id: 'ART-105',
    title: 'TechCrunch: Open Source AI Foundation Models Achieve Real-Time Inference Efficiency',
    link: 'https://techcrunch.com',
    content: 'New quantized model architectures enable 70B parameter LLMs to run locally on consumer workstations with under 4GB memory bandwidth overhead.',
    pubDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    harvestDate: new Date().toISOString(),
    feedType: 'RSS',
    sourceTitle: 'TechCrunch',
    category: 'Tech & Startups',
    estimatedReadTimeMinutes: 4,
    isBookmarked: false,
    isLiked: false
  },
  {
    id: 'ART-106',
    title: 'NDTV: Tech Hub Expansion Accelerates Digital Infrastructure Growth',
    link: 'https://www.ndtv.com',
    content: 'Major technology parks report record high hiring velocity for full-stack engineers and DevOps specialists specializing in containerized cloud infrastructure.',
    pubDate: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    harvestDate: new Date().toISOString(),
    feedType: 'RSS',
    sourceTitle: 'NDTV Top Stories',
    category: 'India & World',
    estimatedReadTimeMinutes: 3,
    isBookmarked: false,
    isLiked: false
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

    if (json.data && json.data.length > 0) {
      return json.data.map((art: IRssArticle) => {
        const words = (art.content || art.title || '').split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(words / 200));
        return {
          ...art,
          estimatedReadTimeMinutes: readTime,
          pubDate: art.pubDate || new Date().toISOString()
        };
      });
    }
    return sampleArticlesList;
  } catch (err) {
    return sampleArticlesList;
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
