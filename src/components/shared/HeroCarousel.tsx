/**
 * Hero Carousel Component
 * 
 * Full-width autoplay carousel showcasing trending movies and TV shows.
 * Features slide counter, autoplay with pause on hover, and interactive controls.
 * Uses embla-carousel-autoplay for smooth transitions.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Star, Clock, Calendar, Play, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { TransformedTrendingItem } from "@/transformers/trending.transformer";
import { WatchlistButton } from "@/components/shared/WatchlistButton";
import { useTrailer } from '@/hooks/useTrailer'
import { getDurationFormat } from "@/transformers/common";

interface HeroCarouselProps {
  items: TransformedTrendingItem[];
}

/**
 * HeroCarousel Component
 * 
 * @param items - Array of trending items to display
 * @returns Rendered hero carousel
 */
export function HeroCarousel({ items }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<any>(null);

  // Filter out person types (carousel only for movies and TV)
  const heroItems = items.filter(
    (item) => item.mediaType === "movie" || item.mediaType === "tv"
  );
  const totalSlides = heroItems.length;

  // Initialize autoplay plugin
  useEffect(() => {
    if (!api) return;
    autoplayRef.current = api.plugins()?.autoplay;
  }, [api]);

  // Track current slide index
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const pauseAutoplay = () => autoplayRef.current?.stop();
  const resumeAutoplay = () => setTimeout(() => autoplayRef.current?.play(), 2000);

  const handleInteraction = (index?: number) => {
    pauseAutoplay();
    if (index !== undefined) api?.scrollTo(index);
    resumeAutoplay();
  };

  // Empty state
  if (totalSlides === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-white/50 bg-black/20 rounded-xl">
        No trending items available
      </div>
    );
  }

  return (
    <div
      className="hcrsl-wrapper-main-cnt w-full h-125 md:h-150 relative rounded-xl overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {heroItems.map((item, index) => (
            <CarouselItem key={item.id} className="h-full w-full basis-full">
              <CarouselMovieCard
                item={item}
                isActive={index === currentIndex}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide Counter */}
      <div className="hcrsl-slide-counter absolute bottom-6 right-8 z-20 text-white/60 text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
        {currentIndex + 1} / {totalSlides}
      </div>
    </div>
  );
}

/**
 * Carousel Movie Card Component
 * 
 * Individual slide card with backdrop image, metadata, and action buttons.
 * 
 * @param item - Trending item data
 * @param isActive - Whether slide is currently visible
 */
function CarouselMovieCard({
  item,
  isActive,
}: {
  item: TransformedTrendingItem;
  isActive: boolean;
}) {
  const {
    handlePlayTrailer,
    isLoading,
    error,
    isAvailable
  } = useTrailer({
    mediaId: item.id,
    mediaType: item.mediaType,
    title: item.title,
  })

  // Destructure item properties
  const mediaType = item.mediaType;
  const title = item.title;
  const overview = item.overview;
  const rating = item.rating;
  const year = item.year;
  const poster = item.poster;
  const backdrop = item.backdrop;

  // Extract additional details from raw data
  const director = item.raw?.credits?.crew?.find(
    (c: any) => c.job === "Director"
  )?.name || "Unknown Director";

  const cast = item.raw?.credits?.cast?.slice(0, 3).map((c: any) => c.name).join(", ") || "Unknown Cast";

  const duration = getDurationFormat(item.raw?.runtime || 0, mediaType);

  // Build image URL (backdrop preferred, fallback to poster)
  const imageUrl = backdrop || poster || "/placeholder-backdrop.jpg";

  // Determine link href
  const href =
    mediaType === "movie"
      ? `/movies/${item.id}`
      : mediaType === "tv"
      ? `/tv/${item.id}`
      : "#";

  return (
    <Link href={href} className="hc-link-wrapper block h-full w-full">
      <Card
        className={`hcrsl-card-wrapper h-full w-full rounded-2xl p-0 border-0 transition-all duration-500 overflow-hidden relative ${
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-20"
        }`}
      >
        {/* Background Image */}
        <div className="hcrsl-bg-img relative h-full w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover z-0"
            priority={isActive}
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className="hcrsl-gradient-overlay absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent z-10" />
        </div>

        {/* Content Overlay */}
        <div className="hcrsl-content-overlay absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
          {/* Badge */}
          <div className="hcrsl-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full w-fit mb-4 border border-white/10">
            <span className="text-xs font-medium flex flex-row items-center gap-1.5 uppercase tracking-wider">
              {mediaType} <TrendingUp className="w-5 h-5 text-red-primary" />
            </span>
          </div>

          {/* Title */}
          <h2 className="hcrsl-title text-4xl md:text-6xl font-bold mb-3 tracking-tight line-clamp-2">
            {title}
          </h2>

          {/* Meta Info */}
          <div className="hcrsl-meta-info-container flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80 mb-4">
            <span className="hcrsl-year flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {year}
            </span>
            <span className="hcrsl-duration flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
            <span className="hcrsl-rating flex items-center gap-1.5 bg-yellow-500/20 px-2 py-0.5 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}/10
            </span>
          </div>

          {/* Description */}
          <p className="hcrsl-description max-w-xl text-sm md:text-base text-white/70 leading-relaxed mb-4 line-clamp-3">
            {overview}
          </p>

          {/* Action Buttons */}
          <div className="hcrsl-actions flex items-center gap-3">
            <button
              className="hcrsl-button-trailer-play flex items-center gap-2 bg-white text-black group px-6 py-2.5 rounded-full font-semibold hover:bg-red-primary transition-all hover:scale-105"
              onClick={(e) => {
                e.preventDefault()
                handlePlayTrailer()
              }}
              disabled={isLoading}
            >
              <Play className="w-5 h-5 fill-red-primary stroke-red-primary group-hover:fill-amber-50 group-hover:stroke-amber-50" />
              <span className="hidden md:block font-poppins tracking-wider">Watch Now</span>
            </button>

            <WatchlistButton
              mediaId={item.id}
              mediaType={mediaType as "movie" | "tv"}
              title={title}
              poster={poster}
              rating={rating}
              year={year}
              variant="full"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}