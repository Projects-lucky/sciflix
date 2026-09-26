"use client";

import { CarouselWrapper } from "@/components/shared/carousel-wrapper";
import type { TMDBPerson } from "@/types/person.types";
import type { TrendingPerson } from "@/types/trending.types";
import { PersonMiniAvatar } from "./PersonCardPresets";

export type PeopleCarouselItem = TMDBPerson | TrendingPerson;

export interface PeopleCarouselProps {
  items: PeopleCarouselItem[];
  title?: string;
  subtitle?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function PeopleCarousel({
  items,
  title = "Trending People",
  subtitle = "Popular actors and creators this week",
  // biome-ignore lint/correctness/noUnusedFunctionParameters: initial biome migration
  variant = "default",
  className,
}: PeopleCarouselProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <CarouselWrapper
      items={items}
      // biome-ignore lint/correctness/noUnusedFunctionParameters: initial biome migration
      renderItem={(person, index) => (
        <PersonMiniAvatar key={person.id} person={person} />
      )}
      showArrows={items.length > 7}
      showDots={false}
      autoPlay={false}
      className={className}
      title={title}
      subtitle={subtitle}
      showTitleBar={true}
    />
  );
}
