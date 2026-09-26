/**
 * Person Endpoint Types
 * /person/{id}, /trending/person, /search/person
 */

import type { TMDBMovie } from "./movie.types";
import type { TMDBTV } from "./tv.types";

// ============================================
// PERSON (CORE)
// ============================================

export interface TMDBPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for: (TMDBMovie | TMDBTV)[];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string | null;
  character?: string;
}

// ============================================
// PERSON DETAIL
// ============================================

export interface TMDBPersonDetail extends TMDBPerson {
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  homepage: string | null;
  imdb_id: string;
  place_of_birth: string | null;
}
