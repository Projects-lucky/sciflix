/**
 * Person Transformers
 * 
 * Transforms raw TMDB person data into UI-friendly formats.
 * Handles person details, credits, and filmography.
 * Uses common formatting utilities for consistent output.
 */

import {
  formatDate,
  buildImageUrl,
  truncateText,
} from './common'

// Transformed Person Interface
export interface TransformedPerson {
  // Core
  id: number
  name: string
  department: string

  // Image
  profileUrl: string | null

  // Biography
  biography: string
  shortBiography: string

  // Life
  birthday: string | null
  deathday: string | null
  placeOfBirth: string | null

  // Stats
  popularity: number

  // Also known as
  alsoKnownAs: string[]

  // Links
  imdbId: string | null

  // Raw
  raw: any
}

// Transformed Credit Interface
export interface TransformedCredit {
  id: number
  title: string
  poster: string | null
  year: string
  mediaType: 'movie' | 'tv'
  character?: string
  job?: string
}

/**
 * Transforms person details for the detail page
 * 
 * @param person - Raw person details
 * @returns UI-friendly transformed person object
 */
export function transformPersonDetails(person: any): TransformedPerson {
  return {
    // Core
    id: person.id,
    name: person.name,
    department: person.known_for_department || 'Actor',

    // Image
    profileUrl: buildImageUrl(person.profile_path, 'h632'),

    // Biography
    biography: person.biography || 'No biography available.',
    shortBiography: truncateText(person.biography, 200),

    // Life
    birthday: person.birthday ? formatDate(person.birthday) : null,
    deathday: person.deathday ? formatDate(person.deathday) : null,
    placeOfBirth: person.place_of_birth || null,

    // Stats
    popularity: person.popularity,

    // Also known as
    alsoKnownAs: person.also_known_as || [],

    // Links
    imdbId: person.imdb_id || null,

    // Raw
    raw: person,
  }
}

/**
 * Transforms a single credit entry
 * 
 * @param credit - Raw credit object
 * @returns UI-friendly transformed credit
 */
export function transformCredit(credit: any): TransformedCredit {
  return {
    id: credit.id,
    title: credit.title || credit.name || 'Unknown',
    poster: buildImageUrl(credit.poster_path, 'w185'),
    year: (credit.release_date || credit.first_air_date || '').split('-')[0] || 'N/A',
    mediaType: credit.media_type || 'movie',
    character: credit.character,
    job: credit.job,
  }
}

/**
 * Transforms a filmography list
 * Sorts by year (newest first)
 * 
 * @param credits - Array of raw credit objects
 * @returns Sorted array of transformed credits
 */
export function transformFilmography(credits: any[]): TransformedCredit[] {
  return credits.map(transformCredit).sort((a, b) => {
    if (a.year === 'N/A') return 1
    if (b.year === 'N/A') return -1
    return parseInt(b.year) - parseInt(a.year)
  })
}