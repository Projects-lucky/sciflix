/**
 * Generic Carousel Wrapper
 * Single reusable wrapper for all carousels
 * Uses shadcn Carousel internally
 */

"use client";

import Autoplay from "embla-carousel-autoplay";
import type { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface CarouselWrapperProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderKey?: (item: T, index: number) => string | number;

  /** Basis class for each item - controls items per view */

  /** Extra className for individual items */
  itemClassName?: string;

  /** Extra className for the content row */
  contentClassName?: string;

  /** Extra className for outer wrapper */
  className?: string;

  /** Show arrows */
  showArrows?: boolean;

  /** Show dots */
  showDots?: boolean;

  /** Auto-play */
  autoPlay?: boolean;
  autoPlayInterval?: number;

  /** Loop slides */
  loop?: boolean;

  /** Drag free mode */
  dragFree?: boolean;

  /** Title bar */
  title?: string;
  subtitle?: string;
  showTitleBar?: boolean;

  /** Empty message */
  emptyMessage?: string;
}

// ============================================
// COMPONENT
// ============================================

export function CarouselWrapper<T>({
  items,
  renderItem,
  renderKey = (_, i) => i,
  itemClassName,
  contentClassName,
  className,
  showArrows = true,
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  dragFree = true,
  title,
  subtitle,
  showTitleBar = false,
  emptyMessage = "No items available.",
}: CarouselWrapperProps<T>) {
  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="w-full px-4 py-6 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm h-40">
        {emptyMessage}
      </div>
    );
  }

  const plugins = autoPlay
    ? [
        Autoplay({
          delay: autoPlayInterval,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]
    : [];

  return (
    <div className={cn("w-auto flex flex-col gap-y-4 px-4 py-6", className)}>
      {/* Title */}
      {showTitleBar && (title || subtitle) && (
        <span className="flex flex-col gap-y-1 w-auto">
          {title && (
            <h2 className="text-xl md:text-2xl font-light font-poppins capitalize">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </span>
      )}

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop,
          dragFree,
          containScroll: "trimSnaps",
        }}
        plugins={plugins}
        className="w-full relative"
      >
        <CarouselContent className={cn("-ml-4", contentClassName)}>
          {items.map((item, index) => (
            <CarouselItem
              key={renderKey(item, index)}
              className={cn("pl-4", itemClassName)}
            >
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {showArrows && items.length > 3 && (
          <>
            <CarouselPrevious className="hidden md:flex -left-4 bg-black/60 hover:bg-black/80 border-0 text-white" />
            <CarouselNext className="hidden md:flex -right-4 bg-black/60 hover:bg-black/80 border-0 text-white" />
          </>
        )}
      </Carousel>

      {/* Dots - placeholder for now */}
      {showDots && items.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === 0 ? "w-6 bg-white" : "bg-white/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
