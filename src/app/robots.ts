/**
 * Robots.txt
 * Tells search engines what to crawl.
 * Next.js serves this at /robots.txt automatically.
 */

import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // API routes — not for indexing
          '/watchlist', // Private user page
          '/sign-in',   // Clerk auth
          '/sign-up',   // Clerk auth
          '/search',    // Dynamic — no SEO value
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}