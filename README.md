# Sciflix

A modern, full-stack movie and TV discovery platform built with Next.js 16, Clerk, Neon, and Drizzle ORM.

[![CI](https://github.com/Projects-lucky/sciflix/actions/workflows/ci.yml/badge.svg)](https://github.com/Projects-lucky/sciflix/actions/workflows/ci.yml)

**Live demo:** (https://sciflix-flame.vercel.app/)

![Sciflix Hero](./public/screenshots/hero.png)

---

## ✨ Features

### Discovery
- **Home page** with trending hero carousel, trending people, and genre-based sections for movies and TV.
- **Browse pages** for Movies, TV Shows, and People with infinite scroll.
- **Advanced filtering** — genre, sort order, origin country, original language, date range, vote average, network, and certification.
- **Full-text search** across movies, TV shows, and people with 300ms debounce.

### Content
- **Detail pages** for movies, TV shows, and people with cast, crew, similar titles, and seasons.
- **Trailer playback** in a global modal, fetched lazily on card hover.
- **Responsive design** — mobile-first, scaling smoothly from 320px to ultrawide displays.

### Personalization
- **Authentication** with Clerk (email and social sign-in).
- **Personal watchlist** — save items, mark as watched, and filter by status.
- **Theme toggle** — light, dark, and system preferences.

### Engineering
- **Secure TMDB proxy** — the API token is never exposed to the browser.
- **Server-first data fetching** — Server Components by default, Client Components only where interactivity demands it.
- **Fault-tolerant API layer** — retry with exponential backoff and graceful fallbacks.
- **URL-driven filter state** — shareable, bookmarkable filters via `nuqs`.
- **106 unit tests** with Vitest for robust reliability.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org) (strict mode) |
| **Auth** | [Clerk](https://clerk.com) |
| **Database** | [Neon](https://neon.tech) (serverless Postgres) |
| **ORM** | [Drizzle](https://orm.drizzle.team) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Data fetching** | [TanStack Query](https://tanstack.com/query) |
| **URL state** | [nuqs](https://nuqs.47ng.com) |
| **Validation** | [Zod](https://zod.dev) |
| **Icons** | [Lucide](https://lucide.dev) |
| **Lint + Format** | [Biome](https://biomejs.dev) |
| **Testing** | [Vitest](https://vitest.dev) |
| **Data source** | [TMDB API v3](https://developers.themoviedb.org/3) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📸 Screenshots

| Home | Movie Detail |
|------|--------------|
| ![Home](./public/screenshots/home.png) | ![Detail](./public/screenshots/detail.png) |

| Search | Watchlist |
|--------|-----------|
| ![Search](./public/screenshots/search.png) | ![Watchlist](./public/screenshots/watchlist.png) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 22 or later
- **pnpm** 10 or later
- A **[Neon](https://neon.tech)** account
- A **[Clerk](https://clerk.com)** account
- A **TMDB** API Read Access Token — [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Installation
```bash
git clone https://github.com/Projects-lucky/sciflix.git
cd sciflix
pnpm install
```

## Environment Variables

### Create a .env.local file in the project root:
# TMDB — Read Access Token (Bearer token, not the API key)
TMDB_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiJ9..."
TMDB_API_BASE_URL="https://api.themoviedb.org/3"

# Clerk — from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Neon — pooled connection for the app
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/movieapp?sslmode=require"

# Neon — direct connection for migrations (remove "-pooler" from the hostname)
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxx.region.aws.neon.tech/movieapp?sslmode=require"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

> [!IMPORTANT]
> The `TMDB_ACCESS_TOKEN` must be a **Bearer token** (Read Access Token), *not* the standard API key. You can generate and find this under "API Read Access Token" in your [TMDB account settings](https://www.themoviedb.org/settings/api).
> 
### 🗄️ Database Setup

```bash
# Generate migration files from schema
pnpm drizzle-kit generate

# Apply migrations to your Neon database
pnpm drizzle-kit migrate
```
Verify the watchlist_items table exists in your Neon Console.

## Run Locally
```bash
pnpm dev
```

Open http://localhost:3000.

## Testing
pnpm test          # Watch mode
pnpm test --run    # Single run (CI)
pnpm test:ui       # Vitest UI

## Linting
pnpm lint              # Check only
pnpm lint --write      # Auto-fix
pnpm format            # Format all files

## 📂 Project Structure

This project follows a clean, module-based directory structure inside the `src/` directory, leveraging the Next.js App Router:

```text
sciflix/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions workflow for continuous integration
├── src/
│   ├── app/                          # Next.js App Router pages and entrypoints
│   │   ├── actions/                  # Server Actions (e.g., watchlist management)
│   │   ├── movie/                    # Movie browsing pages & layout details
│   │   ├── tv/                       # TV show browsing pages & layout details
│   │   ├── person/                   # Cast & crew profile details
│   │   ├── search/                   # Search results engine page
│   │   ├── watchlist/                # User personal watchlist dashboard
│   │   ├── providers.tsx             # Context provider wrapper (Clerk, React Query, nuqs, video)
│   │   └── layout.tsx                # Application root layout layout
│   ├── components/                   # Reusable UI component modules
│   │   ├── filters/                  # Dynamic & static search filter UI
│   │   ├── layout/                   # Global components (Header, Footer, Theme toggle)
│   │   ├── movie/                    # Movie specific components (MovieCard, MovieDetail)
│   │   ├── person/                   # Person specific components (PersonCard, PersonDetail)
│   │   ├── search/                   # Interactive search bar & real-time results
│   │   ├── shared/                   # Generic components (Media Carousels, InfiniteScroll view)
│   │   ├── trailer/                  # Global context-driven trailer modal portal
│   │   ├── tv/                       # TV specific layout systems (TVDetail)
│   │   ├── ui/                       # Unstyled atomic primitives (shadcn/ui)
│   │   └── watchlist/                # Reactive watchlist toggle button state
│   ├── db/                           # Database access layer
│   │   ├── index.ts                  # Drizzle ORM client initialization
│   │   ├── schema.ts                 # Relational PostgreSQL table schemas
│   │   ├── queries.ts                # Isolated, reusable type-safe DB queries
│   │   └── migrations/               # Autogenerated raw SQL migration schemas
│   ├── lib/                          # Core application logic & shared configurations
│   │   ├── config/                   # Centralized app definitions (Metadata, Nav, Filters)
│   │   ├── schemas/                  # Zod validation models
│   │   ├── search/                   # nuqs search param parser configurations
│   │   ├── services/tmdb/            # Native TMDB API wrappers & server routes
│   │   ├── utils/                    # Shared utility helper functions
│   │   └── video/                    # State contexts for managing root trailer modals
│   ├── stores/                       # Lightweight client state management (Zustand search history)
│   ├── types/                        # Global TypeScript type definitions
│   └── proxy.ts                      # Clerk authentication middleware & server-side TMDB proxy
├── public/
│   └── screenshots/                  # Asset directory hosting documentation images
├── drizzle.config.ts                 # Database migration configuration file
├── biome.json                        # Biome code formatting and linting configurations
├── vitest.config.mts                 # Unit & integration testing configurations
└── package.json                      # Node dependencies & automation scripts
```


## 🏗️ Key Architectural Decisions

### 🔒 Secure TMDB Proxy
The **TMDB Bearer token** is strictly kept server-side and never exposed to the browser. All client-side requests are routed through `/api/tmdb/*`, which is intercepted by `src/proxy.ts` and rewritten to the official TMDB API with the secure token injected.

### 🌐 Server-First Data Fetching
Data fetching is driven by **React Server Components** by default to optimise performance and initial load times. **Client Components** are strictly reserved for client-side interactivity, such as application filters, infinite scroll, and trailer modals.

### 🔗 URL-Driven Filter State
All user filters are synchronized with the URL query parameters using `nuqs`. This implementation ensures deep-linking capabilities, intuitive browser back/forward navigation, and shareable/bookmarkable search states out of the box.

### ⚙️ Single Source of Truth for Config
Application metadata, navigation schemas, and filter options are centralized inside `src/lib/config/`. Updating configurations in this single directory automatically propagates changes throughout the entire codebase.

### 🗄️ Two-Connection Database Strategy
Database connections are split into two distinct environment strings to handle scaling efficiently:
* **Pooled (`DATABASE_URL`):** Utilized for standard runtime application queries routed through **PgBouncer** to manage connection concurrency.
* **Direct (`DATABASE_URL_UNPOOLED`):** Utilized for executing database migrations, which require a direct, persistent connection session.

### 🎬 Global Trailer Context
To optimize DOM performance and avoid prop drilling, a single `<GlobalTrailer />` modal sits at the root level of the application. It is managed globally via React Context, allowing any media card or detail page to launch trailers using the custom `usePlayTrailer()` hook without mounting duplicate modal instances.

## 🧪 Testing

The test suite provides comprehensive test coverage across all core TMDB service functions. 

To run the full test suite once, execute the following command:

```bash
pnpm test --run
```
### 📊 Test Suite Coverage

The suite validates all endpoints and operations with the following test distribution:

| File | Tests |
| :--- | :--- |
| `trending.test.ts` | 10 |
| `genres.test.ts` | 21 |
| `discover.test.ts` | 21 |
| `details.test.ts` | 18 |
| `search.test.ts` | 19 |
| `multi.test.ts` | 16 |
| `sample.test.ts` | 1 |
| **Total** | **106** |

---

## 🚀 Deployment

### Vercel
This project is configured for continuous deployment on **Vercel** with automatic builds triggered from the `main` branch.

#### Required Environment Variables
Configure these variables in your Vercel Dashboard under **Project Settings → Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `TMDB_ACCESS_TOKEN` | TMDB Bearer token *(Secret)* |
| `TMDB_API_BASE_URL` | `https://api.themoviedb.org/3` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key *(Secret)* |
| `DATABASE_URL` | Neon pooled connection *(Secret)* |
| `DATABASE_URL_UNPOOLED` | Neon direct connection *(Secret)* |
| `NEXT_PUBLIC_APP_URL` | Production application URL |

#### Deploy Your Own Instance
1. **Fork** this repository.
2. **Import** the forked repository into Vercel.
3. **Add** the environment variables listed above.
4. Click **Deploy**.

---

## 🗄️ Database Migrations

Always execute migrations manually against production. Do **not** trigger migrations automatically during the build process:

```bash
DATABASE_URL_UNPOOLED="your-prod-unpooled-url" pnpm drizzle-kit migrate
```

---

## 🔒 Security

* **Token Protection:** The TMDB token never leaves the server-side environment.
* **Access Control:** Cross-user watchlist access is strictly blocked at the database query level.
* **HTTP Headers:** Safe configuration of standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
* **Authentication:** Robust session validation managed entirely via **Clerk**.
* **Input Validation:** Strict server-side type and value verification via **Zod** on all input filters.
* **SQL Injection Safety:** Built-in protection leveraging **Drizzle ORM** parameterized queries.

---

## 🗺️ Roadmap

- [ ] User reviews and ratings
- [ ] Automated content recommendations based on user watchlists
- [ ] Social sharing functionality for custom watchlists
- [ ] Progressive Web App (PWA) installation support
- [ ] Multi-language UI localization
- [ ] Advanced search mechanisms (fuzzy text matching, integrated filters)

---

## 📄 License

Distributed under the **MIT License**. See the `LICENSE` file for more details.

---

## 🤝 Acknowledgments

* **TMDB** — For the extensive movie and TV metadata engine.
* **Clerk** — For drop-in, bulletproof user authentication.
* **Neon** — For serverless Postgres infrastructure that scales down to zero.
* **Vercel** & **Next.js** — For the deployment architecture and framework foundation.
* **shadcn/ui** — For beautiful, customizable components that respect code ownership.
* **Biome** — For lightning-fast codebase formatting and linting toolchains.

*Built with 💻 by Projects-lucky*
