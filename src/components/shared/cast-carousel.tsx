/**
 * CastCarousel Component
 * Displays cast members in a horizontal carousel
 * Reuses CarouselWrapper + PersonCard
 */

'use client';

import { CarouselWrapper } from './carousel-wrapper';
import { PersonCard } from '../person/person-card-context';
import type { TMDBCastMember } from '@/types/tmdb.types';
import { CastCard, PersonGridCard } from '../person/PersonCardPresets';

// ============================================
// TYPES
// ============================================

export interface CastCarouselProps {
  cast: TMDBCastMember[];
  title?: string;
  limit?: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function CastCarousel({
  cast,
  title = 'Cast',
  limit = 20,
  className,
}: CastCarouselProps) {
  if (!cast || cast.length === 0) return null;

  // Sort by order (billing position) and limit
  const sortedCast = [...cast]
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);

  return (
    <CarouselWrapper
      items={sortedCast}
      renderItem={(member) => (
        <CastCard
          person={{
            id: member.id,
            name: member.name,
            adult: member.adult,
            gender: member.gender ?? 0,
            popularity: member.popularity,
            profile_path: member.profile_path,
            known_for_department: member.known_for_department,
            character: member.character,
            known_for: [],
          }}
          className='w-48 h-78'
        />
      )}
      renderKey={(member) => member.id}
      title={title}
      showArrows={true}
      showDots={false}
      className={className}
    />
  );
}