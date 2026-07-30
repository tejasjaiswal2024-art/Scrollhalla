# 📐 Scrollhalla - System Architecture & Data Flow Diagram

This document contains the official Mermaid system architecture diagram for **Scrollhalla**, illustrating the data flow across the client, backend API server, background cron worker, data layer, and external RSS telemetry feeds.

---

## 📊 System Architecture Diagram (Mermaid)

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

---

## 🔍 Architecture Component Breakdown

### 1. Frontend Layer (`scrollhalla-frontend`)
- **Vite React SPA**: Mobile-first E-Reader UI adhering to warm paper aesthetics (`#F4F1EA`), featuring Instagram Reels-style vertical feed scrolling and Anthropic/Claude serif typography.
- **Nginx Web Server**: Multi-stage production container exposing port `3000` (mapped to internal port `80`) and proxying `/api/` HTTP requests to the backend server.

### 2. Backend API Layer (`scrollhalla-backend`)
- **Express API Server**: High-performance Node.js server exposing REST endpoints (`/api/feed`, `/api/auth`, `/api/smart-backlog`, `/api/sprint-risk`).
- **Background Cron Worker**: `node-cron` process executing every 15 minutes (`*/15 * * * *`) to harvest RSS and Atom feeds asynchronously without blocking client requests.
- **FeedParserFactory**: Object-Oriented Factory pattern instantiating `RssParser` or `AtomParser` dynamically based on XML payload signatures.
- **JWT Auth Guard**: Middleware verifying `Authorization: Bearer <token>` HTTP headers.

### 3. Data & Caching Layer (`scrollhalla-postgres` & `scrollhalla-redis`)
- **Redis Cache (`:6379`)**: In-memory caching engine storing pre-parsed timeline JSON arrays (`scrollhalla:timeline:global`) to achieve < 50ms read latency.
- **PostgreSQL Database (`:5432`)**: Persistent relational database managed via Prisma ORM storing Users, Subscriptions, Articles, and Bookmarks.
