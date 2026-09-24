/**
 * PersonCardPresets
 * Pre-composed, ready-to-use PersonCard layouts built from the compound components.
 * Use these for common patterns, or use the base <PersonCard> directly for custom layouts.
 */

import { PersonCard } from './person-card-context'; // Adjust path to your base PersonCard file
import type { PersonCardItem } from './person-card-context';
import React from 'react';

// Helper type: Accepts all PersonCard props EXCEPT 'children',
// because these presets define their own internal children.
type PresetProps = Omit<React.ComponentPropsWithoutRef<typeof PersonCard>, 'children'>;

// ============================================
// 1. GRID CARD (Standard Vertical Poster)
// Best for: Trending people carousels, grid layouts
// ============================================
export function PersonGridCard({
  person,
  className,
  ...props
}: { person: PersonCardItem } & PresetProps) {
  return (
    <PersonCard person={person} className={className} {...props}>
      <PersonCard.Container className="flex flex-col gap-y-1.5 w-full h-full p-2 group-hover:scale-102 border-none outline-0">
        <PersonCard.ImageWrapper className="w-full h-full rounded-lg bg-neutral-900 group-hover:border-blue-500/50 transition-colors">
          <PersonCard.Image />
          <PersonCard.Badge className="bottom-1.5 left-1.5 px-1.5 py-0.5 bg-orange-700  text-gray-100 text-xs font-poppins tracking-wider font-light backdrop-blur-md" />
        </PersonCard.ImageWrapper>
        <PersonCard.Info className="mt-0.5 px-1">
          <PersonCard.Name className="text-lg tracking-wide font-semibold font-poppins transition-colors" />
          <PersonCard.KnownFor className="text-neutral-500 font-medium font-poppins mt-0.5" />
        </PersonCard.Info>
      </PersonCard.Container>
    </PersonCard>
  );
}

// ============================================
// 2. LIST ROW (Horizontal Layout)
// Best for: Search results, "Full Cast" lists, horizontal scrolling
// ============================================
export function PersonListRow({
  person,
  className,
  ...props
}: { person: PersonCardItem } & PresetProps) {
  return (
    <PersonCard person={person} className={className} {...props}>
      <PersonCard.Container className="flex flex-row items-center gap-4 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors w-full">
        <PersonCard.ImageWrapper className="w-16 h-16 shrink-0 rounded-full ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
          <PersonCard.Image sizes="64px" className="rounded-full" />
        </PersonCard.ImageWrapper>
        <PersonCard.Info className="flex-1 min-w-0">
          <PersonCard.Name className="text-base font-bold text-white" />
          <PersonCard.KnownFor className="text-sm text-neutral-400 mt-0.5" />
        </PersonCard.Info>
        {/* Optional: Add a chevron icon here if desired */}
        <svg className="w-5 h-5 text-neutral-600 shrink-0 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </PersonCard.Container>
    </PersonCard>
  );
}

// ============================================
// 3. MINI AVATAR (Compact Circle)
// Best for: Director bylines, "Created by" sections, tight spaces
// ============================================
export function PersonMiniAvatar({
  person,
  className,
  ...props
}: { person: PersonCardItem } & PresetProps) {
  return (
    <PersonCard person={person} className={className} {...props}>
      <PersonCard.Container className="flex flex-col items-center w-auto group">
        <PersonCard.ImageWrapper className="w-62 h-98 rounded-lg transition-all">
          <PersonCard.Image className="rounded-lg mask-b-from-5% mask-b-to-98%" />
        </PersonCard.ImageWrapper>
        <PersonCard.Info className="items-center mt-1.5">
          <PersonCard.Name className="text-xl md:text-2xl font-poppins text-center transition-colors line-clamp-2" />
        </PersonCard.Info>
      </PersonCard.Container>
    </PersonCard>
  );
}

// ============================================
// 4. DETAILED CARD (With Custom Badge)
// Best for: "Similar People" sidebars, featured profiles
// ============================================
export function PersonDetailedCard({
  person,
  className,
  ...props
}: { person: PersonCardItem } & PresetProps) {
  // Safely access popularity if it exists on the person object
  const popularity = 'popularity' in person ? (person.popularity as number)?.toFixed(1) : null;

  return (
    <PersonCard person={person} className={className} {...props}>
      <PersonCard.Container className="flex flex-col w-44 sm:w-48">
        <PersonCard.ImageWrapper className="aspect-3/4 rounded-lg overflow-hidden relative border border-neutral-800 group-hover:border-neutral-600 transition-colors">
          <PersonCard.Image sizes="192px" />

          {/* Custom Badge: Shows Popularity Score instead of Department */}
          {popularity && (
            <PersonCard.Badge className="top-2 right-2 bg-blue-600/90 text-white flex items-center gap-1 backdrop-blur-md shadow-lg">
              <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">{popularity}</span>
            </PersonCard.Badge>
          )}
        </PersonCard.ImageWrapper>

        <PersonCard.Info className="mt-3 px-1">
          <PersonCard.Name className="text-base font-bold text-white" />
          <p className="text-xs text-blue-400 font-medium mt-0.5 uppercase tracking-wide">
            {('known_for_department' in person ? person.known_for_department : 'Actor') || 'Actor'}
          </p>
          <PersonCard.KnownFor className="text-neutral-500 mt-1.5" />
        </PersonCard.Info>
      </PersonCard.Container>
    </PersonCard>
  );
}


export function CastCard({
  person,
  className,
  ...props
}: { person: PersonCardItem } & PresetProps) {
  return (
    <PersonCard person={person} className={className} {...props}>
      <PersonCard.Container className="flex flex-col gap-y-1.5 w-full h-full p-2 group-hover:scale-102 border-none outline-0">
        <PersonCard.ImageWrapper className="w-full h-full rounded-lg bg-neutral-900 group-hover:border-blue-500/50 transition-colors">
          <PersonCard.Image />
          <PersonCard.Badge className="bottom-1.5 left-1.5 px-1.5 py-0.5 bg-orange-700  text-gray-100 text-xs font-light font-poppins backdrop-blur-md" />
        </PersonCard.ImageWrapper>
        <PersonCard.Info className="mt-0.5 px-1">
          <PersonCard.Name className="text-lg tracking-wide font-semibold font-poppins transition-colors" />
          <PersonCard.Character className="font-medium font-poppins mt-0.5"/>
        </PersonCard.Info>
      </PersonCard.Container>
    </PersonCard>
  );
}
