"use client";

import { cn } from "@/lib/utils";
import { CarouselWrapper } from "@/components/shared/carousel-wrapper";
import { HeroCard } from "./hero-card";
import type { TrendingItem } from "@/types/trending.types";

export interface HeroCarouselProps {
  items: TrendingItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function HeroCarousel({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: HeroCarouselProps) {
  if (!items || items.length === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">No trending content available</p>
      </div>
    );
  }

  return (
    <CarouselWrapper
      items={items}
      renderItem={(item) => <HeroCard item={item} />}
      renderKey={(item) => item.id}
      showArrows={false}
      showDots={false}
      autoPlay={true}
      autoPlayInterval={5000}
      contentClassName="flex"
      itemClassName="basis-full min-w-full shrink-0"
      className="p-0 gap-y-0"
    />
  );
}
