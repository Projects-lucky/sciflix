/**
 * Person Service
 * 
 * Service for fetching person and celebrity data from TMDB API.
 * Provides methods for person details, popular people, and credits.
 * Includes helper methods for profile URLs and department labels.
 */

import { apiClient } from '../api/client'
import { TMDB_ENDPOINTS } from '@/constants'
import type {
  Person,
  PersonDetails,
  PersonMovieCredits,
  PersonTVCredits,
  PersonCombinedCredits,
} from '@/types/person'

export class PersonService {
  private readonly basePath = TMDB_ENDPOINTS.PERSON

  /**
   * Fetches detailed person information
   * 
   * @param id - Person ID
   * @returns Person details
   */
  async getDetails(id: string | number): Promise<PersonDetails> {
    return apiClient.get<PersonDetails>(`${this.basePath}/${id}`)
  }

  /**
   * Fetches popular people
   * 
   * @param page - Page number for pagination
   * @returns Popular people response with results
   */
  async getPopular(page: number = 1): Promise<{ results: Person[]; total_pages: number; total_results: number }> {
    return apiClient.get<{ results: Person[]; total_pages: number; total_results: number }>(
      `${this.basePath}/popular`,
      { page }
    )
  }

  /**
   * Fetches person's movie credits
   * 
   * @param id - Person ID
   * @returns Person movie credits
   */
  async getMovieCredits(id: string | number): Promise<PersonMovieCredits> {
    return apiClient.get<PersonMovieCredits>(`${this.basePath}/${id}/movie_credits`)
  }

  /**
   * Fetches person's TV credits
   * 
   * @param id - Person ID
   * @returns Person TV credits
   */
  async getTVCredits(id: string | number): Promise<PersonTVCredits> {
    return apiClient.get<PersonTVCredits>(`${this.basePath}/${id}/tv_credits`)
  }

  /**
   * Fetches person's combined movie and TV credits
   * 
   * @param id - Person ID
   * @returns Combined credits
   */
  async getCombinedCredits(id: string | number): Promise<PersonCombinedCredits> {
    return apiClient.get<PersonCombinedCredits>(`${this.basePath}/${id}/combined_credits`)
  }

  /**
   * Builds a profile URL from the path
   * 
   * @param path - Profile image path
   * @param size - Image size (small, medium, large)
   * @returns Full profile URL or null
   */
  getProfileUrl(path: string | null, size: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (!path) return null
    const sizes = {
      small: 'w45',
      medium: 'w185',
      large: 'h632',
    }
    return `https://image.tmdb.org/t/p/${sizes[size]}${path}`
  }

  /**
   * Gets a human-readable department label
   * 
   * @param department - Department string
   * @returns Formatted department label
   */
  getDepartmentLabel(department: string): string {
    const labels: Record<string, string> = {
      Acting: 'Actor',
      Directing: 'Director',
      Production: 'Producer',
      Writing: 'Writer',
      Camera: 'Cinematographer',
      Editing: 'Editor',
      Sound: 'Sound Designer',
      Art: 'Art Director',
      Costume: 'Costume Designer',
      'Visual Effects': 'VFX Artist',
    }
    return labels[department] || department
  }
}

export const personService = new PersonService()