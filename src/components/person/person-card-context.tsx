/**
 * PersonCard Component (Compound Pattern)
 * ...existing header...
 */

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TMDB_CONFIG } from '@/lib/config/app.config';
import type { TMDBPerson } from '@/types/person.types';
import type { TrendingPerson } from '@/types/trending.types';
import React, { createContext, useContext } from 'react';

// ============================================
// TYPES
// ============================================

export type PersonCardItem = TMDBPerson | TrendingPerson;

interface PersonCardContextType {
  person: PersonCardItem;
  name: string;
  imageUrl: string | null;
  detailUrl: string;
  knownFor: string;
  knownForTitle: string;
  character?: string;       
}

const PersonCardContext = createContext<PersonCardContextType | null>(null);

// ============================================
// HELPERS
// ============================================

function getPersonName(person: PersonCardItem): string {
  return person.name || 'Unknown';
}

function getProfilePath(person: PersonCardItem): string | null {
  return person.profile_path || null;
}

function getKnownFor(person: PersonCardItem): string {
  if ('known_for_department' in person) {
    return person.known_for_department || 'Actor';
  }
  return 'Actor';
}

function getKnownForTitle(person: PersonCardItem): string {
  if (!('known_for' in person) || !person.known_for || person.known_for.length === 0) {
    return '';
  }
  const item = person.known_for[0];
  if ('title' in item) return item.title || '';
  if ('name' in item) return item.name || '';
  return '';
}

function getDetailUrl(person: PersonCardItem): string {
  return `/person/${person.id}`;
}

//  NEW — safely extract the character name if present
function getCharacter(person: PersonCardItem): string | undefined {
  if ('character' in person && typeof person.character === 'string') {
    return person.character;
  }
  return undefined;
}

// ============================================
// COMPOUND COMPONENTS
// ============================================

// 1. ROOT
export function PersonCard({
  person,
  children,
  className,
  prefetch = false,
  onClick,
  ...props
}: {
  person: PersonCardItem;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: () => void;
} & React.ComponentPropsWithoutRef<'a'>) {
  const name = getPersonName(person);
  const profilePath = getProfilePath(person);
  const knownFor = getKnownFor(person);
  const knownForTitle = getKnownForTitle(person);
  const character = getCharacter(person);   //  NEW
  const detailUrl = getDetailUrl(person);

  const imageUrl = profilePath
    ? `${TMDB_CONFIG.image.baseUrl}/w185${profilePath}`
    : null;

  const contextValue: PersonCardContextType = {
    person,
    name,
    imageUrl,
    detailUrl,
    knownFor,
    knownForTitle,
    character,   //  NEW
  };

  return (
    <PersonCardContext.Provider value={contextValue}>
      <Link
        href={detailUrl}
        prefetch={prefetch}
        className={cn('block group no-underline min-w-0', className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    </PersonCardContext.Provider>
  );
}

// 2. CONTAINER
PersonCard.Container = function PersonCardContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'group relative select-none transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// 3. IMAGE WRAPPER
PersonCard.ImageWrapper = function PersonCardImageWrapper({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative overflow-hidden bg-neutral-900', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// 4. IMAGE
type PersonCardImageProps = Omit<
  React.ComponentPropsWithoutRef<typeof Image>,
  'src' | 'alt'
>;

PersonCard.Image = function PersonCardImage({
  className,
  priority = false,
  sizes = '200px',
  ...props
}: PersonCardImageProps) {
  const ctx = useContext(PersonCardContext);
  if (!ctx) throw new Error('PersonCard.Image must be used within PersonCard');

  if (ctx.imageUrl) {
    return (
      <Image
        {...props}
        src={ctx.imageUrl}
        alt={ctx.name}
        fill
        className={cn('object-cover pointer-events-none select-none', className)}
        priority={priority}
        loading="eager"
        sizes={sizes}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-400 font-bold',
        className 
      )}
    >
      <span className="text-2xl">{ctx.name.charAt(0).toUpperCase()}</span>
    </div>
  );
};

// 5. BADGE
PersonCard.Badge = function PersonCardBadge({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(PersonCardContext);
  if (!ctx) throw new Error('PersonCard.Badge must be used within PersonCard');

  const content = children || ctx.knownFor;

  return (
    <div
      className={cn(
        'absolute z-10 rounded-md font-semibold shadow-sm backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
};

// 6. INFO
PersonCard.Info = function PersonCardInfo({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col min-w-0 flex-1', className)} {...props}>
      {children}
    </div>
  );
};

// 7. NAME
PersonCard.Name = function PersonCardName({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const ctx = useContext(PersonCardContext);
  if (!ctx) throw new Error('PersonCard.Name must be used within PersonCard');

  return (
    <h3
      className={cn('truncate line-clamp-1', className)}
      title={ctx.name}
      {...props}
    >
      {ctx.name}
    </h3>
  );
};

// 8. KNOWN FOR
PersonCard.KnownFor = function PersonCardKnownFor({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const ctx = useContext(PersonCardContext);
  if (!ctx) throw new Error('PersonCard.KnownFor must be used within PersonCard');
  if (!ctx.knownForTitle) return null;

  return (
    <span className={cn('truncate w-full text-xs', className)} {...props}>
      Known for:{' '}
      <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
        {ctx.knownForTitle}
      </span>
    </span>
  );
};

// 9. CHARACTER —  NEW
PersonCard.Character = function PersonCardCharacter({
  className,
  prefix = '',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { prefix?: string }) {
  const ctx = useContext(PersonCardContext);
  if (!ctx) throw new Error('PersonCard.Character must be used within PersonCard');
  if (!ctx.character) return null;

  return (
    <span
      className={cn('truncate w-full text-xs', className)}
      title={ctx.character}
      {...props}
    >
      {prefix}
      <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
        {ctx.character}
      </span>
    </span>
  );
};