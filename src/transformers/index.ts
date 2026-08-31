// Common
export {
  formatDate,
  extractYear,
  formatRuntime,
  formatCurrency,
  buildImageUrl,
  getYearFromDate,
  truncateText,
  getRatingColor
} from './common'

// Movie
export {
  transformMovieListItem,
  transformMovieDetails,
  transformSimilarMovie,
} from './movie.transformer'
export type { TransformedMovie } from './movie.transformer'

// TV
export {
  transformTVListItem,
  transformTVDetails,
  transformSimilarTV,
} from './tv.transformer'
export type { TransformedTVShow } from './tv.transformer'

// Person
export {
  transformPersonDetails,
  transformCredit,
  transformFilmography,
} from './person.transformer'
export type { TransformedPerson, TransformedCredit } from './person.transformer'

// Search
export {
  transformSearchResults,
  groupSearchResults,
} from './search.transformer'
export type { TransformedSearchResult } from './search.transformer'

export {
   transformTrendingMovie,
   transformTrendingTV,
   transformTrendingPerson,
   transformTrendingItem,
   transformTrendingList,
   groupTrendingItems,
   transformTrendingResponse,
 } from './trending.transformer'
 export type { TransformedTrendingItem, TrendingResponse } from './trending.transformer'