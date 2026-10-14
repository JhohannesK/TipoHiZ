import { MongoClient, type Collection, type Document } from 'mongodb';
import { resultFromSubmission } from './aggregate';
import type {
   CompactKeystroke,
   PerKeyStat,
   ResultSubmission,
   SavedTestResult,
   SecondSample,
} from './types';

const COLLECTION = 'testResult';

interface TestResultDocument extends Document {
   _id: string;
   userId: string;
   createdAt: Date;
   mode: string;
   category: string;
   language: string;
   durationSeconds: number;
   wordCount: number;
   words: string[];
   log: CompactKeystroke[];
   wpm: number;
   rawWpm: number;
   accuracy: number;
   consistency: number;
   perKey: PerKeyStat[];
   samples: SecondSample[];
}

const globalForMongo = globalThis as { tipohizResultMongo?: MongoClient };

let indexReady = false;

function database() {
   const uri = process.env.MONGODB_URI;
   if (!uri) throw new Error('MONGODB_URI is not set');
   if (!globalForMongo.tipohizResultMongo) {
      globalForMongo.tipohizResultMongo = new MongoClient(uri);
   }
   return globalForMongo.tipohizResultMongo.db();
}

function results(): Collection<TestResultDocument> {
   return database().collection<TestResultDocument>(COLLECTION);
}

async function ensureResultIndex(
   collection: Collection<TestResultDocument>
): Promise<void> {
   if (indexReady) return;
   indexReady = true;
   try {
      await collection.createIndex({ userId: 1, createdAt: -1 });
   } catch (error: unknown) {
      indexReady = false;
      console.error('Failed to ensure the testResult index', error);
   }
}

function duplicateKey(error: unknown): boolean {
   return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
   );
}

function createdAtFrom(value: string): Date {
   const parsed = new Date(value);
   if (Number.isNaN(parsed.getTime())) return new Date();
   return parsed;
}

export function savedResultFromDocument(
   doc: TestResultDocument
): SavedTestResult {
   return resultFromSubmission({
      id: doc._id,
      createdAt: doc.createdAt.toISOString(),
      mode: doc.mode,
      category: doc.category,
      language: doc.language,
      durationSeconds: doc.durationSeconds,
      wordCount: doc.wordCount,
      words: doc.words,
      log: doc.log,
   });
}

function documentFor(
   userId: string,
   input: ResultSubmission,
   saved: SavedTestResult
): TestResultDocument {
   return {
      _id: input.id,
      userId,
      createdAt: createdAtFrom(input.createdAt),
      mode: input.mode,
      category: input.category,
      language: input.language,
      durationSeconds: input.durationSeconds,
      wordCount: input.wordCount,
      words: input.words,
      log: input.log,
      wpm: saved.stats.wpm,
      rawWpm: saved.stats.rawWpm,
      accuracy: saved.stats.accuracy,
      consistency: saved.stats.consistency,
      perKey: saved.stats.perKey,
      samples: saved.stats.samples,
   };
}

export async function saveResultForUser(
   userId: string,
   input: ResultSubmission
): Promise<SavedTestResult> {
   const saved = resultFromSubmission(input);
   const collection = results();
   await ensureResultIndex(collection);
   try {
      await collection.updateOne(
         { _id: input.id, userId },
         { $setOnInsert: documentFor(userId, input, saved) },
         { upsert: true }
      );
   } catch (error: unknown) {
      if (!duplicateKey(error)) throw error;
   }
   return saved;
}

export async function saveResultsForUser(
   userId: string,
   inputs: readonly ResultSubmission[]
): Promise<number> {
   let saved = 0;
   for (const input of inputs) {
      await saveResultForUser(userId, input);
      saved += 1;
   }
   return saved;
}

export async function listResultsForUser(
   userId: string
): Promise<SavedTestResult[]> {
   const collection = results();
   await ensureResultIndex(collection);
   const docs = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
   return docs.map(savedResultFromDocument);
}
