/**
 * Person Carousel Component
 * 
 * Displays a horizontal carousel of cast/crew members.
 * Features smooth inertia scrolling and hover scale effects.
 * Uses shadcn/ui Carousel with drag-free scrolling.
 */

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
 CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"

// Mock data schema for cast/crew display
const TRENDING_CAST = [
  { id: 1, name: "Pedro Pascal", character: "Joel Miller", imageUrl: "/cast/pedro.jpg" },
  { id: 2, name: "Bella Ramsey", character: "Ellie", imageUrl: "/cast/bella.jpg" },
  { id: 3, name: "Gabriel Luna", character: "Tommy", imageUrl: "/cast/gabriel.jpg" },
  { id: 4, name: "Anna Torv", character: "Tess", imageUrl: "/cast/anna.jpg" },
  { id: 5, name: "Nick Offerman", character: "Bill", imageUrl: "/cast/nick.jpg" },
  { id: 6, name: "Murray Bartlett", character: "Frank", imageUrl: "/cast/murray.jpg" },
  { id: 7, name: "Nick Offerman", character: "Bill", imageUrl: "/cast/nick.jpg" },
  { id: 8, name: "Murray Bartlett", character: "Frank", imageUrl: "/cast/murray.jpg" },
  { id: 9, name: "Nick Offerman", character: "Bill", imageUrl: "/cast/nick.jpg" },
  { id: 10, name: "Murray Bartlett", character: "Frank", imageUrl: "/cast/murray.jpg" },
]

/**
 * PersonCarousel Component
 * 
 * @returns Rendered person carousel with cast members
 */
export function PersonCarousel() {
  return (
    <div className="pcrsl-wrapper-main w-full px-4 py-6">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-4 flex">
          {TRENDING_CAST.map((person) => (
            <CarouselItem 
              key={person.id} 
              className="w-52 h-80 flex shrink-0"
            >
              <div className="group flex w-full h-full cursor-grab active:cursor-grabbing p-1">
                <Card className="overflow-hidden w-full h-full p-0 border-0 bg-zinc-900 transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-0 flex flex-col">
                    {/* Portrait image container */}
                    <div className="w-full h-full relative bg-zinc-800 shrink-0">
                      {person.imageUrl ? (
                        <Image
                          src={person.imageUrl}
                          alt={person.name}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover pointer-events-none"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-500">
                          No Image
                        </div>  
                      )}
                    </div>
                    {/* Metadata */}
                    <div className="pcrsl-meta-info p-3 text-left mt-auto">
                      <h4 className="pcrsl-title font-semibold text-sm text-zinc-100 truncate group-hover:text-amber-500 transition-colors">
                        {person.name}
                      </h4>
                      <p className="pcrsl-character text-xs text-zinc-400 truncate mt-0.5">
                        {person.character}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}