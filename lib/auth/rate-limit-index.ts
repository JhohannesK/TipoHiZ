import { MongoClient } from 'mongodb';

const RATE_LIMIT_COLLECTION = 'rateLimit';

export type RateLimitIndexCreator = (uri: string) => Promise<void>;

let inFlight: Promise<void> | undefined;

export async function createRateLimitKeyIndex(uri: string): Promise<void> {
   const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5_000,
   });

   try {
      await client.connect();
      await client
         .db()
         .collection(RATE_LIMIT_COLLECTION)
         .createIndex({ key: 1 }, { unique: true });
   } finally {
      await client.close().catch(() => undefined);
   }
}

export function ensureRateLimitKeyIndex(
   uri: string,
   createIndex: RateLimitIndexCreator = createRateLimitKeyIndex
): void {
   if (inFlight) return;

   inFlight = Promise.resolve()
      .then(() => createIndex(uri))
      .catch((error: unknown) => {
         inFlight = undefined;
         console.error(
            'Failed to ensure the unique index on rateLimit.key',
            error
         );
      });
}

export function resetRateLimitKeyIndexForTests(): void {
   inFlight = undefined;
}
