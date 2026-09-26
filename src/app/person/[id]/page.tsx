/**
 * Person Detail Page - Server Component
 * Route: /person/[id]
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonDetail } from "@/components/person/person-detail";
import { TMDB_CONFIG } from "@/lib/config/app.config";
import { getPersonDetails } from "@/lib/services/tmdb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;

  const personId = Number(id);
  if (!Number.isInteger(personId) || personId <= 0) {
    notFound();
  }

  const person = await getPersonDetails(personId, {
    append_to_response: "movie_credits,tv_credits,external_ids",
  });

  if (!person) {
    notFound();
  }

  // Pre-process data in Server Component to avoid serialization issues
  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : null;

  // Build filmography on the server
  const movieCast = (person as any).movie_credits?.cast || [];
  const tvCast = (person as any).tv_credits?.cast || [];

  const filmography = [
    ...movieCast.map((m: any) => ({
      id: m.id,
      title: m.title,
      year: m.release_date?.split("-")[0] || null,
      character: m.character || null,
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
        : null,
      mediaType: "movie" as const,
      popularity: m.popularity || 0,
    })),
    ...tvCast.map((t: any) => ({
      id: t.id,
      title: t.name,
      year: t.first_air_date?.split("-")[0] || null,
      character: t.character || null,
      posterUrl: t.poster_path
        ? `https://image.tmdb.org/t/p/w92${t.poster_path}`
        : null,
      mediaType: "tv" as const,
      popularity: t.popularity || 0,
    })),
  ];

  // Prepare clean props for the Client Component
  const personData = {
    id: person.id,
    name: person.name,
    profileUrl,
    knownForDepartment: person.known_for_department,
    birthday: person.birthday,
    deathday: person.deathday,
    placeOfBirth: person.place_of_birth,
    biography: person.biography,
    externalIds: (person as any).external_ids || null,
    filmography,
  };

  return <PersonDetail person={personData} />;
}

// ============================================
// METADATA (SEO + OpenGraph)
// ============================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const personId = Number(id);

  if (!Number.isInteger(personId) || personId <= 0) {
    return { title: "Not Found" };
  }

  const person = await getPersonDetails(personId);

  if (!person) {
    return { title: "Person Not Found" };
  }

  const name = person.name;
  const department = person.known_for_department;

  const title = department ? `${name} — ${department}` : name;

  const description = person.biography
    ? person.biography.slice(0, 160)
    : `Biography, filmography, and photos of ${name}.`;

  const ogImage = person.profile_path
    ? `${TMDB_CONFIG.image.baseUrl}/h632${person.profile_path}`
    : null;

  const images = ogImage
    ? [{ url: ogImage, width: 421, height: 632, alt: name }]
    : undefined;

  return {
    title,
    description,

    openGraph: {
      type: "profile",
      title,
      description,
      url: `/person/${personId}`,
      images,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },

    alternates: {
      canonical: `/person/${personId}`,
    },
  };
}
