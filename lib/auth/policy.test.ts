// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAuth } from '@/auth';
import { authPolicy, authPolicyFromEnv } from './policy';

const betterAuth = vi.hoisted(() =>
   vi.fn((options: Record<string, unknown>) => ({ options }))
);
const mongodbAdapter = vi.hoisted(() =>
   vi.fn((_db: unknown, options: { transaction?: boolean }) => ({
      kind: 'mongo',
      transaction: options.transaction,
   }))
);
const ensureRateLimitKeyIndex = vi.hoisted(() => vi.fn());

vi.mock('better-auth', () => ({
   betterAuth,
}));

vi.mock('@better-auth/mongo-adapter', () => ({
   mongodbAdapter,
}));

vi.mock('@better-auth/infra', () => ({
   dash: vi.fn((options: unknown) => ({ name: 'dash', options })),
}));

vi.mock('better-auth/next-js', () => ({
   nextCookies: vi.fn(() => ({ name: 'nextCookies' })),
}));

vi.mock('mongodb', () => ({
   MongoClient: class {
      constructor(public readonly uri: string) {}
      db() {
         return { name: 'tipohiz' };
      }
   },
}));

vi.mock('@/lib/auth/rate-limit-index', () => ({
   ensureRateLimitKeyIndex,
}));

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

describe('authPolicy', () => {
   it('should keep account linking strict and trustedProviders empty', () => {
      expect(authPolicy().account.accountLinking).toEqual({
         enabled: true,
         allowDifferentEmails: false,
         requireLocalEmailVerified: true,
         trustedProviders: [],
      });
   });

   it('should leave autoSignIn off so register does not create a session', () => {
      expect(authPolicy().emailAndPassword).toEqual({
         enabled: true,
         autoSignIn: false,
      });
   });

   it('should store rate limits in the database and send API errors to login', () => {
      expect(authPolicy().rateLimit).toEqual({ storage: 'database' });
      expect(authPolicy().onAPIError).toEqual({ errorURL: '/login' });
   });

   it('should use empty OAuth credentials when env values are missing', () => {
      expect(authPolicyFromEnv({})).toMatchObject({
         socialProviders: {
            google: { clientId: '', clientSecret: '' },
            github: { clientId: '', clientSecret: '' },
            twitter: { clientId: '', clientSecret: '' },
         },
      });
   });

   it('should pass through provider credentials from env', () => {
      expect(
         authPolicyFromEnv({
            GOOGLE_CLIENT_ID: 'g-id',
            GOOGLE_CLIENT_SECRET: 'g-secret',
            GITHUB_CLIENT_ID: 'gh-id',
            GITHUB_CLIENT_SECRET: 'gh-secret',
            TWITTER_CLIENT_ID: 'x-id',
            TWITTER_CLIENT_SECRET: 'x-secret',
         }).socialProviders
      ).toEqual({
         google: { clientId: 'g-id', clientSecret: 'g-secret' },
         github: { clientId: 'gh-id', clientSecret: 'gh-secret' },
         twitter: { clientId: 'x-id', clientSecret: 'x-secret' },
      });
   });
});

describe('createAuth policy wiring', () => {
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
      vi.clearAllMocks();
   });

   function stubEnv(uri: string) {
      process.env.MONGODB_URI = uri;
      process.env.BETTER_AUTH_SECRET =
         'ci-test-auth-secret-ci-test-auth-secret';
      process.env.BETTER_AUTH_URL = 'http://localhost:3000';
      process.env.GOOGLE_CLIENT_ID = 'google-id';
      process.env.GOOGLE_CLIENT_SECRET = 'google-secret';
      process.env.GITHUB_CLIENT_ID = 'github-id';
      process.env.GITHUB_CLIENT_SECRET = 'github-secret';
      process.env.TWITTER_CLIENT_ID = 'twitter-id';
      process.env.TWITTER_CLIENT_SECRET = 'twitter-secret';
      delete process.env.BETTER_AUTH_API_KEY;
      delete globalForAuth.tipohizAuth;
   }

   it('should throw when MONGODB_URI is unset', () => {
      delete process.env.MONGODB_URI;
      delete globalForAuth.tipohizAuth;
      expect(() => getAuth()).toThrow(/MONGODB_URI is not set/);
      expect(betterAuth).not.toHaveBeenCalled();
   });

   it('should pass the strict policy into betterAuth and index rate-limit keys', () => {
      stubEnv('mongodb://127.0.0.1:27017/tipohiz');
      const auth = getAuth() as { options: Record<string, unknown> };

      expect(ensureRateLimitKeyIndex).toHaveBeenCalledWith(
         'mongodb://127.0.0.1:27017/tipohiz'
      );
      expect(mongodbAdapter).toHaveBeenCalledWith(
         { name: 'tipohiz' },
         expect.objectContaining({ transaction: false })
      );
      expect(auth.options).toMatchObject({
         ...authPolicyFromEnv({
            GOOGLE_CLIENT_ID: 'google-id',
            GOOGLE_CLIENT_SECRET: 'google-secret',
            GITHUB_CLIENT_ID: 'github-id',
            GITHUB_CLIENT_SECRET: 'github-secret',
            TWITTER_CLIENT_ID: 'twitter-id',
            TWITTER_CLIENT_SECRET: 'twitter-secret',
         }),
         baseURL: 'http://localhost:3000',
         account: {
            accountLinking: {
               enabled: true,
               allowDifferentEmails: false,
               requireLocalEmailVerified: true,
               trustedProviders: [],
            },
         },
         emailAndPassword: { enabled: true, autoSignIn: false },
         rateLimit: { storage: 'database' },
         onAPIError: { errorURL: '/login' },
      });
      expect(getAuth()).toBe(auth);
      expect(betterAuth).toHaveBeenCalledTimes(1);
   });

   it('should enable Mongo transactions for a replica-set URI', () => {
      stubEnv('mongodb+srv://user:pass@cluster0.mongodb.net/tipohiz');
      getAuth();
      expect(mongodbAdapter).toHaveBeenCalledWith(
         { name: 'tipohiz' },
         expect.objectContaining({ transaction: true })
      );
   });
});
