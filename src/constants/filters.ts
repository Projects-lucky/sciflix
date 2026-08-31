/**
 * Filter Constants
 * 
 * Centralized configuration for all filter options used across the application.
 * Includes sort options, ratings, years, genres, languages, countries, and runtime.
 * Used by movies, TV shows, and search pages.
 */

import { FilterOption } from '@/components/filters/types'

// Sort Options - Movies
export const SORT_OPTIONS_MOVIE: FilterOption[] = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'release_date.desc', label: 'Release Date' },
  { value: 'original_title.asc', label: 'Title A-Z' },
]

// Sort Options - TV Shows
export const SORT_OPTIONS_TV: FilterOption[] = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'first_air_date.desc', label: 'First Air Date' },
  { value: 'original_name.asc', label: 'Title A-Z' },
]

// Rating Options
export const RATING_OPTIONS: FilterOption[] = [
  { value: '', label: 'Any Rating' },
  { value: '5', label: '5+' },
  { value: '6', label: '6+' },
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
  { value: '9', label: '9+' },
]

// Year Options (last 50 years)
export const YEAR_OPTIONS: FilterOption[] = Array.from({ length: 50 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return { value: String(year), label: String(year) }
})

// Genre Options - Movies
export const GENRE_OPTIONS_MOVIE: FilterOption[] = [
  { value: '28', label: 'Action' },
  { value: '12', label: 'Adventure' },
  { value: '16', label: 'Animation' },
  { value: '35', label: 'Comedy' },
  { value: '80', label: 'Crime' },
  { value: '18', label: 'Drama' },
  { value: '10751', label: 'Family' },
  { value: '14', label: 'Fantasy' },
  { value: '36', label: 'History' },
  { value: '27', label: 'Horror' },
  { value: '10402', label: 'Music' },
  { value: '9648', label: 'Mystery' },
  { value: '10749', label: 'Romance' },
  { value: '878', label: 'Science Fiction' },
  { value: '10770', label: 'TV Movie' },
  { value: '53', label: 'Thriller' },
  { value: '10752', label: 'War' },
  { value: '37', label: 'Western' },
]

// Genre Options - TV Shows
export const GENRE_OPTIONS_TV: FilterOption[] = [
  { value: '10759', label: 'Action & Adventure' },
  { value: '16', label: 'Animation' },
  { value: '35', label: 'Comedy' },
  { value: '80', label: 'Crime' },
  { value: '99', label: 'Documentary' },
  { value: '18', label: 'Drama' },
  { value: '10751', label: 'Family' },
  { value: '10762', label: 'Kids' },
  { value: '9648', label: 'Mystery' },
  { value: '10763', label: 'News' },
  { value: '10764', label: 'Reality' },
  { value: '10765', label: 'Sci-Fi & Fantasy' },
  { value: '10766', label: 'Soap' },
  { value: '10767', label: 'Talk' },
  { value: '10768', label: 'War & Politics' },
  { value: '37', label: 'Western' },
]

// Adult Content Options
export const INCLUDE_ADULT_OPTIONS: FilterOption[] = [
  { value: 'false', label: 'Exclude Adult' },
  { value: 'true', label: 'Include Adult' },
]

// Language Options (ISO 639-1)
export const LANGUAGE_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'sv', label: 'Swedish' },
  { value: 'da', label: 'Danish' },
  { value: 'no', label: 'Norwegian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'tr', label: 'Turkish' },
]

// Country Options (ISO 3166-1)
export const COUNTRY_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Regions' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'RU', label: 'Russia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'EG', label: 'Egypt' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
]

// Runtime Options (in minutes)
export const RUNTIME_OPTIONS: FilterOption[] = [
  { value: '', label: 'Any Runtime' },
  { value: '30', label: '30+' },
  { value: '60', label: '60+' },
  { value: '90', label: '90+' },
  { value: '120', label: '120+' },
  { value: '150', label: '150+' },
  { value: '180', label: '180+' },
]

// Default Filter Values
export const DEFAULT_FILTERS = {
  MOVIE: {
    sort: 'popularity.desc',
    page: 1,
    includeAdult: false,
  },
  TV: {
    sort: 'popularity.desc',
    page: 1,
    includeAdult: false,
  },
}