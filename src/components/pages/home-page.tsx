/**
 * HomePage Component
 * Combines all home page sections: Hero, People, Movies, and TV Shows
 */

import { cn } from '@/lib/utils';
import type { HomePageData } from '@/app/page';
import { GenreSection } from '../shared/genre-section';
import { PeopleCarousel } from '../person/people-carousel-wrapper';
import { HeroCarousel } from '../shared/hero-carousel';

export interface HomePageProps {
  data: HomePageData;
  className?: string;
}

export function HomePage({ data, className }: HomePageProps) {
  const {
    hero,
    people,
    movieGenreSections,
    tvGenreSections,
    metadata,
  } = data;

  const hasHero = hero?.items?.length > 0;
  const hasPeople = people?.items?.length > 0;
  const hasMovieSections = movieGenreSections?.some(
    (section) => section?.movies?.length > 0
  );
  const hasTVSections = tvGenreSections?.some(
    (section) => section?.shows?.length > 0
  );

  if (!hasHero && !hasPeople && !hasMovieSections && !hasTVSections) {
    return (
      <div
        className={cn(
          'flex items-center justify-center min-h-[60vh]',
          className
        )}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            No Content Available
          </h2>
          <p className="text-gray-400">
            Unable to load content. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className={cn('min-h-screen', className)}>
      {/* Hero */}
      {hasHero && (
        <section className="relative">
          <HeroCarousel
            items={hero.items}
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </section>
      )}

      {/* Trending People */}
      {hasPeople && (
        <section className="mx-auto px-4 mt-8">
          <PeopleCarousel
            items={people.items}
            title="Trending People"
            subtitle="Popular actors and creators this week"
            variant="default"
          />
        </section>
      )}

      {/* MOVIES SECTION */}
      {hasMovieSections && (
        <section className="mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-4xl font-light font-poppins tracking-wider mb-2 capitalize ml-4">
            Movies
          </h2>
          <p className="text-md text-gray-400 mb-4 font-light font-poppins tracking-wider capitalize ml-4">
            Explore movies by genre
          </p>

          {movieGenreSections.map((section) => (
            <GenreSection
              key={`movie-${section.genreId}`}
              genreId={section.genreId}
              genreName={section.genreName}
              mediaType="movie"
              items={section.movies || []}
            />
          ))}
        </section>
      )}

      {/* TV SHOWS SECTION */}
      {hasTVSections && (
        <section className="mx-auto px-4 mt-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-light font-poppins tracking-wider mb-2 capitalize ml-4">
            TV Shows
          </h2>
          <p className="text-md text-gray-400 mb-4 font-light font-poppins tracking-wider capitalize ml-4">
            Explore TV shows by genre
          </p>
          {tvGenreSections.map((section) => (
            <GenreSection
              key={`tv-${section.genreId}`}
              genreId={section.genreId}
              genreName={section.genreName}
              mediaType="tv"
              items={section.shows || []}
            />
          ))}
        </section>
      )}

      {/* Debug Footer (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-4 text-xs text-gray-600 border-t border-gray-800 mt-8">
          <div className="flex flex-wrap gap-4">
            <span>Hero: {hero?.items?.length || 0}</span>
            <span>People: {people?.items?.length || 0}</span>
            <span>
              Movies:{' '}
              {movieGenreSections?.reduce(
                (acc, s) => acc + (s.movies?.length || 0),
                0
              ) || 0}
            </span>
            <span>
              TV:{' '}
              {tvGenreSections?.reduce(
                (acc, s) => acc + (s.shows?.length || 0),
                0
              ) || 0}
            </span>
            <span>Total: {metadata?.totalItems || 0}</span>
            <span className="text-gray-700">
              Loaded:{' '}
              {Object.values(metadata?.sectionsLoaded || {}).filter(Boolean)
                .length}
              /6 sections
            </span>
          </div>
        </div>
      )}
    </main>
  );
}