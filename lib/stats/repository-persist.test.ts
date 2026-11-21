// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
   listResultsForUser,
   resetResultMongoForTests,
   saveResultForUser,
   saveResultsForUser,
} from './repository';
import type { ResultSubmission } from './types';

const mongo = vi.hoisted(() => {
   const updateOne = vi.fn();
   const createIndex = vi.fn();
   const toArray = vi.fn();
   const limit = vi.fn(() => ({ toArray }));
   const sort = vi.fn(() => ({ limit }));
   const find = vi.fn(() => ({ sort }));
   const collection = vi.fn(() => ({
      updateOne,
      createIndex,
      find,
   }));
   return {
      updateOne,
      createIndex,
      toArray,
      limit,
      sort,
      find,
      collection,
   };
});

vi.mock('mongodb', () => ({
   MongoClient: class MongoClient {
      db() {
         return { collection: mongo.collection };
      }
   },
}));

function submission(
   overrides: Partial<ResultSubmission> = {}
): ResultSubmission {
   return {
      id: 'result-persist',
      createdAt: '2026-11-12T00:00:00.000Z',
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words: ['ab'],
      log: [
         ['a', 'a', 'correct', 0, 0],
         ['b', 'b', 'correct', 20, 0],
      ],
      ...overrides,
   };
}

describe('saveResultForUser', () => {
   const previousUri = process.env.MONGODB_URI;

   beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/tipohiz';
      resetResultMongoForTests();
      mongo.updateOne.mockReset().mockResolvedValue({ acknowledged: true });
      mongo.createIndex.mockReset().mockResolvedValue('userId_1_createdAt_-1');
      mongo.toArray.mockReset().mockResolvedValue([]);
      mongo.limit.mockClear();
      mongo.sort.mockClear();
      mongo.find.mockClear();
      mongo.collection.mockClear();
   });

   afterEach(() => {
      if (previousUri === undefined) {
         delete process.env.MONGODB_URI;
      } else {
         process.env.MONGODB_URI = previousUri;
      }
      resetResultMongoForTests();
      vi.clearAllMocks();
   });

   it('should upsert first-write-wins and still return the computed result', async () => {
      const input = submission();
      const saved = await saveResultForUser('user-1', input);

      expect(saved.id).toBe('result-persist');
      expect(saved.stats.typedEntries).toBe(2);
      expect(mongo.updateOne).toHaveBeenCalledTimes(1);
      expect(mongo.updateOne.mock.calls[0]?.[0]).toEqual({
         _id: 'result-persist',
         userId: 'user-1',
      });
      expect(mongo.updateOne.mock.calls[0]?.[1]).toEqual(
         expect.objectContaining({
            $setOnInsert: expect.objectContaining({
               _id: 'result-persist',
               userId: 'user-1',
               log: input.log,
            }),
         })
      );
      expect(mongo.updateOne.mock.calls[0]?.[1]).not.toHaveProperty('$set');
      expect(mongo.updateOne.mock.calls[0]?.[2]).toEqual({ upsert: true });
   });

   it('should swallow a duplicate-key upsert and still return the result', async () => {
      mongo.updateOne.mockRejectedValueOnce({ code: 11000 });

      const saved = await saveResultForUser('user-1', submission());

      expect(saved.id).toBe('result-persist');
      expect(saved.stats.typedEntries).toBe(2);
   });

   it('should not swallow a non-duplicate write error', async () => {
      mongo.updateOne.mockRejectedValueOnce(new Error('write concern'));

      await expect(saveResultForUser('user-1', submission())).rejects.toThrow(
         'write concern'
      );
   });

   it('should fail closed when MONGODB_URI is missing', async () => {
      delete process.env.MONGODB_URI;

      await expect(saveResultForUser('user-1', submission())).rejects.toThrow(
         'MONGODB_URI is not set'
      );
      expect(mongo.updateOne).not.toHaveBeenCalled();
   });

   it('should still persist when index creation fails', async () => {
      const errorLog = vi
         .spyOn(console, 'error')
         .mockImplementation(() => undefined);
      mongo.createIndex.mockRejectedValueOnce(new Error('index down'));

      const saved = await saveResultForUser('user-1', submission());

      expect(saved.id).toBe('result-persist');
      expect(mongo.updateOne).toHaveBeenCalledTimes(1);
      expect(errorLog).toHaveBeenCalled();
      errorLog.mockRestore();
   });
});

describe('saveResultsForUser', () => {
   const previousUri = process.env.MONGODB_URI;

   beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/tipohiz';
      resetResultMongoForTests();
      mongo.updateOne.mockReset().mockResolvedValue({ acknowledged: true });
      mongo.createIndex.mockReset().mockResolvedValue('userId_1_createdAt_-1');
   });

   afterEach(() => {
      if (previousUri === undefined) {
         delete process.env.MONGODB_URI;
      } else {
         process.env.MONGODB_URI = previousUri;
      }
      resetResultMongoForTests();
      vi.clearAllMocks();
   });

   it('should persist each guest row and count a duplicate as saved', async () => {
      mongo.updateOne
         .mockResolvedValueOnce({ acknowledged: true })
         .mockRejectedValueOnce({ code: 11000 });

      const first = submission({ id: 'result-a' });
      const second = submission({ id: 'result-b' });

      await expect(saveResultsForUser('user-1', [first, second])).resolves.toBe(
         2
      );
      expect(mongo.updateOne).toHaveBeenCalledTimes(2);
      expect(mongo.updateOne.mock.calls[0]?.[0]).toEqual({
         _id: 'result-a',
         userId: 'user-1',
      });
      expect(mongo.updateOne.mock.calls[1]?.[0]).toEqual({
         _id: 'result-b',
         userId: 'user-1',
      });
   });

   it('should stop the batch when a non-duplicate write fails', async () => {
      mongo.updateOne
         .mockResolvedValueOnce({ acknowledged: true })
         .mockRejectedValueOnce(new Error('mongo down'));

      await expect(
         saveResultsForUser('user-1', [
            submission({ id: 'result-a' }),
            submission({ id: 'result-b' }),
            submission({ id: 'result-c' }),
         ])
      ).rejects.toThrow('mongo down');
      expect(mongo.updateOne).toHaveBeenCalledTimes(2);
   });
});

describe('listResultsForUser', () => {
   const previousUri = process.env.MONGODB_URI;

   beforeEach(() => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/tipohiz';
      resetResultMongoForTests();
      mongo.createIndex.mockReset().mockResolvedValue('userId_1_createdAt_-1');
      mongo.toArray.mockReset();
      mongo.limit.mockClear().mockReturnValue({ toArray: mongo.toArray });
      mongo.sort.mockClear().mockReturnValue({ limit: mongo.limit });
      mongo.find.mockClear().mockReturnValue({ sort: mongo.sort });
   });

   afterEach(() => {
      if (previousUri === undefined) {
         delete process.env.MONGODB_URI;
      } else {
         process.env.MONGODB_URI = previousUri;
      }
      resetResultMongoForTests();
      vi.clearAllMocks();
   });

   it('should list the caller scoped newest-first with a 500 cap', async () => {
      const input = submission();
      mongo.toArray.mockResolvedValue([
         {
            _id: input.id,
            userId: 'user-1',
            createdAt: new Date(input.createdAt),
            mode: input.mode,
            category: input.category,
            language: input.language,
            durationSeconds: input.durationSeconds,
            wordCount: input.wordCount,
            words: input.words,
            log: input.log,
            wpm: 1,
            rawWpm: 1,
            accuracy: 1,
            consistency: 1,
            perKey: [],
            samples: [],
         },
      ]);

      const results = await listResultsForUser('user-1');

      expect(mongo.find).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(mongo.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mongo.limit).toHaveBeenCalledWith(500);
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('result-persist');
      expect(results[0]?.stats.wpm).not.toBe(1);
      expect(results[0]?.stats.typedEntries).toBe(2);
   });
});
