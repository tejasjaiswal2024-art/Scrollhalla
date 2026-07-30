# 📜 Scrollhalla

> **E-Reader RSS Aggregator & Agile OOAD Project Management Web Application**  
> *Official Vision Document & Project Documentation*

---

## 📄 Vision Document

### 1. Project Name & Overview
**Scrollhalla** is a high-performance web application combining a **Minimalist E-Reader RSS/Atom Feed Aggregator** with an **Agile OOAD Project Management Engine**. Inspired by Anthropic/Claude's paper typography and Instagram Reels' vertical scrolling interaction model, Scrollhalla enables users to consume feeds distraction-free while allowing software engineering teams to prioritize backlogs dynamically based on engagement telemetry and upstream system risks.

---

### 2. Problem It Solves
1. **Feed Distraction & Ad Clutter**: Commercial RSS newsreaders are overburdened with intrusive advertisements, pop-ups, and engagement traps that destroy reading focus.
2. **Static Project Backlogs**: Traditional Agile project tools treat task backlogs as static lists without evaluating dynamic user telemetry (views, comments, age in backlog) or external system deployment risks.

---

### 3. Target Users (Personas)

#### Persona 1: Alex (The Focused Technical Reader)
- **Background**: Senior Full-Stack Engineer and avid reader.
- **Goals**: Read technical blogs, system status updates, and RSS feeds in a distraction-free E-ink paper aesthetic without pop-ups.
- **Pain Points**: Frustrated by heavy web page bloat, ad tracking, and slow newsreader loading times.

#### Persona 2: Sarah (Agile Scrum Master & Technical Lead)
- **Background**: Engineering Manager leading a sprint team.
- **Goals**: Automatically rank task backlog items based on real interaction telemetry and forecast sprint deployment risks from infrastructure incident feeds.
- **Pain Points**: Manual backlog prioritization is subjective and ignores real-time engagement data.

---

### 4. Vision Statement
To deliver a zero-latency, distraction-free RSS aggregator and Agile workflow hub powered by Object-Oriented Analysis & Design (OOAD) principles, containerized for effortless local and cloud deployment.

---

### 5. Key Features & Goals
- **Minimalist E-Paper Aesthetic**: Warm off-white paper background (`#F4F1EA`), soft charcoal typography (`#2D2D2D`), and serif reading text (`Merriweather`/`Georgia`).
- **Reels-Style Reading Feed**: Vertical scrolling feed with overlay action buttons (*Like/Tune Algorithm*, *Save/Bookmark*, *Reader Mode*, *External Source*).
- **Onboarding Setup Wizard**: 3-step interest tag selection grid inspired by `xikipedia` to bootstrap user recommendations.
- **OOAD Feed Parser Factory**: Factory Design Pattern instantiating `RssParser` and `AtomParser` dynamically.
- **Background Cron & Redis Cache**: `node-cron` worker harvesting feeds every 15 minutes into a Redis cache for < 50ms latency.
- **Smart Backlog Scoring**: Dynamic urgency algorithm inspired by Xikipedia engagement telemetry metrics.
- **Sprint Risk Telemetry**: Continuous deployment risk scoring calculated from live RSS feeds (GitHub Status).
- **OPML Data Portability**: Full OPML 2.0 XML feed import and export capabilities.

---

### 6. Success Metrics
- **Feed Latency**: < 50ms response time on cached feed timeline queries (`GET /api/feed`).
- **Parsing Accuracy**: 100% compliance across RSS 2.0 and Atom 1.0 specifications.
- **Build Quality**: Zero compilation/lint errors across Frontend (Vite React TypeScript) and Backend (Node.js Express TypeScript).

---

### 7. Assumptions & Constraints
- **Assumptions**: Docker Desktop environment available for containerized orchestration.
- **Constraints**: Compliance with Digital Assignment 1 specifications, clean GitHub Flow branching, and responsive mobile-first views expanding gracefully for Desktop.

---

## 💡 Inspirations & Technical References

1. **[rebane2001/xikipedia](https://github.com/rebane2001/xikipedia)**:
   - *Inspiration*: Dynamic interaction telemetry scoring engine and interest-tag onboarding selection model used to compute dynamic feed ranking weights.
2. **[Anthropic / Claude](https://claude.ai)**:
   - *Inspiration*: Minimalist e-reader aesthetic, warm paper background (`#F4F1EA`), soft charcoal contrast (`#2D2D2D`), and elegant serif typography (`Merriweather`/`Georgia`).
3. **Instagram Reels**:
   - *Inspiration*: Vertical full-card scrolling reading stream with minimalist right-overlay action controls.
4. **[plenaryapp/awesome-rss-feeds](https://github.com/plenaryapp/awesome-rss-feeds)**:
   - *Inspiration*: Curated RSS feed discovery directory catalog featuring Reuters World News, BBC News, The Hindu, NDTV, Hacker News, TechCrunch, Ars Technica, and MIT Tech Review.

---

## 🚀 Quick Start – How to Run

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) (v18+) for manual development.

---

### Option A: Launch with Docker Compose (Recommended)
Run a single command from the project root directory:

```bash
docker-compose up --build
```

#### Application Endpoints
- 🌐 **Frontend App**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend Health Check**: [http://localhost:8080/health](http://localhost:8080/health)
- 📊 **Timeline Feed (Redis Cache)**: [http://localhost:8080/api/feed](http://localhost:8080/api/feed)
- 🚨 **Sprint Risk Index**: [http://localhost:8080/api/sprint-risk](http://localhost:8080/api/sprint-risk)
- 🗄️ **PostgreSQL Database**: `localhost:5432`

---

### Option B: Standalone Docker Container Run Commands

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
docker run -d --network scrollhalla-net -p 3000:80 scrollhalla-frontend
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
│   │   │   ├── MoSCoWBadge.tsx   # Color-coded MoSCoW tag badges
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
│   │   │   ├── apiService.ts     # REST API client with JWT Bearer header
│   │   │   └── opmlService.ts    # OPML 2.0 XML feed export and import service
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces for RSS and Agile domain
│   │   ├── App.tsx               # Main React Router setup & onboarding guard
│   │   ├── index.css             # E-Reader Warm Paper (#F4F1EA) CSS design system
│   │   └── main.tsx              # React app mounting entrypoint
│   ├── Dockerfile                # Multi-stage Vite React build + Nginx web server
│   ├── nginx.conf                # Production Nginx reverse proxy configuration
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── init.sql                  # PostgreSQL database initialization & seed script
├── .gitignore                    # Excludes docs/, node_modules/, secrets, etc.
├── docker-compose.yml            # Multi-container orchestration (postgres, redis, backend, frontend)
├── ARCHITECTURE.md               # System Architecture Diagram (Mermaid)
└── README.md                     # Official Vision Document & Project Documentation
```