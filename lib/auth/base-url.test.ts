import { describe, expect, it } from 'vitest';
import { authTrustedOrigins, resolveAuthBaseUrl } from './base-url';

describe('authTrustedOrigins', () => {
   it('should combine the comma-separated list with BETTER_AUTH_URL and VERCEL_URL', () => {
      expect(
         authTrustedOrigins({
            BETTER_AUTH_TRUSTED_ORIGINS:
               'https://tipohiz.vercel.app, https://tipohiz-preview.vercel.app',
            BETTER_AUTH_URL: 'http://localhost:3000',
            VERCEL_URL: 'tipohiz-abc123.vercel.app',
         })
      ).toEqual([
         'https://tipohiz.vercel.app',
         'https://tipohiz-preview.vercel.app',
         'http://localhost:3000',
         'https://tipohiz-abc123.vercel.app',
      ]);
   });

   it('should drop blanks and duplicate origins', () => {
      expect(
         authTrustedOrigins({
            BETTER_AUTH_TRUSTED_ORIGINS: ' http://localhost:3000 , ,',
            BETTER_AUTH_URL: 'http://localhost:3000',
            VERCEL_URL: '  ',
         })
      ).toEqual(['http://localhost:3000']);
   });

   it('should return no origins when the env vars are unset', () => {
      expect(authTrustedOrigins({})).toEqual([]);
   });
});

describe('resolveAuthBaseUrl', () => {
   it('should prefer BETTER_AUTH_URL over Vercel hosts', () => {
      expect(
         resolveAuthBaseUrl({
            BETTER_AUTH_URL: 'https://tipohiz.vercel.app',
            VERCEL_ENV: 'production',
            VERCEL_PROJECT_PRODUCTION_URL: 'ignored.vercel.app',
            VERCEL_URL: 'also-ignored.vercel.app',
         })
      ).toBe('https://tipohiz.vercel.app');
   });
});
