/**
 * Genre Showcase Component
 * 
 * Displays rows of movies and TV shows organized by genre.
 * Fetches data for each genre in parallel for optimal performance.
 * Supports all, movie-only, or tv-only display modes with row limits.
 */

import { GenericCarousel, MediaCard } from "@/components";
import { moviesService, tvService } from "@/services";
import { GENRE_OPTIONS_MOVIE, GENRE_OPTIONS_TV } from "@/constants/filters";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface GenreShowcaseProps {
  type: "movie" | "tv" | "all";
  maxRows?: number;
}

interface SanitizedMediaItem {
  id: number;
  title: string;
  poster: string | null;
  rating: number;
  year: string;
  mediaType: "movie" | "tv";
}

/**
 * GenreShowcase Component
 * 
 * @param type - Media type to display (movie, tv, or all)
 * @param maxRows - Maximum number of genre rows to display per type
 * @returns Rendered genre showcase with carousels
 */
export async function GenreShowcase({ type, maxRows }: GenreShowcaseProps) {
  // Calculate row limits based on type and maxRows
  let movieLimit = type === "movie" ? maxRows : undefined;
  let tvLimit = type === "tv" ? maxRows : undefined;

  if (type === "all" && maxRows) {
    movieLimit = Math.ceil(maxRows / 2);
    tvLimit = Math.floor(maxRows / 2);
  }

  // Slice genre options to respect row limits
  const movieGenresToFetch = movieLimit ? GENRE_OPTIONS_MOVIE.slice(0, movieLimit) : GENRE_OPTIONS_MOVIE;
  const tvGenresToFetch = tvLimit ? GENRE_OPTIONS_TV.slice(0, tvLimit) : GENRE_OPTIONS_TV;

  // Build fetch tasks for parallel execution
  const tasks: Array<{
    id: string;
    label: string;
    service: typeof moviesService | typeof tvService;
    genreId: string; 
    mediaType: "movie" | "tv";
  }> = [];

  if (type === "movie" || type === "all") {
    movieGenresToFetch.forEach((g) => {
      tasks.push({
        id: `movie-${g.value}`,
        label: g.label, 
        service: moviesService,
        genreId: String(g.value),
        mediaType: "movie",
      });
    });
  }

  if (type === "tv" || type === "all") {
    tvGenresToFetch.forEach((g) => {
      tasks.push({
        id: `tv-${g.value}`,
        label: g.label, 
        service: tvService,
        genreId: String(g.value),
        mediaType: "tv",
      });
    });
  }

  // Fetch all genre data in parallel
  const fetchPromises = tasks.map(async (task) => {
    try {
      const response = await task.service.getDiscover({
        with_genres: task.genreId,
        sort_by: "popularity.desc",
        page: 1,
      } as any);

      const cleanItems = (response?.results || [])
        .slice(0, 10)
        .map((item: any) => ({
          id: item.id,
          title: item.title || item.name || "Untitled",
          poster: item.poster_path,
          rating: item.vote_average || 0,
          year: (item.release_date || item.first_air_date || "").slice(0, 4) || "N/A",
          mediaType: task.mediaType,
        }));

      return {
        id: task.id,
        label: task.label,
        mediaType: task.mediaType,
        genreId: task.genreId,
        items: cleanItems,
      };
    } catch (error) {
      console.error(`[Fetch Failure] "${task.label}" failed:`, error);
      return { id: task.id, label: task.label, mediaType: task.mediaType, genreId: task.genreId, items: [] };
    }
  });

  const resolvedRows = await Promise.all(fetchPromises);

  // Filter rows with items
  const movieRows = resolvedRows.filter((r) => r.mediaType === "movie" && r.items.length > 0);
  const tvRows = resolvedRows.filter((r) => r.mediaType === "tv" && r.items.length > 0);

  return (
    <div className="gsh-wrapper-main w-full flex flex-col space-y-12">
      {/* Movie Section */}
      {movieRows.length > 0 && (
        <div className="gsh-wrapper-movie space-y-6">
          <div className="gsh-header-movie px-4 border-b border-zinc-800 pb-2">
            <h2 className="gsh-header-title text-2xl font-poppins font-bold text-red-primary tracking-wider">Movies</h2>
          </div>
          <div className="gsh-content space-y-8">
            {movieRows.map((row) => (
              <div key={row.id} className="space-y-2">
                <h3 className="gsh-content-title text-lg w-auto font-poppins px-4 flex flex-row items-center group transition-all">
                  <Link href={`/movies?genre=${row.genreId}`} className="flex flex-row gap-2 w-auto">
                    {row.label} <ChevronRight className="size-auto group-hover:text-red-primary" />
                  </Link>
                </h3>
                <GenericCarousel
                  items={row.items}
                  renderKey={(item) => item.id}
                  renderItem={(item) => <MediaCard {...item} />}
                  itemClassName="w-54 h-98"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TV Shows Section */}
      {tvRows.length > 0 && (
        <div className="space-y-6">
          <div className="px-4 border-b border-zinc-800 pb-2">
            <h2 className="text-2xl font-poppins font-bold text-red-primary tracking-wider capitalize">tv shows</h2>
          </div>
          <div className="space-y-8">
            {tvRows.map((row) => (
              <div key={row.id} className="space-y-2">
                <h3 className="text-lg w-auto font-poppins px-4 flex flex-row items-center group transition-all">
                  <Link href={`/tv?genre=${row.genreId}`} className="flex flex-row gap-2 w-auto">
                    {row.label} <ChevronRight className="size-auto group-hover:text-red-primary" />
                  </Link>
                </h3>
                <GenericCarousel
                  items={row.items}
                  renderKey={(item) => item.id}
                  renderItem={(item) => <MediaCard {...item} />}
                  itemClassName="w-54 h-98"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}