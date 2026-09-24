/**
 * People Endpoint Service
 * /person/popular, /person/{id}
 *
 * Docs: https://developers.themoviedb.org/3/people
 */

import { tmdbClient } from '../client';
import { CACHE_CONFIG } from '@/lib/config/app.config';
import type { TMDBPerson, TMDBPersonDetail } from '@/types/person.types';
import type { TMDBApiResponse } from '@/types/tmdb.types';

// ============================================
// POPULAR PEOPLE
// ============================================

/**
 * Fetch a paginated list of popular people.
 *
 * @param page     - Page number (default: 1)
 * @param language - UI language (default: 'en-US')
 * @returns TMDB paginated response OR null on failure
 */
export async function getPopularPeople(
  page: number = 1,
  language: string = 'en-US'
): Promise<TMDBApiResponse<TMDBPerson> | null> {
  try {
    const response = await tmdbClient.fetch<TMDBApiResponse<TMDBPerson>>(
      '/person/popular',
      { page, language },
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.trending,
          tags: ['people-popular'],
        },
      }
    );

    return response;
  } catch (error) {
    console.error('[TMDB] Failed to fetch popular people:', error);
    return null;
  }
}

// ============================================
// PERSON DETAILS (with credits)
// ============================================

/**
 * Fetch person details with credits + external ids.
 */
export async function getPersonWithCredits(
  id: number,
  language: string = 'en-US'
): Promise<TMDBPersonDetail | null> {
  try {
    const response = await tmdbClient.fetch<TMDBPersonDetail>(
      `/person/${id}`,
      {
        language,
        append_to_response: 'movie_credits,tv_credits,external_ids',
      },
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_CONFIG.revalidation.details,
          tags: [`person-${id}`],
        },
      }
    );

    return response;
  } catch (error) {
    console.error(`[TMDB] Failed to fetch person ${id}:`, error);
    return null;
  }
}