/**
 * SearchResults Component
 * Renders search results grouped by section
 * - Movies + TV → MovieCard grid
 * - People → PersonCard grid
 * Works with /search/multi union type OR typed results
 */

'use client';

import { MovieCard } from '../movie/movie-card';
import { PersonCard } from '../person/person-card-context';
import { SearchEmpty } from './search-empty';
import type { TMDBMovie } from '@/types/movie.types';
import type { TMDBTV } from '@/types/tv.types';
import type { TMDBPerson } from '@/types/person.types';
import type { SearchType } from '@/lib/config/filters.config';
import { PersonGridCard } from '../person/PersonCardPresets';

// ============================================
// TYPES
// ============================================

type SearchResultItem = (TMDBMovie | TMDBTV | TMDBPerson) & {
  media_type?: 'movie' | 'tv' | 'person';
};

interface SearchResultsProps {
  results: SearchResultItem[];
  type: SearchType;
  query: string;
  success: boolean;
}

// ============================================
// HELPERS
// ============================================

function isMovie(item: SearchResultItem): item is TMDBMovie & { media_type: 'movie' } {
  return 'title' in item && 'release_date' in item;
}

function isTV(item: SearchResultItem): item is TMDBTV & { media_type: 'tv' } {
  return 'name' in item && 'first_air_date' in item;
}

function isPerson(item: SearchResultItem): item is TMDBPerson & { media_type: 'person' } {
  return 'known_for' in item;
}

// ============================================
// COMPONENT
// ============================================

export function SearchResults({
  results,
  type,
  query,
  success,
}: SearchResultsProps) {
  // No results or fetch failed
  if (!success || !results || results.length === 0) {
    return <SearchEmpty variant="no-results" query={query} />;
  }

  // Person-only search
  if (type === 'person') {
    const people = results.filter(isPerson);
    if (people.length === 0) {
      return <SearchEmpty variant="no-results" query={query} />;
    }
    return (
      <div className="mt-6">
        <ResultsHeader count={people.length} query={query} label="People" />
        <PeopleGrid people={people} />
      </div>
    );
  }

  // Movie-only search
  if (type === 'movie') {
    const movies = results.filter(isMovie);
    if (movies.length === 0) {
      return <SearchEmpty variant="no-results" query={query} />;
    }
    return (
      <div className="mt-6">
        <ResultsHeader count={movies.length} query={query} label="Movies" />
        <MediaGrid items={movies} />
      </div>
    );
  }

  // TV-only search
  if (type === 'tv') {
    const shows = results.filter(isTV);
    if (shows.length === 0) {
      return <SearchEmpty variant="no-results" query={query} />;
    }
    return (
      <div className="mt-6">
        <ResultsHeader count={shows.length} query={query} label="TV Shows" />
        <MediaGrid items={shows} />
      </div>
    );
  }

  // Multi search — split into sections
  const movies = results.filter(isMovie);
  const shows = results.filter(isTV);
  const people = results.filter(isPerson);
  const media = [...movies, ...shows];

  return (
    <div className="mt-6 space-y-12">
      {/* Movies & TV */}
      {media.length > 0 && (
        <section>
          <ResultsHeader
            count={media.length}
            query={query}
            label="Movies & TV"
          />
          <MediaGrid items={media} />
        </section>
      )}

      {/* People */}
      {people.length > 0 && (
        <section>
          <ResultsHeader count={people.length} query={query} label="People" />
          <PeopleGrid people={people} />
        </section>
      )}

      {/* Nothing matched */}
      {media.length === 0 && people.length === 0 && (
        <SearchEmpty variant="no-results" query={query} />
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ResultsHeader({
  count,
  query,
  label,
}: {
  count: number;
  query: string;
  label: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white">
        {label}
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        {count} {count === 1 ? 'result' : 'results'} for "{query}"
      </p>
    </div>
  );
}

function MediaGrid({
  items,
}: {
  items: (TMDBMovie | TMDBTV)[];
}) {
  return (
    <div className="m-grid  bg-amber-300">
      {items.map((item) => (
        <MovieCard
          key={`media-${item.id}`}
          item={item}
          className='w-56 h-92'
        />
      ))}
    </div>
  );
}

function PeopleGrid({ people }: { people: TMDBPerson[] }) {
  return (
    <div className="p-grid gap-4">
      {people.map((person) => (
        <PersonGridCard className="w-58 h-99 border-none" key={`person-${person.id}`} person={person} />
      ))}
    </div>
  );
}
