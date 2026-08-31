import { config } from 'dotenv';
config({ path: '.env.local' });
import { defineConfig } from 'drizzle-kit';


if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file');
}


export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts', // Drizzle uses TypeScript schemas
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
