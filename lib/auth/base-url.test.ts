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

   it('should strip trailing slashes from BETTER_AUTH_URL', () => {
      expect(
         resolveAuthBaseUrl({
            BETTER_AUTH_URL: 'https://tipohiz.vercel.app/',
         })
      ).toBe('https://tipohiz.vercel.app');
      expect(
         resolveAuthBaseUrl({
            BETTER_AUTH_URL: '  http://localhost:3000///  ',
         })
      ).toBe('http://localhost:3000');
      expect(
         authTrustedOrigins({
            BETTER_AUTH_TRUSTED_ORIGINS: 'http://localhost:3000',
            BETTER_AUTH_URL: 'http://localhost:3000/',
         })
      ).toEqual(['http://localhost:3000']);
   });

   it('should return undefined when no host env is set', () => {
      expect(resolveAuthBaseUrl({})).toBeUndefined();
   });

   it('should use the branch host when production has no production URL set', () => {
      expect(
         resolveAuthBaseUrl({
            VERCEL_ENV: 'production',
            VERCEL_BRANCH_URL: 'branch-xyz.vercel.app',
            VERCEL_URL: 'deployment-abc.vercel.app',
         })
      ).toBe('https://branch-xyz.vercel.app');
   });

   it('should not fall through a whitespace production URL to the branch host', () => {
      expect(
         resolveAuthBaseUrl({
            VERCEL_ENV: 'production',
            VERCEL_PROJECT_PRODUCTION_URL: '   ',
            VERCEL_BRANCH_URL: 'branch-xyz.vercel.app',
         })
      ).toBeUndefined();
   });

   it('should not treat Vercel branch or production hosts as trusted origins', () => {
      expect(
         authTrustedOrigins({
            VERCEL_ENV: 'preview',
            VERCEL_BRANCH_URL: 'branch-xyz.vercel.app',
            VERCEL_PROJECT_PRODUCTION_URL: 'tipohiz.com',
            VERCEL_URL: 'deployment-abc.vercel.app',
         })
      ).toEqual(['https://deployment-abc.vercel.app']);
   });
});
