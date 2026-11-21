import { createHash } from 'node:crypto';
import { mongoErrorLabel } from '@/lib/feedback/mongo-error';
import { sharedMongoDatabase } from '@/lib/stats/repository';

const COLLECTION = 'feedback_rate';
const TEN_MINUTES_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_TEN_MINUTES = 3;
const MAX_PER_DAY = 20;

export type FeedbackRateDecision = 'ok' | 'limited';

let indexAttempted = false;

export function resetFeedbackRateIndexForTests(): void {
   indexAttempted = false;
}

export function clientIp(request: Request): string {
   const forwarded = request.headers.get('x-forwarded-for');
   if (forwarded) {
      const first = forwarded.split(',')[0]?.trim();
      if (first) return first;
   }

   const real = request.headers.get('x-real-ip')?.trim();
   return real || 'unknown';
}

export function hashIp(ip: string): string {
   return createHash('sha256').update(ip).digest('hex');
}

export function feedbackRateDecision(
   createdAts: readonly Date[],
   now: Date
): FeedbackRateDecision {
   const dayAgo = now.getTime() - DAY_MS;
   const tenAgo = now.getTime() - TEN_MINUTES_MS;
   let dayCount = 0;
   let tenCount = 0;

   for (const createdAt of createdAts) {
      const time = createdAt.getTime();
      if (time < dayAgo) continue;
      dayCount += 1;
      if (time >= tenAgo) tenCount += 1;
   }

   if (tenCount >= MAX_PER_TEN_MINUTES || dayCount >= MAX_PER_DAY) {
      return 'limited';
   }

   return 'ok';
}

interface RateStamp {
   ipHash: string;
   createdAt: Date;
}

async function rateCollection() {
   const collection = sharedMongoDatabase().collection<RateStamp>(COLLECTION);

   if (!indexAttempted) {
      indexAttempted = true;
      void collection
         .createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 })
         .catch((error: unknown) => {
            console.error(
               'Failed to ensure feedback_rate TTL index',
               mongoErrorLabel(error)
            );
         });
   }

   return collection;
}

export async function enforceFeedbackRate(
   request: Request,
   now = new Date()
): Promise<FeedbackRateDecision> {
   const ipHash = hashIp(clientIp(request));
   const collection = await rateCollection();
   const since = new Date(now.getTime() - DAY_MS);
   const recent = await collection
      .find({ ipHash, createdAt: { $gte: since } })
      .project<RateStamp>({ createdAt: 1 })
      .toArray();
   const decision = feedbackRateDecision(
      recent.map((doc) => doc.createdAt),
      now
   );

   if (decision === 'limited') return decision;

   await collection.insertOne({ ipHash, createdAt: now });
   return 'ok';
}
