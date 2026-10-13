// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest';
import { getAuth } from '@/auth';

const globalForAuth = globalThis as { tipohizAuth?: unknown };

const ENV_KEYS = [
   'BETTER_AUTH_API_KEY',
   'BETTER_AUTH_SECRET',
   'BETTER_AUTH_URL',
   'MONGODB_URI',
   'GOOGLE_CLIENT_ID',
   'GOOGLE_CLIENT_SECRET',
   'GITHUB_CLIENT_ID',
   'GITHUB_CLIENT_SECRET',
   'TWITTER_CLIENT_ID',
   'TWITTER_CLIENT_SECRET',
] as const;

describe('dash plugin', () => {
   const previous = Object.fromEntries(
      ENV_KEYS.map((key) => [key, process.env[key]])
   );

   afterEach(() => {
      for (const key of ENV_KEYS) {
         const value = previous[key];
         if (value === undefined) delete process.env[key];
         else process.env[key] = value;
      }
      delete globalForAuth.tipohizAuth;
   });

   it('should create auth when BETTER_AUTH_API_KEY is missing', () => {
      delete process.env.BETTER_AUTH_API_KEY;
      process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/tipohiz';
      process.env.BETTER_AUTH_SECRET =
         'ci-test-auth-secret-ci-test-auth-secret';
      process.env.BETTER_AUTH_URL = 'http://localhost:3000';
      process.env.GOOGLE_CLIENT_ID = 'test';
      process.env.GOOGLE_CLIENT_SECRET = 'test';
      process.env.GITHUB_CLIENT_ID = 'test';
      process.env.GITHUB_CLIENT_SECRET = 'test';
      process.env.TWITTER_CLIENT_ID = 'test';
      process.env.TWITTER_CLIENT_SECRET = 'test';
      delete globalForAuth.tipohizAuth;

      expect(() => getAuth()).not.toThrow();
   });
});
