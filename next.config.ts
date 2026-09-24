import type { NextConfig } from 'next';

// ============================================
// SECURITY HEADERS
// Applied to every response via headers() below
// ============================================

const securityHeaders = [
  // Prevent clickjacking — no iframing our site
  { key: 'X-Frame-Options', value: 'DENY' },

  // Prevent MIME sniffing — browser won't guess content types
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Control referrer info sent to third parties
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },

  // Block access to sensitive browser APIs we don't use
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },

  // Disable the legacy XSS filter (harmful in modern browsers)
  { key: 'X-XSS-Protection', value: '0' },

  // Force HTTPS on production domains (ignored on localhost)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
];

// ============================================
// NEXT CONFIG
// ============================================

const nextConfig: NextConfig = {
  /* existing config options */
  reactCompiler: true,

  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },

  /* new security hardening */
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;