/**
 * Person Card Component
 * 
 * Interactive card component for displaying person information.
 * Features 3D tilt effect on hover, parallax content movement,
 * and displays notable works, popularity, and department.
 */

"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TMDB_CONFIG } from "@/constants/api";
import { Person } from "@/types/person";
import { TrendingUp } from "lucide-react";

interface PersonCardProps {
  person: Person & { gender?: number; popularity?: number };
}

// Format gender code to single character
const transformGenderShort = (genderCode?: number): string => {
  if (genderCode === 1) return "F";
  if (genderCode === 2) return "M";
  return "O";
};

// Format popularity score to one decimal place
const transformPopularity = (score?: number): string => {
  if (!score) return "0.0";
  return score.toFixed(1);
};

/**
 * PersonCard Component
 * 
 * @param person - Person data with optional gender and popularity
 * @returns Rendered person card with tilt effect
 */
export function PersonCard({ person }: PersonCardProps) {
  const {
    id,
    name,
    profile_path,
    poster,
    department,
    known_for_department,
    known_for = [],
    gender,
    popularity,
  } = person;

  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Extract up to 5 notable works for display
  const notableWorks = known_for
    .map(
      (item) =>
        item.title || item.name || item.original_title || item.original_name,
    )
    .filter(Boolean)
    .slice(0, 5)
    .join("   •   ");

  // Build image URL
  const baseUrl = TMDB_CONFIG.IMAGE_BASE_URL.endsWith("/")
    ? TMDB_CONFIG.IMAGE_BASE_URL
    : `${TMDB_CONFIG.IMAGE_BASE_URL}/`;
  const imageSize = TMDB_CONFIG.IMAGE_SIZES.profile.medium;
  const imageUrl = profile_path
    ? `${baseUrl}${imageSize}${profile_path}`
    : null;

  // Handle 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // Tilt transform styles
  const cardTiltStyle = {
    transform: isHovered
      ? `perspective(1200px) rotateY(${coords.x * 16}deg) rotateX(${-coords.y * 16}deg) translateY(-6px)`
      : "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0px)",
    transition: isHovered
      ? "transform 0.05s ease-out, shadow 0.3s ease"
      : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), shadow 0.5s ease",
  };

  // Parallax content movement
  const contentParallaxStyle = {
    transform: isHovered
      ? `translate3d(${coords.x * -10}px, ${coords.y * -10 - 2}px, 30px)`
      : `translate3d(0px, 0px, 0px)`,
    transition: isHovered
      ? "transform 0.05s ease-out"
      : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
  };

  return (
    <Link
      href={`/person/${id}`}
      className="pcrd-wrapper-main group relative block w-full 0max-w-[340px] mx-auto focus-visible:outline-none"
      aria-label={`View profile of ${name}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={cardTiltStyle}
        className="pcrd-cnt relative w-full aspect-2/3 bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-900 shadow-xl group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.95)] will-change-transform transform-gpu"
      >
        {/* Image Container */}
        <div className="pcrd-image-cnt absolute inset-0 z-0 w-full h-full scale-100 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Profile photo of ${name}`}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="pcrd-image object-cover object-top brightness-100 contrast-[1.02]"
              loading="eager"
            />
          ) : (
            <div className="pcrd-image-placeholder absolute inset-0 bg-neutral-900 flex items-center justify-center font-mono text-neutral-800 text-3xl font-light uppercase tracking-widest">
              {name}
            </div>
          )}
        </div>

        {/* Bottom Fade Mask */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent via-45% transition-opacity duration-500 group-hover:via-neutral-950/60" />

        {/* Metadata Header */}
        <div className="pcrd-meta-info absolute top-0 inset-x-0 z-20 p-5 flex items-center justify-between pointer-events-none select-none font-mono">
          <span className="text-[10px] font-bold text-neutral-300 bg-neutral-950/70 backdrop-blur-md w-6 h-6 flex items-center justify-center rounded-full border border-white/5 tracking-normal">
            {transformGenderShort(gender)}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-neutral-300 bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 flex items-center gap-1">
            <span>
              <TrendingUp size={14} className="text-amber-400 font-bold" />
            </span>{" "}
            {transformPopularity(popularity)}
          </span>
        </div>

        {/* Content Section with Parallax */}
        <div
          style={contentParallaxStyle}
          className="absolute inset-x-0 bottom-0 z-20 p-6 pt-36 flex flex-col justify-end pointer-events-none transform-gpu"
        >
          <h3 className="text-2xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-lg mb-2 group-hover:border-l group-hover:border-b group-hover:border-white/50 transition-all delay-200 duration-300 group-hover:px-0.5">
            {name}
          </h3>

          {/* Notable Works */}
          {notableWorks && (
            <p className="text-[11px] text-neutral-300 font-medium tracking-wide uppercase line-clamp-2 border-l-2 border-rose-500/60 pl-3 mt-1 pr-2 leading-relaxed transition-colors duration-300 group-hover:text-white group-hover:border-rose-500">
              {notableWorks}
            </p>
          )}

          {/* Department Tag */}
          <div className="mt-3 text-[9px] font-mono tracking-[0.25em] text-neutral-300 uppercase font-bold">
            {known_for_department || "Talent Core"}
          </div>
        </div>
      </div>
    </Link>
  );
}