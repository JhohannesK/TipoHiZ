import { betterAuth } from 'better-auth';
import { dash } from '@better-auth/infra';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';
import { authTrustedOrigins, resolveAuthBaseUrl } from '@/lib/auth/base-url';
import { mongoTransactionsEnabled } from '@/lib/auth/mongo';
import { authPolicyFromEnv } from '@/lib/auth/policy';
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
      ...authPolicyFromEnv(),
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
