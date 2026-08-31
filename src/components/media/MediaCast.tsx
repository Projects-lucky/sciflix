/**
 * Media Cast Component
 *
 * Displays cast and crew information for movies and TV shows.
 * Shows top 12 cast members with option to expand.
 * Includes director information and person links.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, User, ImageOff } from "lucide-react";

interface Credit {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
}

interface MediaCastProps {
  cast: Credit[];
  crew: Credit[];
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

/**
 * MediaCast Component
 *
 * @param cast - Array of cast members
 * @param crew - Array of crew members
 * @returns Rendered cast and crew section
 */
export function MediaCast({ cast, crew }: MediaCastProps) {
  const [showAllCast, setShowAllCast] = useState(false);

  if (!cast.length && !crew.length) return null;

  const topCast = cast.slice(0, showAllCast ? undefined : 12);
  const hasMoreCast = cast.length > 12;
  const director = crew.find((c) => c.job === "Director")?.name;
  console.log(crew);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold font-poppins flex items-center gap-2 mb-4">
        Cast & Crew
      </h2>

      {/* Director Section */}
      {director && (
        <span className="mb-4 w-auto max-w-fit px-2 py-1.5 h-auto border bg-slate-950/10 dark:bg-slate-900 flex flex-col items-start gap-3">
          <h3 className="text-xl font-light text-gray-500 dark:text-gray-400 mb-2">
            Director
          </h3>
          <p className="font-medium font-poppins text-2xl">{director}</p>
        </span>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div>
          <h3 className="text-xl font-light text-gray-500 dark:text-gray-400 mb-3">
            Cast
          </h3>
          <div className="mgrid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {topCast.map((person) => (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="group text-center"
              >
                <div className="flex flex-row gap-3.5 items-center">
                  <div className="relative w-full max-w-18 aspect-square rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow">
                    {person.profile_path ? (
                      <Image
                        src={`${IMAGE_BASE_URL}/w185${person.profile_path}`}
                        alt={person.name}
                        fill
                        sizes='"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <ImageOff className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start ">
                    <p className="text-lg font-medium mt-1 truncate">
                      {person.name}
                    </p>
                    <p className="text-md text-gray-500 truncate">
                      {person.character || person.job}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMoreCast && (
            <button
              onClick={() => setShowAllCast(!showAllCast)}
              className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              {showAllCast ? "Show Less" : `Show All ${cast.length} Cast`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
