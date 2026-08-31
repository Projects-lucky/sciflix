# SciFlix - A Modern Movie & TV Show Discovery Platform

A production-ready movie discovery platform built with Next.js 16, TypeScript, and the TMDB API. 

## Features

* **Advanced Filtering:** Easily sort and filter through a vast catalog of movies and TV shows.
* **Watchlist Management:** Save and organize your favourite titles to watch later.
* **Infinite Scrolling:** Enjoy a seamless browsing experience with continuous content loading.
* **Trailer Playback:** Watch trailers directly within the platform.

## Tech Stack

* **Framework:** Next.js 16
* **Language:** TypeScript
* **Data Source:** TMDB API
* **Database:** Neon Postgres

 ## Table of Contents
About The Project

Features

Tech Stack

Architecture Overview

Project Structure

Prerequisites

Getting Started

Environment Variables

Database Setup

Running the Application

Development Workflow

Deployment Guide

CI/CD Pipeline

Challenges & Solutions

Contributing

License

 ## About The Project
SciFlix is a modern, full-featured movie and TV show discovery platform that leverages The Movie Database (TMDB) API to provide users with a seamless browsing experience. The application combines cutting-edge frontend technologies with robust backend infrastructure to deliver a responsive, feature-rich entertainment discovery tool.

## Features

### Core Features

| Feature | Description |
| :--- | :--- |
| **🔍 Advanced Search** | Search across movies, TV shows, and people with debounced queries |
| **🎯 Smart Filtering** | Filter by genre, year, rating, language, country, runtime, and adult content |
| **♾️ Infinite Scrolling** | Seamless pagination with TanStack Infinite Query |
| **📌 Watchlist** | Save movies and TV shows to a personal watchlist with optimistic updates |
| **🎬 Trailer Modal** | YouTube trailer playback with autoplay and full-screen modal |
| **🌙 Dark Mode** | Built-in theme toggle with system preference detection |
| **📱 Responsive Design** | Optimized for all screen sizes from mobile to desktop |
| **🔐 Authentication** | Clerk-powered authentication with sign-in/sign-up |
| **🏷️ Genre Showcase** | Carousel-based genre browsing with dynamic content |
| **👤 Person Details** | Comprehensive actor/director profiles with filmography |

### Advanced Features

* **Static Generation:** First 10 popular movies/TV shows pre-rendered for performance.
* **ISR (Incremental Static Regeneration):** 1-hour revalidation for fresh content.
* **Parallel Data Fetching:** `Promise.all` for concurrent API requests.
* **Optimistic Updates:** Instant UI feedback for watchlist actions.
* **Error Boundaries:** Graceful error handling with retry mechanisms.
* **Suspense Streaming:** Progressive rendering for heavy components.
* **3D Card Effects:** Tilt and parallax effects on person cards.
* **Toast Notifications:** Rich feedback system with Sonner.

### Technical Specialties

* **Type Safety:** Full TypeScript coverage with strict typing.
* **API Client:** Custom HTTP client with retry logic and exponential backoff.
* **Caching Strategy:** Multi-level caching (service, React Query, HTTP).
* **Data Transformation:** Dedicated transformers for consistent UI data.
* **Database ORM:** Drizzle ORM with type-safe PostgreSQL queries.
* **Accessibility:** WCAG-compliant components with ARIA labels.

## Tech Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | Framework (App Router, RSC, Server Actions) |
| **React 19** | UI Library |
| **TypeScript 5** | Type Safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component Library |
| **Framer Motion** | Animations |
| **Embla Carousel** | Carousel/Slider |
| **Lucide React** | Icons |

### State Management

| Technology | Purpose |
| :--- | :--- |
| **TanStack Query** | Server State & Caching |
| **Zustand** | Client State (Global) |
| **nuqs** | URL Query State |

### Backend & Database

| Technology | Purpose |
| :--- | :--- |
| **Neon PostgreSQL** | Cloud Database |
| **Drizzle ORM** | Database ORM & Migrations |
| **Clerk** | Authentication |

### API & Services

| Technology | Purpose |
| :--- | :--- |
| **TMDB API** | Movie/TV Data |
| **Vercel** | Hosting & Deployment |
| **GitHub Actions** | CI/CD Pipeline |

### Utilities

| Technology | Purpose |
| :--- | :--- |
| **Zod** | Schema Validation |
| **Sonner** | Toast Notifications |
| **React Hook Form** | Form Handling |
| **Intersection Observer** | Infinite Scroll |

## Architecture Overview

### High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js App Router (RSC)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │ Server Comps │  │ Client Comps │  │  API Routes │ │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   TMDB API Client                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │   │
│  │  │ Movies     │  │ TV Shows   │  │ Search/People    │  │   │
│  │  │ Service    │  │ Service    │  │ Service          │  │   │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Internal API Client                      │   │
│  │         (Watchlist CRUD Operations)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Neon PostgreSQL Database                   │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  watchlists table (user_id, media_id, media_type) │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Drizzle ORM (Type-safe Queries)            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```text
User Action → Client Component → API Call → Service → TMDB/DB → Response → Transformer → UI Update
      ↓              ↓              ↓           ↓          ↓           ↓            ↓
    Click        useQuery       apiClient    fetch()    JSON raw   transform     Render
```

## Project Structure

```text
sciflix/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD Pipeline
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/                       # Internal API Routes
│   │   │   └── watchlist/
│   │   │       └── route.ts          # Watchlist CRUD API
│   │   ├── movies/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Movie Detail Page
│   │   │   └── page.tsx              # Movies Listing Page
│   │   ├── tv/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # TV Show Detail Page
│   │   │   └── page.tsx              # TV Shows Listing Page
│   │   ├── person/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Person Detail Page
│   │   │   └── page.tsx              # People Listing Page
│   │   ├── search/
│   │   │   └── page.tsx              # Search Page
│   │   ├── watchlist/
│   │   │   └── page.tsx              # Watchlist Page
│   │   ├── sign-in/
│   │   │   └── page.tsx              # Sign In Page
│   │   ├── sign-up/
│   │   │   └── page.tsx              # Sign Up Page
│   │   ├── layout.tsx                # Root Layout
│   │   └── page.tsx                  # Homepage
│   ├── components/                    # Reusable Components
│   │   ├── filters/                   # Filter Components
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FilterContainer.tsx
│   │   │   ├── GenreFilter.tsx
│   │   │   ├── YearFilter.tsx
│   │   │   ├── RatingFilter.tsx
│   │   │   ├── SortFilter.tsx
│   │   │   ├── LanguageFilter.tsx
│   │   │   ├── CountryFilter.tsx
│   │   │   ├── RuntimeFilter.tsx
│   │   │   ├── IncludeAdultFilter.tsx
│   │   │   └── FilterActions.tsx
│   │   ├── home/                      # Homepage Components
│   │   │   ├── AsyncSections.tsx
│   │   │   ├── HeroCarousel.tsx
│   │   │   └── GenreShowcase.tsx
│   │   ├── media/                     # Media Components
│   │   │   ├── MediaDetail.tsx
│   │   │   ├── MediaDetailContent.tsx
│   │   │   ├── MediaCast.tsx
│   │   │   └── MediaSimilar.tsx
│   │   ├── person/                    # Person Components
│   │   │   ├── PersonDetail.tsx
│   │   │   ├── PersonCard.tsx
│   │   │   └── PersonGrid.tsx
│   │   ├── shared/                    # Shared Components
│   │   │   ├── MediaCard.tsx
│   │   │   ├── MediaGrid.tsx
│   │   │   ├── WatchlistButton.tsx
│   │   │   ├── InfiniteScrollWrapper.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── ui/                        # shadcn/ui Components
│   │   ├── header/                    # Header Components
│   │   └── footer/                    # Footer Components
│   ├── constants/                     # Configuration
│   │   ├── api.ts                    # TMDB API Config
│   │   ├── filters.ts                # Filter Options
│   │   └── search.ts                 # Search Config
│   ├── db/                            # Database
│   │   ├── schema.ts                 # Drizzle Schema
│   │   └── index.ts                  # DB Connection
│   ├── hooks/                         # Custom Hooks
│   │   ├── useWatchlist.ts
│   │   ├── useTrailer.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useMovieFilters.ts
│   │   └── useTVFilters.ts
│   ├── lib/                           # Utilities
│   │   ├── retry.ts
│   │   ├── timeout.ts
│   │   ├── toast-events.ts
│   │   ├── dedupe-helpers.ts
│   │   └── sleep.ts
│   ├── providers/                     # Context Providers
│   │   ├── InfiniteScrollProvider.tsx
│   │   ├── TanstackProviders.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── SonnerListenerProvider.tsx
│   ├── services/                      # API Services
│   │   ├── api/
│   │   │   ├── client.ts             # TMDB API Client
│   │   │   └── internal.client.ts    # Internal API Client
│   │   └── tmdb/
│   │       ├── movies.service.ts
│   │       ├── tv.service.ts
│   │       ├── person.service.ts
│   │       ├── search.service.ts
│   │       ├── trending.service.ts
│   │       ├── genres.service.ts
│   │       └── trailer.service.ts
│   ├── store/                         # Zustand Stores
│   │   └── trailer.store.ts
│   ├── transformers/                  # Data Transformers
│   │   ├── common.ts
│   │   ├── movie.transformer.ts
│   │   ├── tv.transformer.ts
│   │   ├── person.transformer.ts
│   │   ├── search.transformer.ts
│   │   └── trending.transformer.ts
│   └── types/                         # TypeScript Types
│       ├── common.ts
│       ├── movie.ts
│       ├── tv.ts
│       ├── person.ts
│       ├── genre.ts
│       └── watchlist.ts
├── public/                            # Static Assets
├── .env.local                         # Environment Variables (local)
├── .env.example                       # Environment Variables (template)
├── .gitignore                         # Git Ignore
├── package.json                       # Dependencies
├── package-lock.json                  # Lockfile
├── tsconfig.json                      # TypeScript Config
├── tailwind.config.js                 # Tailwind Config
├── next.config.js                     # Next.js Config
├── drizzle.config.ts                  # Drizzle Config
├── vercel.json                        # Vercel Config
└── README.md                          # Documentation
```

## Prerequisites

Before you begin, ensure you have met the following requirements:

| Requirement | Version |
| :--- | :--- |
| **Node.js** | v20+ |
| **npm** | v10+ |
| **Git** | v2.40+ |
| **Neon PostgreSQL** | v15+ |
| **VS Code** | Latest (recommended) |

### Required Accounts

| Service | Purpose |
| :--- | :--- |
| [TMDB](https://www.themoviedb.org/signup) | API Key & Access Token |
| [Neon](https://neon.tech) | Serverless PostgreSQL Database |
| [Clerk](https://clerk.com) | User Authentication & Management |
| [Vercel](https://vercel.com) | Hosting & Deployment Platform |
| [GitHub](https://github.com) | Source Code Repository & CI/CD Pipelines |

---

## Getting Started

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Projects-lucky/sciflix.git

# Navigate to project directory
cd sciflix
```

### Step 2: Install Dependencies

Select your preferred package manager to initialize setup:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
```

### Step 4: Configure Database

#### A. Create Neon PostgreSQL Database
1. Go to your [Neon Console](https://neon.tech).
2. Create a new project workspace.
3. Copy your project connection string from the dashboard.

#### B. Set Up Drizzle Migrations
```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit push
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Your local instance will be running smoothly at: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

Create a `.env.local` file in your root folder and add the following keys:

```env
# ============================================
# TMDB API Configuration
# ============================================
TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_read_token_here
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# ============================================
# Clerk Authentication
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ============================================
# Database Configuration (Neon PostgreSQL)
# ============================================
DATABASE_URL=postgresql://username:password@hostname.neon.tech/database?sslmode=require

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Fetching Credentials Externally

* **TMDB API:** Register an account at [The Movie Database](https://www.themoviedb.org/signup). Navigate to your account settings profile, access the **API** subtab, and click request credentials to produce a Read Access Token.
* **Clerk Authentication:** Head into [Clerk App Config](https://clerk.com), create a new app cluster, select your authentication providers, and extract the generated keys instantly.
* **Neon Database:** Sign up via [Neon Core](https://neon.tech) and instantly spawn a serverless engine instance. Copy the direct pooling `DATABASE_URL` setup link directly from your main interface string.

---

## Database Setup

### Drizzle ORM Configuration

Save your framework metadata pathways inside `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Database Schema Definition

Your data blueprint structures live in `src/db/schema.ts`:

```typescript
import { pgTable, uuid, text, integer, numeric, timestamp, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core'

export const mediaTypeEnum = pgEnum('media_type', ['MOVIE', 'TV'])

export const watchlists = pgTable(
  'watchlists',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    mediaId: integer('media_id').notNull(),
    mediaType: mediaTypeEnum('media_type').notNull(),
    title: text('title').notNull(),
    poster: text('poster'),
    rating: numeric('rating', { precision: 3, scale: 1 }),
    year: text('year'),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('unique_user_media_idx').on(table.userId, table.mediaId, table.mediaType),
    index('user_id_idx').on(table.userId),
  ]
)
```

### Database Migration Control

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration to database
npx drizzle-kit push

# Check migration status
npx drizzle-kit check

# Studio (visual database management tool)
npx drizzle-kit studio
```

---

## Running the Application

Manage scripts using your project scripts engine setup:

```bash
# Development Mode
npm run dev

# Production Build compilation
npm run build

# Start production server compilation locally
npm run start

# Static Code Diagnostics & Type Validation
npm run type-check

# Lint execution rules
npm run lint

# Prettier format enforcement
npm run format
```

## Development Workflow

Follow this clean workflow when introducing changes or submitting code to the repository:

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes & Validate Code Quality
```bash
# Write your code modifications...

# Execute test suite configurations
npm run test

# Check type compliance
npm run type-check

# Execute linting policies
npm run lint
```

### 3. Commit Changes
Ensure you follow standard semantic commit guidelines where applicable:
```bash
git add .
git commit -m "feat: add your feature description"
```

### 4. Push to GitHub
```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request
* Navigate to your main [GitHub Project Repository](https://github.com).
* Open a new Pull Request comparing your `feature/your-feature-name` branch against the `main` branch.

---

## Deployment Guide

### Deploying to Vercel

Choose one of the following methods to ship your Next.js application:

#### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI tool globally
npm i -g vercel

# Authenticate into your Vercel engine profile
vercel login

# Generate a temporary preview deployment instance
vercel

# Dispatch and build directly to production
vercel --prod
```

#### Method 2: Vercel Dashboard GUI
1. Navigate to the [Vercel Dashboard](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your active GitHub repository link from the profile picker.
4. Expand the **Environment Variables** tray and fill in your matching keys.
5. Click **Deploy**.

### Environment Variables Matrix on Vercel

Ensure these key-value configurations match inside your target cloud production instance console panel:

| Variable Name | Production Expected Mapping Environment Value |
| :--- | :--- |
| `TMDB_ACCESS_TOKEN` | Your secure TMDB Access Token string |
| `TMDB_API_READ_ACCESS_TOKEN` | Your TMDB API Read Token |
| `NEXT_PUBLIC_TMDB_API_BASE_URL` | `https://api.themoviedb.org/3` |
| `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`| Your Clerk Publishable Public Key |
| `CLERK_SECRET_KEY` | Your private Clerk Secret Token string |
| `DATABASE_URL` | Your Neon Serverless PostgreSQL instance link string |

---

## CI/CD Pipeline

### GitHub Actions Workflow configuration

Save this automation script directly into your repository file pathway at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js Engine
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Compile and Build App Bundle
        run: npm run build
        env:
          TMDB_ACCESS_TOKEN: dummy
          TMDB_API_READ_ACCESS_TOKEN: dummy
          NEXT_PUBLIC_TMDB_API_BASE_URL: https://api.themoviedb.org/3
          NEXT_PUBLIC_TMDB_IMAGE_BASE_URL: https://image.tmdb.org/t/p
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: dummy
          CLERK_SECRET_KEY: dummy
          DATABASE_URL: postgresql://dummy
      
      - name: Dispatch and Ship Bundle to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod
```

### GitHub Secrets Required Configuration

To allow GitHub Actions to build your instance smoothly, configure these items in **Settings → Secrets and Variables → Actions**:

| Secret Key Target | Where to Retrieve Credentials |
| :--- | :--- |
| `VERCEL_TOKEN` | Vercel Dashboard Account Profile Panel → Tokens Tab |
| `VERCEL_ORG_ID` | Vercel Project Panel Dashboard → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel Project Panel Dashboard → Target Project → Settings |
| `TMDB_ACCESS_TOKEN` | TMDB API Platform Token Core |
| `TMDB_API_READ_ACCESS_TOKEN`| TMDB Developer Settings Dashboard Profile |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Authentication Engine App Dashboard |
| `CLERK_SECRET_KEY` | Clerk Secret Key Credentials Block |
| `DATABASE_URL` | Neon Project Management Portal Endpoint Connection string |


## Challenges & Solutions

### Challenge 1: Real-time Watchlist Updates
* **Problem:** Watchlist changes needed immediate UI feedback without triggering a full page refresh.
* **Solution:** Implemented TanStack Query utilizing optimistic update routines to populate client interfaces during network flight time.

```typescript
// Optimistic update pattern
onSuccess: (newItem) => {
  queryClient.setQueryData(['watchlist'], (oldData) => {
    return [newItem, ...(oldData || [])]
  })
}
```

### Challenge 2: Infinite Scroll with Filters
* **Problem:** Changing filter configurations needed to explicitly reset pagination states and invalidate stale cached data chunks.
* **Solution:** Bound our `queryKey` matrices directly to serialized filter configurations so active queries automatically reset when dependencies change.

```typescript
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['movies', 'infinite', JSON.stringify(filters)],
  queryFn: ({ pageParam = 1 }) => fetchMovies(pageParam),
})
```

### Challenge 3: Type Safety Across API Boundaries
* **Problem:** Direct TMDB API raw responses needed normalized formatting and consistent static types before ingestion by upstream UI code.
* **Solution:** Created data transformers enforced by strict design contracts to validate objects at the boundary layer.

```typescript
export function transformMovieDetails(movie: MovieDetails): TransformedMovie {
  return {
    id: movie.id,
    title: movie.title,
    // ... transformed fields
  }
}
```

### Challenge 4: Trailer Modal Playback
* **Problem:** Trailers required seamless global playback within overlay modals alongside responsive key bindings (like `Escape` to close).
* **Solution:** Engineered a global Zustand state matrix coupled with lightweight React Portals (`createPortal`).

```typescript
// Zustand store
const useTrailerStore = create((set) => ({
  isOpen: false,
  videoKey: null,
  openTrailer: (videoKey, title) => set({ isOpen: true, videoKey, title }),
  closeTrailer: () => set({ isOpen: false, videoKey: null, title: '' }),
}))
```

### Challenge 5: Database Connection with Neon
* **Problem:** Ensuring highly resilient connection channels to Neon serverless infrastructure without hitting connection pool limits.
* **Solution:** Utilized Neon's pooled HTTP connection strings with structural SSL arguments enforced via Drizzle ORM.

```typescript
// drizzle.config.ts
export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Challenge 6: Mixing Server Components with Client State
* **Problem:** Integrating heavy React Server Components (RSC) with interactive, client-side global states.
* **Solution:** Adopted a hybrid composition pattern—fetching core datasets securely inside layout nodes and passing them downstream to active `'use client'` interactive blocks.

```typescript
// Server Component (page.tsx)
export default async function MoviesPage() {
  const initialData = await moviesService.getDiscover()
  return <MoviesClient initialData={initialData} />
}

// Client Component (MoviesClient.tsx)
'use client'
export function MoviesClient({ initialData }) {
  // Client-side interactivity thrives here
}
```

### Challenge 7: Image Optimization
* **Problem:** High-resolution movie posters and backdrops degraded performance matrices and visual loading metrics.
* **Solution:** Configured Next.js native `Image` blocks enriched with size layouts and lazy-loading rules.

```typescript
<Image
  src={imageUrl}
  alt={title}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
  className="object-cover"
  loading="lazy"
/>
```

---

## Performance Optimizations

| Optimization Strategy | Implementation Details |
| :--- | :--- |
| **Static Generation** | Leverages `generateStaticParams` to pre-render highly popular index items. |
| **ISR** | Employs `export const revalidate = 3600` to flush cache channels every hour. |
| **Lazy Loading** | Next.js layout engine tracking backed by `loading="lazy"` properties. |
| **Code Splitting** | Automated build splitting across router splits via framework compiler layers. |
| **Caching** | React Query caching layer tuned to `staleTime: 60000`. |
| **Parallel Fetching** | Concurrently hits API endpoints using robust `Promise.all` compositions. |
| **Debouncing** | Restricts real-time string inputs via an organic 300ms debounce buffer. |
| **Suspense** | Streams server code fragments gracefully using native `Suspense` containers. |
| **Memoization** | Isolates computational bloat via strict `useCallback` and `useMemo` closures. |
| **Bundle Analysis** | Monitored by the internal tool `@next/bundle-analyzer`. |

---


5. Open an official Pull Request mapping your fork back into the upstream `main` branch.

### Commit Message Conventions

We track history strictly via these semantic patterns:
```text
feat:     Add a brand new structural feature
fix:      Squash a software bug or visual glitch
docs:     Update internal or explicit documentation files
style:    Format or beautify structural text patterns
refactor: Restructure logical paths without breaking contracts
perf:     Introduce execution speeds or data size enhancements
test:     Inject unit files or structural validation specs
chore:    Handle background environment tasks or build scripts
```

### Core Code Standards

* ** Full TypeScript strict mode:** Strictly typed code across all interfaces.
* ** Biome Linters:** Automatic formatting and diagnostic parsing.
* ** Zero Any Types:** Utilize explicit type parameters or `unknown` fallbacks where dynamic values exist.
* ** Typed Components:** Functional components mapped strictly to proper `props` interfaces.
* ** Error Handling:** Application nodes bound safely with robust Error Boundary components.
* ** Total Accessibility:** Layout components built with rich semantic ARIA descriptors.


## API Reference

### TMDB API Services

Our core media metadata layer bridges to the following TMDB infrastructure routes:

| Service Invocation | Target API Endpoint | Operational Action Description |
| :--- | :--- | :--- |
| `moviesService.getPopular()` | `/movie/popular` | Fetches the current catalog of high-activity trending movies. |
| `moviesService.getDetails(id)` | `/movie/{id}` | Retrieves deep metadata fields for a single target movie. |
| `moviesService.getDiscover(filters)` | `/discover/movie` | Performs multi-variable querying against movie specifications. |
| `tvService.getPopular()` | `/tv/popular` | Fetches high-activity trending television listings. |
| `tvService.getDetails(id)` | `/tv/{id}` | Retrieves deep metadata fields for a single target TV show. |
| `personService.getPopular()` | `/person/popular` | Aggregates listing indices for highly popular public actors/creatives. |
| `personService.getDetails(id)` | `/person/{id}` | Retrieves profile paths and associated filmographies for a creative. |
| `searchService.searchMulti(query)` | `/search/multi` | Dispatches structural queries crossing movies, TV, and personnel. |
| `trendingService.getTrending()` | `/trending/all/week` | Tracks rolling weekly popularity trends across all media types. |

### Internal App API Routes

Our local database sync operations are driven by Next.js edge-ready route patterns:

| Local Route Endpoint Path | HTTP Method | Data Mutation operational Description |
| :--- | :--- | :--- |
| `/api/watchlist` | `GET` | Pulls the full list of media items saved by the authenticated user. |
| `/api/watchlist` | `POST` | Safely updates the schema by saving a new tracking row item block. |
| `/api/watchlist` | `DELETE` | Invalidates and purges a selected listing from the user's registry. |

---

## Troubleshooting

### Common Application Issues

| Symptom | Probable Cause & Resolution Strategy |
| :--- | :--- |
| **Build system failures** | Validate your engine compatibility runtime environment (`node -v` requires `v20+`). |
| **API call communication breaks** | Double-check parsing rules and key values mapped inside `.env.local`. |
| **Database handshakes drop** | Inspect `DATABASE_URL` routing strings and append `?sslmode=require`. |
| **Images and backdrops missing** | Verify the domain base URL configuration matches `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL`. |
| **Authentication routing loop** | Map path redirects (`/sign-in`, `/sign-up`) directly in your Clerk Dashboard panel. |
| **Watchlist UI modifications stall** | Investigate database read/write locks, schema syncs, or user authentication state. |
| **Infinite pagination scrolling hangs** | Match backend response structures directly with expected structural parameters. |

### Useful Debugging Utilities

Run these operational tasks directly inside your local environment shell block:

```bash
# Spin up local dev systems enriched with detailed diagnostic event streaming logs
DEBUG=* npm run dev

# Inspect currently parsed process context variables safely
node -e "console.log(process.env)"

# Perform schema verification check runs across Drizzle models
npx drizzle-kit check

# Tail real-time telemetry metrics streaming straight from your Vercel host instances
vercel logs
```

---

## License

This software codebase project architecture is officially licensed under the terms of the **MIT License**. Check out the repository `LICENSE` file template variables for total structural terms and disclosure permissions details.

---

## Acknowledgments

* **[TMDB API](https://themoviedb.org)** for delivering the vast, high-quality open television and cinema metadata ecosystem that powers this app.
* **[shadcn/ui](https://shadcn.com)** for providing an beautifully crafted, accessible atomic design system configuration framework layer.
* **[Clerk Authentication](https://clerk.com)** for bringing secure, cloud-ready identity management paradigms to life inside minutes.
* **[Neon Core](https://neon.tech)** for building incredibly efficient, scalable serverless PostgreSQL computing primitives.
* **[Vercel Platform](https://vercel.com)** for supplying world-class edge compute, routing, and lightning-fast web infrastructure engines.
* **The Global Open Source Engineering Community** for continuously contributing the high-quality foundational utilities that make modern software architecture possible.
