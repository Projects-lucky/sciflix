/**
 * Generic Carousel Component
 * 
 * Reusable carousel component using shadcn/ui Carousel.
 * Renders items with custom render functions and key generation.
 * Gracefully handles empty or invalid data with fallback UI.
 */

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface GenericCarouselProps<T> {
  items: T[]
  renderKey: (item: T, index: number) => string | number
  renderItem: (item: T) => React.ReactNode
  itemClassName?: string
  titleBar?: string
}

/**
 * GenericCarousel Component
 * 
 * @param items - Array of items to render
 * @param renderKey - Function to generate unique keys for items
 * @param renderItem - Function to render each item
 * @param itemClassName - Additional CSS classes for carousel items
 * @param titleBar - Optional title to display above carousel
 * @returns Rendered carousel with items or fallback message
 */
export function GenericCarousel<T>({
  items = [],
  renderKey,
  renderItem,
  titleBar,
  itemClassName = "w-52 h-80",
}: GenericCarouselProps<T>) {
  // Fallback for empty or invalid data
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="w-full px-4 py-6 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm h-40">
        No collection data available.
      </div>
    )
  }

  return (
    <div className="gcrsl-wrapper-main w-full flex flex-col gap-y-4 px-4 py-6">
      {titleBar && <span className="text-4xl font-logo">{titleBar}</span>}
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-4 flex bg-amber-700/0 gap-x-4.5">
          {items.map((item, index) => (
            <CarouselItem 
              key={renderKey(item, index)} 
              className={`${itemClassName} flex items-center flex-row shrink-0 gap-2 p-0`}
            >
              <div className="group flex w-full h-full cursor-grab active:cursor-grabbing p-1">
                {renderItem(item)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}