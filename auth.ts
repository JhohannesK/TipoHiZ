import { betterAuth } from 'better-auth';
import { dash } from '@better-auth/infra';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';
import { authTrustedOrigins, resolveAuthBaseUrl } from '@/lib/auth/base-url';
import { mongoTransactionsEnabled } from '@/lib/auth/mongo';
import { ensureRateLimitKeyIndex } from '@/lib/auth/rate-limit-index';

function createAuth() {
   const uri = process.env.MONGODB_URI;
   if (!uri) {
      throw new Error('MONGODB_URI is not set');
   }

   ensureRateLimitKeyIndex(uri);

   const client = new MongoClient(uri);
   const db = client.db();

   return betterAuth({
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: resolveAuthBaseUrl(),
      trustedOrigins: authTrustedOrigins(),
      database: mongodbAdapter(db, {
         client,
         transaction: mongoTransactionsEnabled(uri),
      }),
      rateLimit: {
         // Stored in MongoDB. ensureRateLimitKeyIndex creates the unique
         // index on `key` once; a failed attempt is logged and retried later.
         storage: 'database',
      },
      emailAndPassword: {
         enabled: true,
         // Register still sends the user to /login. A session is created on sign-in.
         // false also makes duplicate sign-ups return a synthetic success,
         // so the response does not reveal that the email is registered.
         autoSignIn: false,
      },
      socialProviders: {
         google: {
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
         },
         github: {
            clientId: process.env.GITHUB_CLIENT_ID ?? '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
         },
         twitter: {
            clientId: process.env.TWITTER_CLIENT_ID ?? '',
            clientSecret: process.env.TWITTER_CLIENT_SECRET ?? '',
         },
      },
      account: {
         accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            requireLocalEmailVerified: true,
            /**
             * Google and GitHub are the providers we trust, and only when
             * they report a verified email. `trustedProviders` also links
             * when the email is missing or unverified, so the list stays
             * empty and the verified-email path is the only way in.
             * Twitter is omitted on purpose. X often returns no email
             * (Better Auth then stores an unverified placeholder). Those
             * accounts stay separate unless X returns a verified
             * confirmed_email.
             */
            trustedProviders: [],
         },
      },
      onAPIError: {
         errorURL: '/login',
      },
      plugins: [
         dash({
            apiKey: process.env.BETTER_AUTH_API_KEY,
         }),
         nextCookies(),
      ],
   });
}

type Auth = ReturnType<typeof createAuth>;

const globalForAuth = globalThis as unknown as { tipohizAuth?: Auth };

export function getAuth(): Auth {
   if (!globalForAuth.tipohizAuth) {
      globalForAuth.tipohizAuth = createAuth();
   }
   return globalForAuth.tipohizAuth;
}
