/**
 * Vitest Setup File - Runs before all tests
 */

import '@testing-library/jest-dom/vitest';
// OR if the above doesn't work, use:
// import '@testing-library/jest-dom';

// Use Object.defineProperty for NODE_ENV (Next.js readonly fix)
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  configurable: true,
  enumerable: true,
  writable: true,
});

// Use vi.stubEnv for other environment variables
import { vi } from 'vitest';

vi.stubEnv('TMDB_API_KEY', 'test-api-key');
vi.stubEnv('TMDB_ACCESS_TOKEN', 'test-access-token');
vi.stubEnv('TMDB_API_BASE_URL', 'https://api.themoviedb.org/3');
vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'test-clerk-key');
vi.stubEnv('CLERK_SECRET_KEY', 'test-clerk-secret');
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');

// Optional: Mock console methods to reduce noise
// console.log = vi.fn();
// console.error = vi.fn();
// console.warn = vi.fn();