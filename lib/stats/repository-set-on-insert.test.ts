// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { resultFromSubmission } from './aggregate';
import { resultUpsertWrite } from './repository';
import type { ResultSubmission } from './types';

function submission(
   overrides: Partial<ResultSubmission> = {}
): ResultSubmission {
   return {
      id: 'result-dup',
      createdAt: '2026-10-31T00:00:00.000Z',
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

describe('resultUpsertWrite', () => {
   it('should write only on insert and scope the row to the user', () => {
      const input = submission();
      const saved = resultFromSubmission(input);
      const write = resultUpsertWrite('user-1', input, saved);

      expect(write.filter).toEqual({ _id: 'result-dup', userId: 'user-1' });
      expect(write.update).toHaveProperty('$setOnInsert');
      expect(write.update).not.toHaveProperty('$set');
      expect(write.update.$setOnInsert).toMatchObject({
         _id: 'result-dup',
         userId: 'user-1',
         durationSeconds: 15,
         log: input.log,
         wpm: saved.stats.wpm,
      });
   });

   it('should keep the first payload shape when a later submit changes the log', () => {
      const first = submission();
      const tampered = submission({
         durationSeconds: 60,
         log: [
            ['z', 'z', 'correct', 0, 0],
            ['z', 'z', 'correct', 10, 0],
            ['z', 'z', 'correct', 20, 0],
         ],
      });
      const firstWrite = resultUpsertWrite(
         'user-1',
         first,
         resultFromSubmission(first)
      );
      const secondWrite = resultUpsertWrite(
         'user-1',
         tampered,
         resultFromSubmission(tampered)
      );

      expect(firstWrite.filter).toEqual(secondWrite.filter);
      expect(firstWrite.update.$setOnInsert.log).toEqual(first.log);
      expect(secondWrite.update.$setOnInsert.log).toEqual(tampered.log);
      expect(firstWrite.update.$setOnInsert.wpm).not.toBe(
         secondWrite.update.$setOnInsert.wpm
      );
      expect(Object.keys(firstWrite.update)).toEqual(['$setOnInsert']);
      expect(Object.keys(secondWrite.update)).toEqual(['$setOnInsert']);
   });
});
