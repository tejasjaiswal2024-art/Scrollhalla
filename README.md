# 📜 Scrollhalla

> **E-Reader RSS Aggregator & Agile OOAD Project Management Web Application**  
> *Compliant with Digital Assignment 1 / Review 1 Specifications*

---

## 📄 Vision Document

### 1. Project Name & Overview
**Scrollhalla** is an innovative, high-performance web application combining a **Minimalist E-Reader RSS/Atom Feed Aggregator** with an **Agile OOAD Project Management Engine**. Inspired by Anthropic/Claude's typography and Instagram Reels' vertical scrolling interaction model, Scrollhalla enables users to consume feeds distraction-free while allowing software teams to prioritize backlogs intelligently based on engagement telemetry.

### 2. Problem Statement
Modern digital readers and engineering teams suffer from two core challenges:
1. **Feed Bloat & Distraction**: Commercial newsreaders clutter screens with ads, pop-ups, and engagement traps instead of clean, readable text.
2. **Static Project Backlogs**: Traditional Agile tools treat backlogs as static lists without evaluating dynamic user telemetry (views, comments, backlog age) or external system deployment risks.

### 3. Target Users (Personas)
- **Persona 1: Alex (The Focused Reader / Software Engineer)**
  - *Goal*: Read technical blogs, GitHub system status updates, and RSS feeds in a clean, E-ink paper aesthetic without distractions.
  - *Pain Point*: Annoyed by heavy JavaScript ads and slow page loads.
- **Persona 2: Sarah (Scrum Master & Technical Lead)**
  - *Goal*: Automatically rank backlog tasks based on telemetry and forecast sprint risk percentage from upstream infrastructure incidents.
  - *Pain Point*: Manual backlog prioritization is subjective and ignores real-time engagement data.

### 4. Vision Statement
To deliver a zero-latency, distraction-free RSS aggregator and Agile workflow hub powered by Object-Oriented Analysis & Design (OOAD) principles, containerized for effortless local and cloud deployment.

### 5. Key Features & Goals
- **Minimalist E-Paper Aesthetic**: Warm off-white paper background (`#F4F1EA`), soft charcoal typography (`#2D2D2D`), and serif reading text (`Merriweather`/`Georgia`).
- **Reels-Style Reading Feed**: Vertical scrolling feed with overlay action buttons (*Like/Tune Algorithm*, *Save/Bookmark*, *Reader Mode*, *External Source*).
- **OOAD Feed Parser Factory**: Factory Design Pattern instantiating `RssParser` and `AtomParser` dynamically.
- **Background Cron & Redis Cache**: `node-cron` worker harvesting feeds every 15 minutes into a Redis cache for < 50ms latency.
- **Smart Backlog Scoring**: Dynamic urgency algorithm inspired by Xikipedia engagement metrics.
- **Sprint Risk Telemetry**: Continuous deployment risk scoring calculated from live RSS feeds (GitHub Status).

### 6. Success Metrics
- **Feed Latency**: < 50ms response time on cached feed timeline queries (`GET /api/feed`).
- **Parsing Accuracy**: 100% compliance across RSS 2.0 and Atom 1.0 specifications.
- **Build Quality**: Zero compilation/lint errors across Frontend (Vite React) and Backend (Node.js Express TypeScript).

### 7. Assumptions & Constraints
- **Assumptions**: Users have Docker Desktop installed for containerized deployment.
- **Constraints**: Compliance with Digital Assignment 1 specifications, clean GitHub Flow branching, and responsive mobile-first views expanding gracefully for Desktop.

---

## 📌 25 User Stories (GitHub Projects & Issues Specification)

| # | User Story Title | Persona / User Story | MoSCoW Priority | Acceptance Criteria |
|---|---|---|---|---|
| 1 | Onboarding Topic Selection | As a new user, I want to select interest tags during onboarding so my feed is personalized. | **Must Have** | Displays grid of tag pills; saves selection to profile. |
| 2 | Reels-Style Vertical Feed | As a reader, I want to scroll through articles in a vertical feed with overlay action buttons. | **Must Have** | Full-height cards with right-hand overlay action buttons. |
| 3 | Distraction-Free Focus Reader | As a reader, I want to open an article in an expanded serif reading mode to focus on text. | **Must Have** | Rendered in serif font with font size adjusters (`A- / A+`). |
| 4 | Save Article to Bookmarks | As a reader, I want to bookmark articles so I can access them offline later. | **Must Have** | Toggles bookmark state and saves item to Bookmarks list. |
| 5 | Instant Timeline via Redis | As a user, I want the feed timeline to load instantly (<50ms) using a Redis cache layer. | **Must Have** | `GET /api/feed` serves JSON from Redis cache. |
| 6 | Factory Pattern Feed Parsing | As a backend engineer, I want a Factory pattern to parse RSS and Atom feeds dynamically. | **Must Have** | `FeedParserFactory` returns `RssParser` or `AtomParser`. |
| 7 | Background Cron Harvest | As a system, I want a cron worker running every 15 mins to harvest new articles automatically. | **Must Have** | `node-cron` job updates Redis cache every 15 minutes. |
| 8 | Explore RSS Directory | As a user, I want to browse curated RSS categories to discover new channels. | **Should Have** | Category cards (Tech, Science, Design) with subscribe buttons. |
| 9 | Custom RSS URL Subscription | As a user, I want to paste custom RSS/Atom URLs to add them to my feed. | **Should Have** | Form validates URL and appends channel to subscriptions. |
| 10| E-Ink Paper Theme Toggle | As a user, I want to toggle between Warm Paper (#F4F1EA) and E-Ink Dark (#161616) mode. | **Should Have** | Toggles `[data-theme="dark"]` dynamically across the UI. |
| 11| User Registration with JWT | As a user, I want to create an account securely so my settings are preserved. | **Must Have** | Password hashed with `bcryptjs`; JWT issued upon registration. |
| 12| Secure JWT Login Route | As a user, I want to log in using my credentials to access protected routes. | **Must Have** | Returns signed JWT token stored in client `localStorage`. |
| 13| Protected Profile API Route | As an authenticated user, I want to fetch my profile securely using my JWT token. | **Must Have** | `authenticateJWT` middleware guards `/api/auth/me`. |
| 14| OPML Import & Export | As a user, I want to import/export OPML files to transfer my RSS subscriptions. | **Could Have** | Button triggers OPML file download and upload parsing. |
| 15| Estimated Read Time Badge | As a reader, I want to see estimated read time on article cards before opening them. | **Should Have** | Calculates read time based on 200 words-per-minute heuristic. |
| 16| Smart Backlog Telemetry | As a Scrum Master, I want tasks scored automatically based on user interaction metrics. | **Must Have** | Computes score from views, comments, age, and story points. |
| 17| Sprint Risk Telemetry | As a DevOps engineer, I want a Sprint Risk index calculated from system RSS feeds. | **Must Have** | Analyzes incident keywords from RSS; outputs 0-100% risk index. |
| 18| MoSCoW Tag Visual Indicators| As a Product Owner, I want color-coded badges for MoSCoW task priorities. | **Must Have** | Must Have (Red glow), Should Have (Gold), Could Have (Cyan). |
| 19| Interactive Kanban Board | As a developer, I want to move tasks across workflow columns (To Do, In Progress, Done). | **Must Have** | Updates task workflow status live in the application state. |
| 20| Task Discussion Stream | As a team member, I want to comment on task detail modals to collaborate. | **Must Have** | Appends comment with timestamp; updates engagement metric. |
| 21| Team Workload Management | As a Scrum Master, I want to monitor member target velocity and capacity utilization. | **Should Have** | Progress bars showing assigned story points vs velocity. |
| 22| Multi-Stage Frontend Docker | As a DevOps engineer, I want a multi-stage Dockerfile building Vite React with Nginx. | **Must Have** | Stage 1 builds static assets; Stage 2 serves via Nginx on port 80. |
| 23| Multi-Stage Backend Docker | As a DevOps engineer, I want a multi-stage Dockerfile compiling TypeScript Node.js. | **Must Have** | Stage 1 compiles TS & Prisma; Stage 2 runs Node server on 8080. |
| 24| Docker Compose Healthchecks | As a DevOps engineer, I want Docker Compose to enforce strict startup order. | **Must Have** | Backend waits for `postgres` and `redis` `service_healthy`. |
| 25| OPML Seed Fallback Mode | As a system, I want a fallback mechanism when database RSS feeds are unreachable. | **Should Have** | Serves default seed telemetry when external RSS feeds timeout. |

---

## 🎨 6 Screen Wireframes & MoSCoW Prioritization

### MoSCoW Categorization
- **MUST HAVE**: Onboarding Setup (Screen 1), Main Reading Scroll UI (Screen 2), Reading Focus View (Screen 5).
- **SHOULD HAVE**: Explore RSS Directory (Screen 3), Saved Bookmarks List (Screen 4).
- **COULD HAVE**: Settings & Profile Screen (Screen 6).
- **WONT HAVE (This Release)**: Legacy RSS XML exports.

```
+-----------------------------------+  +-----------------------------------+
| 1. ONBOARDING & SETUP             |  | 2. MAIN SCROLL UI (REELS FEED)    |
| Select your interests:            |  | [DEV Community] • 4 min           |
| [✓ Tech]  [✓ AI]  [  Science]     |  | Article Title in Serif Font...    |
| [✓ Design][  News][✓ OpenSource]  |  | Excerpt text snippet...      (♥) |
|                                   |  |                              (🔖)|
| [   BUILD MY READING FEED   ]     |  |                              (📖)|
+-----------------------------------+  +-----------------------------------+

+-----------------------------------+  +-----------------------------------+
| 3. EXPLORE RSS DIRECTORY          |  | 4. SAVED / BOOKMARKS LIST         |
| 🔍 Search RSS feeds, topics...    |  | 🔖 Saved Articles (3)             |
| Categories:                       |  | +-------------------------------+ |
| [Tech & Eng] [Science] [Design]   |  | | DEV Community • 4 min         | |
| Channels:                         |  | | Building Resilient Micro...   | |
| Hacker News      [ Subscribed ]   |  | +-------------------------------+ |
+-----------------------------------+  +-----------------------------------+

+-----------------------------------+  +-----------------------------------+
| 5. READING / FOCUS VIEW           |  | 6. SETTINGS & PROFILE             |
| ← Back     [A-] [A+] (🔖) (🔗)   |  | User: Tejas Jaiswal               |
| ================================= |  | Appearance Theme:                 |
| Full Article Title in Serif       |  | (•) Warm Paper #F4F1EA            |
| Clean distraction-free body text  |  | ( ) E-Ink Dark #161616            |
| with optimal line-height...       |  | Sync Interval: Every 15 min       |
+-----------------------------------+  +-----------------------------------+
```

---

## 📐 System Architecture & Data Flow Diagram

```mermaid
flowchart TD
    subgraph Client ["Frontend Layer (Container: scrollhalla-frontend)"]
        UI["Vite React SPA (E-Reader Theme)"]
        NGINX["Nginx Web Server (Port 3000 -> 80)"]
    end

    subgraph API ["Backend API Layer (Container: scrollhalla-backend)"]
        EXPRESS["Express API Server (Port 8080)"]
        WORKER["Background Cron Worker (node-cron every 15m)"]
        FACTORY["FeedParserFactory (RssParser / AtomParser)"]
        AUTH["JWT Auth Guard & Controller"]
    end

    subgraph Data ["Data & Cache Layer"]
        REDIS[("Redis Cache (Port 6379)\nKey: scrollhalla:timeline:global")]
        POSTGRES[("PostgreSQL DB (Port 5432)\nUsers, Subscriptions, Bookmarks")]
    end

    UI -->|HTTPS / REST| NGINX
    NGINX -->|Reverse Proxy /api| EXPRESS
    EXPRESS -->|Verify Bearer JWT| AUTH
    EXPRESS -->|Fast GET /api/feed| REDIS
    WORKER -->|Every 15m Cron| FACTORY
    FACTORY -->|Harvest External RSS| EXT["External RSS/Atom Feeds"]
    WORKER -->|Store JSON Timeline| REDIS
    EXPRESS -->|Prisma ORM| POSTGRES
```

### Data Flow Legend
1. **Client Request**: React SPA sends requests to Nginx (`:3000`), which proxies `/api/` to Node Express (`:8080`).
2. **Timeline Cache Read**: `GET /api/feed` queries Redis (`:6379`) returning cached timeline JSON in < 50ms.
3. **Background Worker Harvest**: `node-cron` fires every 15 minutes, calls `FeedParserFactory` to parse RSS/Atom XML, and updates Redis.
4. **Database Operations**: User authentication (`/auth/register`, `/auth/login`) and profile queries execute via Prisma ORM against PostgreSQL (`:5432`).

---

## 🔀 GitHub Flow Branching Strategy

Scrollhalla strictly adheres to the **GitHub Flow** branching model:

```
      feature/ereader-stitch-ui
          o---o---o
         /         \
main ---o-----------o---o---> (Production Protected)
         \             /
          o---o-------o
       bugfix/redis-cache-fallback
```

### Branching Rules
1. **`main` Branch**: Production-ready code. Direct pushing to `main` is restricted; all updates must go through code review and passing CI builds.
2. **Feature Branches (`feature/<feature-name>`)**: All new features (e.g. `feature/feed-parser-factory`, `feature/ereader-stitch-ui`) branch off `main`.
3. **Bugfix Branches (`bugfix/<issue-name>`)**: Dedicated branches for resolving bugs.
4. **Pull Requests**: Pull Requests must pass automated TypeScript build tests (`npm run build`) before being squash-merged into `main`.

---

## 🚀 Quick Start – Local Development

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) (v18+) for manual development.

---

### Option A: Launch with Docker Compose (Recommended)
Run a single command from the project root directory:

```bash
docker-compose up --build
```

#### Verification URLs
- 🌐 **Frontend App**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend Health Check**: [http://localhost:8080/health](http://localhost:8080/health)
- 📊 **Timeline Feed (Redis Cache)**: [http://localhost:8080/api/feed](http://localhost:8080/api/feed)
- 🚨 **Sprint Risk Index**: [http://localhost:8080/api/sprint-risk](http://localhost:8080/api/sprint-risk)
- 🗄️ **PostgreSQL Database**: `localhost:5432`

---

### Option B: Standalone Docker Container Run Commands

If you prefer building and running containers individually:

```bash
# 1. Create Bridge Network
docker network create scrollhalla-net

# 2. Launch PostgreSQL Container
docker run -d --name scrollhalla-postgres \
  --network scrollhalla-net \
  -e POSTGRES_DB=scrollhalla_db \
  -e POSTGRES_USER=scrollhalla_user \
  -e POSTGRES_PASSWORD=scrollhalla_password \
  -p 5432:5432 postgres:15-alpine

# 3. Launch Redis Container
docker run -d --name scrollhalla-redis \
  --network scrollhalla-net \
  -p 6379:6379 redis:7-alpine

# 4. Build & Launch Backend Container
docker build -t scrollhalla-backend ./backend
docker run -d --name scrollhalla-backend \
  --network scrollhalla-net \
  -e PORT=8080 \
  -e DATABASE_URL=postgres://scrollhalla_user:scrollhalla_password@scrollhalla-postgres:5432/scrollhalla_db \
  -e REDIS_HOST=scrollhalla-redis \
  -e REDIS_PORT=6379 \
  -p 8080:8080 scrollhalla-backend

# 5. Build & Launch Frontend Container
docker build -t scrollhalla-frontend ./frontend
docker run -d --name scrollhalla-frontend \
  --network scrollhalla-net \
  -p 3000:80 scrollhalla-frontend
```

---

### Option C: Manual Node.js Local Development

```bash
# 1. Start Backend API & Cron Worker
cd backend
npm install
npm run dev

# 2. In a new terminal, Start Frontend React Client
cd frontend
npm install
npm run dev
```

---

## 🛠️ Local Development Tools Documented

| Tool | Purpose & Usage |
|---|---|
| **Vite** | Next-generation frontend tooling providing lightning-fast HMR for React SPA. |
| **Node.js / Express** | Enterprise backend server environment running REST API endpoints and middleware. |
| **TypeScript** | Strict static typing across frontend and backend for robust code quality. |
| **Prisma ORM** | Next-generation ORM for type-safe database queries against PostgreSQL. |
| **Redis / ioredis** | In-memory key-value caching layer storing harvested JSON timelines. |
| **node-cron** | Background task scheduler harvesting RSS/Atom feeds every 15 minutes. |
| **rss-parser** | Universal XML feed parsing library mapping RSS 2.0 and Atom 1.0 feeds. |
| **Docker & Docker Compose** | Multi-stage containerization and network orchestration engine. |

---

## 📁 Repository Directory Structure

```
Scrollhalla/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma ORM Schema (User, Subscription, Article, Bookmark)
│   ├── src/
│   │   ├── config/
│   │   │   ├── prisma.ts         # Singleton Prisma client instance
│   │   │   └── redis.ts          # Redis client with resilient in-memory fallback
│   │   ├── controllers/
│   │   │   ├── AuthController.ts # JWT Registration, Login & Profile logic
│   │   │   ├── FeedController.ts # GET /api/feed timeline endpoint (Redis cached)
│   │   │   ├── TaskController.ts # Task CRUD & interaction metrics
│   │   │   ├── SmartBacklogController.ts # Dynamic backlog scoring controller
│   │   │   ├── SprintRiskController.ts   # RSS incident risk scoring controller
│   │   │   └── TeamController.ts # Workload & velocity allocation controller
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts # Bearer JWT token guard middleware
│   │   ├── models/
│   │   │   ├── Task.ts           # Task domain entity
│   │   │   └── BacklogItem.ts    # Backlog item model wrapping interaction metrics
│   │   ├── parsers/
│   │   │   ├── BaseParser.ts     # OOAD Abstract Base Parser class
│   │   │   ├── RssParser.ts      # RSS 2.0 Parser subclass
│   │   │   ├── AtomParser.ts     # Atom 1.0 Parser subclass
│   │   │   └── FeedParserFactory.ts # Factory Pattern parser instantiator
│   │   ├── routes/
│   │   │   └── api.ts            # Centralized Express API router
│   │   ├── services/
│   │   │   ├── SmartBacklogService.ts # Dynamic Xikipedia engagement scoring service
│   │   │   └── SprintRiskService.ts   # System status RSS risk calculation service
│   │   ├── workers/
│   │   │   └── feedCronWorker.ts # Background cron job (every 15m) harvesting feeds
│   │   ├── app.ts                # Express app middleware & configuration
│   │   └── server.ts             # Server entrypoint listening on port 8080
│   ├── Dockerfile                # Multi-stage TS build + Node production runtime
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Mobile bottom navigation bar
│   │   │   ├── MoSCoWBadge.tsx   # Color-coded MoSCoW tag badges (Must/Should/Could/Won't)
│   │   │   ├── ReaderViewModal.tsx # Distraction-free serif focus reader modal
│   │   │   └── TaskDetailModal.tsx # Task detail & telemetry modal
│   │   ├── views/
│   │   │   ├── OnboardingView.tsx# Interest selection tag grid (Xikipedia style)
│   │   │   ├── MainTimelineView.tsx # Reels-style vertical reading stream
│   │   │   ├── ExploreView.tsx   # RSS directory (awesome-rss-feeds inspired)
│   │   │   ├── BookmarksView.tsx # Saved articles list
│   │   │   ├── SettingsView.tsx  # E-Ink Warm Paper vs Dark theme & settings
│   │   │   ├── AuthView.tsx      # JWT Login & Registration screen
│   │   │   ├── DashboardView.tsx # Sprint velocity & risk telemetry overview
│   │   │   ├── ProjectBacklogView.tsx # Dynamic Smart Backlog table
│   │   │   ├── KanbanBoardView.tsx    # Interactive 4-column Kanban board
│   │   │   └── TeamManagementView.tsx # Team member capacity bars
│   │   ├── services/
│   │   │   └── apiService.ts     # REST API client with JWT Bearer header
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces for RSS and Agile domain
│   │   ├── App.tsx               # Main React Router setup
│   │   ├── index.css             # E-Reader Warm Paper (#F4F1EA) CSS design system
│   │   └── main.tsx              # React app mounting entrypoint
│   ├── Dockerfile                # Multi-stage Vite React build + Nginx web server
│   ├── nginx.conf                # Production Nginx reverse proxy configuration
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── init.sql                  # PostgreSQL database initialization & seed script
├── .gitignore                    # Configured to exclude docs/, node_modules/, secrets, etc.
├── docker-compose.yml            # Multi-container orchestration (postgres, redis, backend, frontend)
└── README.md
```