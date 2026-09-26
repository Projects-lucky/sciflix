/**
 * PersonDetail Component
 *
 * Cinematic person detail page.
 *
 * Responsibilities:
 * - Receives pre-processed person data from the Server Component
 * - Handles presentation only
 * - Keeps existing data contracts and routing intact
 * - Uses purely semantic shadcn/ui Tailwind tokens for perfect light/dark mode compatibility
 */

"use client";

import Image from "next/image";
import { MediaListItem } from "@/components/shared/media-list-item";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

interface FilmographyItem {
  id: number;
  title: string;
  year: string | null;
  character: string | null;
  posterUrl: string | null;
  mediaType: "movie" | "tv";
  popularity: number;
}

interface PersonData {
  id: number;
  name: string;
  profileUrl: string | null;
  knownForDepartment: string | null;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  biography: string | null;
  externalIds: {
    imdb_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
  } | null;
  filmography: FilmographyItem[];
}

export interface PersonDetailProps {
  person: PersonData;
  className?: string;
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getAge(
  birthday: string | null,
  deathday: string | null,
): number | null {
  if (!birthday) return null;

  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  const age = Math.floor(
    (end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );

  return age > 0 ? age : null;
}

// ============================================
// SMALL UI COMPONENTS
// ============================================

function SectionHeading({
  eyebrow,
  title,
  count,
}: {
  eyebrow?: string;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <div className="flex items-end gap-3">
        <h2 className="text-2xl font-semibold font-poppins tracking-wide capitalize text-foreground sm:text-3xl">
          {title}
        </h2>
        {typeof count === "number" && (
          <span className="mb-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

function ExternalLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-accent hover:text-accent-foreground"
    >
      <span
        aria-hidden="true"
        className="text-[11px] text-muted-foreground/70 transition-colors group-hover:text-foreground"
      >
        {icon}
      </span>
      {label}
      <span
        aria-hidden="true"
        className="text-[10px] text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
      >
        ↗
      </span>
    </a>
  );
}

// ============================================
// COMPONENT
// ============================================

export function PersonDetail({ person, className }: PersonDetailProps) {
  const age = getAge(person.birthday, person.deathday);
  const birthday = formatDate(person.birthday);
  const deathday = formatDate(person.deathday);

  // ─────────────────────────────────────────
  // Dedupe: TMDB can return the same (id, mediaType) across seasons/roles
  // ─────────────────────────────────────────
  const uniqueFilmography = Array.from(
    new Map(
      person.filmography.map((item) => [`${item.mediaType}-${item.id}`, item]),
    ).values(),
  );

  // Known For: top 10 by popularity
  const knownFor = [...uniqueFilmography]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  // Filmography: top 10 by year desc
  const sortedFilmography = [...uniqueFilmography]
    .sort((a, b) => {
      if (!a.year && !b.year) return 0;
      if (!a.year) return 1;
      if (!b.year) return -1;
      return Number(b.year) - Number(a.year);
    })
    .slice(0, 15);

  return (
    <main
      className={cn("min-h-screen bg-background text-foreground", className)}
    >
      {/* ==========================================
          HERO
      =========================================== */}
      <section className="relative">
        {/* Ambient background using semantic tokens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-170 overflow-hidden"
        >
          <div className="absolute left-1/2 -top-45 h-130 w-130 -translate-x-1/2 rounded-full bg-muted/50 blur-[120px]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,var(--muted),transparent_42%)] opacity-50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pt-36 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
            {/* PROFILE IMAGE */}
            <div className="mx-auto w-full max-w-55 md:mx-0 lg:max-w-70">
              <div className="group relative aspect-2/3 overflow-hidden rounded-2xl border border-border bg-muted shadow-xl ring-1 ring-foreground/5 transition-all duration-500 hover:shadow-2xl hover:ring-foreground/10">
                {person.profileUrl ? (
                  <Image
                    src={person.profileUrl}
                    alt={person.name}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 220px, 280px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No Image
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40"
                />
              </div>
            </div>

            {/* PERSON INFORMATION */}
            <div className="flex min-w-0 flex-col justify-center">
              <div className="max-w-3xl">
                {person.knownForDepartment && (
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {person.knownForDepartment}
                  </p>
                )}

                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  {person.name}
                </h1>

                {/* PERSONAL DETAILS */}
                <div className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-2">
                  {birthday && (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Born
                      </p>
                      <p className="text-sm text-foreground/80 sm:text-base">
                        {birthday}
                        {age && !deathday && (
                          <span className="ml-1.5 text-muted-foreground">
                            · {age} years old
                          </span>
                        )}
                        {age && deathday && (
                          <span className="ml-1.5 text-muted-foreground">
                            · age {age}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {deathday && (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Died
                      </p>
                      <p className="text-sm text-foreground/80 sm:text-base">
                        {deathday}
                      </p>
                    </div>
                  )}

                  {person.placeOfBirth && (
                    <div className="sm:col-span-2">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        From
                      </p>
                      <p className="max-w-xl text-sm leading-6 text-foreground/70 sm:text-base">
                        {person.placeOfBirth}
                      </p>
                    </div>
                  )}
                </div>

                {/* EXTERNAL LINKS */}
                {person.externalIds && (
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {person.externalIds.imdb_id && (
                      <ExternalLink
                        href={`https://www.imdb.com/name/${person.externalIds.imdb_id}`}
                        label="IMDb"
                        icon="IMDb"
                      />
                    )}
                    {person.externalIds.instagram_id && (
                      <ExternalLink
                        href={`https://instagram.com/${person.externalIds.instagram_id}`}
                        label="Instagram"
                        icon="IG"
                      />
                    )}
                    {person.externalIds.twitter_id && (
                      <ExternalLink
                        href={`https://twitter.com/${person.externalIds.twitter_id}`}
                        label="Twitter"
                        icon="X"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ABOUT
      =========================================== */}
      {person.biography && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="grid gap-8 md:grid-cols-[180px_minmax(0,720px)] md:gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  About
                </p>
              </div>
              <div>
                <p className="text-base leading-8 text-foreground/70 sm:text-lg sm:leading-9">
                  {person.biography}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          KNOWN FOR + FILMOGRAPHY (Side by side on desktop)
      =========================================== */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            {/* ─────────────────────────────────────
                KNOWN FOR (top 10 by popularity)
            ───────────────────────────────────── */}
            {knownFor.length > 0 && (
              <div>
                <SectionHeading
                  eyebrow="Selected work"
                  title="Known For"
                  count={knownFor.length}
                />

                <div className="flex flex-col gap-2">
                  {knownFor.map((item) => (
                    <MediaListItem
                      key={`known-${item.mediaType}-${item.id}`}
                      item={{
                        id: item.id,
                        title: item.title,
                        mediaType: item.mediaType,
                        year: item.year,
                        posterUrl: item.posterUrl,
                        // no character for Known For
                      }}
                      className="max-w-100 bg-amber-700/10"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────
                FILMOGRAPHY (top 10 by year desc, with character)
            ───────────────────────────────────── */}
            {sortedFilmography.length > 0 && (
              <div>
                <SectionHeading
                  eyebrow="Complete credits"
                  title="Filmography"
                  count={sortedFilmography.length}
                />

                <div className="flex flex-col gap-2">
                  {sortedFilmography.map((item) => (
                    <MediaListItem
                      key={`film-${item.mediaType}-${item.id}-${item.character ?? ""}`}
                      item={{
                        id: item.id,
                        title: item.title,
                        mediaType: item.mediaType,
                        year: item.year,
                        posterUrl: item.posterUrl,
                        character: item.character,
                      }}
                      className="max-w-100 bg-amber-700/10"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
