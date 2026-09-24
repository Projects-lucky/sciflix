/**
 * Application Configuration - Single Source of Truth
 * All configurable values centralized here
 * Update once, propagate everywhere
 */

import type { TMDBGenre } from "@/types/tmdb.types";
import dotenv from "dotenv";

// ============================================
// ENVIRONMENT VARIABLES (Runtime values)
// ============================================

const getEnv = (key: string, fallback?: string): string => {
  const value =
    typeof process !== "undefined" ? process.env[key] || fallback : fallback;

  if (!value) {
    // If it's a critical missing token during development, return a placeholder instead of crashing outright
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `Warning: Missing environment variable [${key}]. App might malfunction.`,
      );
      return `missing-${key}`;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const ENV = {
  tmdbApiKey: getEnv("TMDB_API_KEY"), // OPTIONAL: for backward compatibility
  tmdbAccessToken: getEnv("TMDB_ACCESS_TOKEN"), // NEW: Bearer token
  tmdbBaseUrl: getEnv("TMDB_API_BASE_URL", "https://api.themoviedb.org/3"),
  clerkPubKey: getEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  clerkSecretKey: getEnv("CLERK_SECRET_KEY"),
  databaseUrl: getEnv("DATABASE_URL"),
  appUrl: getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  nodeEnv: getEnv("NODE_ENV", "development"),
} as const;

// ============================================
// TMDB CONFIGURATION
// ============================================

export const TMDB_CONFIG = {
  baseUrl: ENV.tmdbBaseUrl,
  apiKey: ENV.tmdbApiKey,

  endpoints: {
    trending: "/trending/all/week",
    trendingPeople: "/trending/person/week",
    discover: "/discover/movie",
    genres: "/genre/movie/list",
    configuration: "/configuration",
    movieDetail: (id: number) => `/movie/${id}`,
    tvDetail: (id: number) => `/tv/${id}`,
    personDetail: (id: number) => `/person/${id}`,
    search: "/search/multi",
  } as const,

  image: {
    baseUrl: "https://image.tmdb.org/t/p",
    backdrop: {
      small: "w300",
      medium: "w780",
      large: "w1280",
      original: "original",
    },
    poster: {
      small: "w185",
      medium: "w342",
      large: "w500",
      original: "original",
    },
    profile: {
      small: "w45",
      medium: "w185",
      large: "h632",
      original: "original",
    },
  } as const,

  defaultLanguage: "en-US",
  defaultRegion: "US",
} as const;

// ============================================
// HOME PAGE CONFIGURATION
// ============================================

export const HOME_CONFIG = {
  hero: {
    itemCount: 10,
    adult: false,
    autoPlay: true,
    autoPlayInterval: 5000, // milliseconds
    mediaTypes: ["movie", "tv"] as const,
  },

  trendingPeople: {
    itemCount: 20,
    adult: false,
  },

  genreSections: {
    movieCount: 4, // How many movie genres to show
    tvCount: 4, // How many TV genres to show
    itemCount: 10, // Items per genre
    sortBy: "popularity.desc" as const,
    adult: false,
  },

  // Fallback data when API fails
  fallbacks: {
    hero: {
      title: "Trending Now",
      subtitle: "Discover what's popular today",
    },
    people: {
      title: "Trending People",
      subtitle: "Popular actors and creators",
    },
    genre: {
      title: "Movies by Genre",
      subtitle: "Explore your favorite genres",
    },
  },
} as const;

// ============================================
// CACHE CONFIGURATION
// ============================================

export const CACHE_CONFIG = {
  revalidation: {
    trending: 300, // 5 minutes
    people: 3600, // 1 hour
    genres: 86400, // 24 hours (genres rarely change)
    discover: 300, // 5 minutes
    details: 3600, // 1 hour
  },
  staleWhileRevalidate: true,
  tags: {
    trending: "trending",
    people: "people",
    genres: "genres",
    discover: "discover",
  },
} as const;

// ============================================
// API RETRY & BACKOFF CONFIGURATION
// ============================================

export const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  // Timeout per request
  timeout: 10000, // 10 seconds
} as const;

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export const CAROUSEL_CONFIG = {
  itemsPerView: {
    mobile: 2,
    tablet: 3,
    desktop: 5,
    wide: 6,
  },
  gap: "1rem",
  showArrows: true,
  showDots: false,
  dragFree: true,
  containScroll: "trimSnaps" as const,
} as const;

// ============================================
// VALIDATION CONFIGURATION
// ============================================

export const VALIDATION_CONFIG = {
  search: {
    minQueryLength: 2,
    maxQueryLength: 100,
  },
  watchlist: {
    maxMovies: 500,
  },
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  watchlist: "/watchlist",
  movie: (id: number) => `/movie/${id}`,
  tv: (id: number) => `/tv/${id}`,
  person: (id: number) => `/person/${id}`,
  search: "/search",
} as const;

// ============================================
// TYPE INFERENCE
// ============================================

export type AppConfig = {
  ENV: typeof ENV;
  TMDB_CONFIG: typeof TMDB_CONFIG;
  HOME_CONFIG: typeof HOME_CONFIG;
  CACHE_CONFIG: typeof CACHE_CONFIG;
  RETRY_CONFIG: typeof RETRY_CONFIG;
  BREAKPOINTS: typeof BREAKPOINTS;
  CAROUSEL_CONFIG: typeof CAROUSEL_CONFIG;
  VALIDATION_CONFIG: typeof VALIDATION_CONFIG;
  ROUTES: typeof ROUTES;
};
