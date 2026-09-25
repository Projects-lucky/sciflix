/**
 * Home Page - Server Component
 * Orchestrates data fetching from genres + discover services
 */
export const dynamic = 'force-dynamic';

import { HomePage } from '@/components/pages/home-page';
import {
  getHeroTrending,
  getTrendingPeople,
  getHomeGenres,
  getMoviesByGenre,
  discoverTV,
} from '@/lib/services/tmdb';
import type { TrendingItem } from '@/types/trending.types';
import type { TMDBGenre } from '@/types/tmdb.types';
import type { TMDBPerson } from '@/types/person.types';
import type { TMDBMovie } from '@/types/movie.types';
import type { TMDBTV } from '@/types/tv.types';


// ============================================
// TYPES
// ============================================

export interface HomePageData {
  hero: {
    items: TrendingItem[];
    success: boolean;
  };
  people: {
    items: TMDBPerson[];
    success: boolean;
  };
  movieGenres: {
    items: TMDBGenre[];
    success: boolean;
  };
  tvGenres: {
    items: TMDBGenre[];
    success: boolean;
  };
  movieGenreSections: Array<{
    genreId: number;
    genreName: string;
    movies: TMDBMovie[];
    success: boolean;
  }>;
  tvGenreSections: Array<{
    genreId: number;
    genreName: string;
    shows: TMDBTV[];
    success: boolean;
  }>;
  metadata: {
    totalItems: number;
    sectionsLoaded: {
      hero: boolean;
      people: boolean;
      movieGenres: boolean;
      tvGenres: boolean;
      movieGenreSections: boolean;
      tvGenreSections: boolean;
    };
  };
}

// ============================================
// CONFIG
// ============================================

const GENRE_COUNT = 4;
const ITEMS_PER_GENRE = 10;

// ============================================
// MAIN FETCH FUNCTION (Pure Orchestration)
// ============================================

async function getHomePageData(): Promise<HomePageData> {
  // ─────────────────────────────────────────
  // 1. Fetch hero, people, and genre lists in parallel
  // ─────────────────────────────────────────
  const [heroResult, peopleResult, movieGenresResult, tvGenresResult] =
    await Promise.allSettled([
      getHeroTrending(10),
      getTrendingPeople('day', 20),
      getHomeGenres(GENRE_COUNT, 'movie'),
      getHomeGenres(GENRE_COUNT, 'tv'),
    ]);

  const heroItems =
    heroResult.status === 'fulfilled' && heroResult.value ? heroResult.value : [];
  const heroSuccess =
    heroResult.status === 'fulfilled' && heroResult.value !== null;

  const peopleItems =
    peopleResult.status === 'fulfilled' && peopleResult.value
      ? peopleResult.value
      : [];
  const peopleSuccess =
    peopleResult.status === 'fulfilled' && peopleResult.value !== null;

  const movieGenreItems =
    movieGenresResult.status === 'fulfilled' && movieGenresResult.value
      ? movieGenresResult.value
      : [];
  const movieGenresSuccess =
    movieGenresResult.status === 'fulfilled' && movieGenresResult.value !== null;

  const tvGenreItems =
    tvGenresResult.status === 'fulfilled' && tvGenresResult.value
      ? tvGenresResult.value
      : [];
  const tvGenresSuccess =
    tvGenresResult.status === 'fulfilled' && tvGenresResult.value !== null;

  // ─────────────────────────────────────────
  // 2. Fetch movies for each movie genre
  // ─────────────────────────────────────────
  const movieGenreSections = await Promise.all(
    movieGenreItems.map(async (genre) => {
      const movies = await getMoviesByGenre(genre.id, ITEMS_PER_GENRE);
      return {
        genreId: genre.id,
        genreName: genre.name,
        movies: movies || [],
        success: movies !== null && movies.length > 0,
      };
    })
  );

  // ─────────────────────────────────────────
  // 3. Fetch TV shows for each TV genre
  // ─────────────────────────────────────────
  const tvGenreSections = await Promise.all(
    tvGenreItems.map(async (genre) => {
      const shows = await discoverTV(
        { with_genres: String(genre.id) },
        { limit: ITEMS_PER_GENRE }
      );
      return {
        genreId: genre.id,
        genreName: genre.name,
        shows: shows || [],
        success: shows !== null && shows.length > 0,
      };
    })
  );

  // ─────────────────────────────────────────
  // 4. Build metadata
  // ─────────────────────────────────────────
  const movieGenreSectionsSuccess = movieGenreSections.some((s) => s.success);
  const tvGenreSectionsSuccess = tvGenreSections.some((s) => s.success);

  const totalItems =
    heroItems.length +
    peopleItems.length +
    movieGenreSections.reduce((acc, s) => acc + s.movies.length, 0) +
    tvGenreSections.reduce((acc, s) => acc + s.shows.length, 0);

  return {
    hero: { items: heroItems, success: heroSuccess },
    people: { items: peopleItems, success: peopleSuccess },
    movieGenres: { items: movieGenreItems, success: movieGenresSuccess },
    tvGenres: { items: tvGenreItems, success: tvGenresSuccess },
    movieGenreSections,
    tvGenreSections,
    metadata: {
      totalItems,
      sectionsLoaded: {
        hero: heroSuccess,
        people: peopleSuccess,
        movieGenres: movieGenresSuccess,
        tvGenres: tvGenresSuccess,
        movieGenreSections: movieGenreSectionsSuccess,
        tvGenreSections: tvGenreSectionsSuccess,
      },
    },
  };
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function Page() {
  const data = await getHomePageData();
  return <HomePage data={data} />;
}