import { beforeEach, describe, expect, it } from 'vitest';
import { resultFromSubmission } from './aggregate';
import { isCompactKeystroke, isStoredGuestResult } from './guest-result';
import { GUEST_RESULTS_KEY, loadGuestResults } from './storage';
import { compactLog } from './types';
import type { ResultSubmission, SavedTestResult } from './types';

function result(id = 'kept-id-1'): SavedTestResult {
   const input: ResultSubmission = {
      id,
      createdAt: '2026-10-13T00:00:00.000Z',
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words: ['ab'],
      log: compactLog([
         {
            key: 'a',
            expected: 'a',
            kind: 'correct',
            timestampMs: 0,
            wordIndex: 0,
         },
         {
            key: 'b',
            expected: 'b',
            kind: 'correct',
            timestampMs: 80,
            wordIndex: 0,
         },
      ]),
   };
   return resultFromSubmission(input);
}

describe('isCompactKeystroke', () => {
   it('should accept a 5-tuple with a null expected extra', () => {
      expect(isCompactKeystroke(['x', null, 'extra', 40, 0])).toBe(true);
      expect(isCompactKeystroke(['a', 'a', 'correct', 0, 0])).toBe(true);
   });

   it('should reject a short tuple, unknown kind, or non-string key', () => {
      expect(isCompactKeystroke(['a', 'a', 'correct'])).toBe(false);
      expect(isCompactKeystroke(['a', 'a', 'typo', 0, 0])).toBe(false);
      expect(isCompactKeystroke([1, 'a', 'correct', 0, 0])).toBe(false);
      expect(isCompactKeystroke(['a', 1, 'correct', 0, 0])).toBe(false);
   });

   it('should accept NaN and Infinity timestamps because they are typeof number', () => {
      expect(isCompactKeystroke(['a', 'a', 'correct', Number.NaN, 0])).toBe(
         true
      );
      expect(
         isCompactKeystroke(['a', 'a', 'correct', Number.POSITIVE_INFINITY, 0])
      ).toBe(true);
      expect(isCompactKeystroke(['a', 'a', 'correct', '0', 0])).toBe(false);
   });
});

describe('isStoredGuestResult', () => {
   it('should accept a saved result with stats', () => {
      expect(isStoredGuestResult(result())).toBe(true);
   });

   it('should reject a payload that is missing stats or id', () => {
      const saved = result();
      expect(isStoredGuestResult({ ...saved, stats: undefined })).toBe(false);
      expect(isStoredGuestResult({ ...saved, id: 12 })).toBe(false);
      expect(isStoredGuestResult(null)).toBe(false);
      expect(isStoredGuestResult('result-1')).toBe(false);
   });

   it('should reject a string duration even though the server schema also does', () => {
      expect(isStoredGuestResult({ ...result(), durationSeconds: '15' })).toBe(
         false
      );
   });

   it.each([0, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
      'should accept durationSeconds %s because guest storage only checks typeof number',
      (durationSeconds) => {
         expect(isStoredGuestResult({ ...result(), durationSeconds })).toBe(
            true
         );
      }
   );

   it('should accept a non-integer wordCount and a NaN log timestamp', () => {
      const saved = result();
      expect(isStoredGuestResult({ ...saved, wordCount: 1.5 })).toBe(true);
      expect(
         isStoredGuestResult({
            ...saved,
            log: [['a', 'a', 'correct', Number.NaN, 0]],
         })
      ).toBe(true);
   });
});

describe('guest history load of durationSeconds', () => {
   beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
   });

   it('should keep 0 and negative durations that JSON can round-trip', () => {
      const kept = result('zero-duration');
      localStorage.setItem(
         GUEST_RESULTS_KEY,
         JSON.stringify([
            { ...kept, durationSeconds: 0 },
            { ...kept, id: 'negative', durationSeconds: -1.4 },
            { ...kept, id: 'nan', durationSeconds: Number.NaN },
            {
               ...kept,
               id: 'inf',
               durationSeconds: Number.POSITIVE_INFINITY,
            },
            { ...kept, id: 'string-duration', durationSeconds: '15' },
         ])
      );

      expect(loadGuestResults().map((item) => item.id)).toEqual([
         'zero-duration',
         'negative',
      ]);
      expect(loadGuestResults()[0]?.durationSeconds).toBe(0);
      expect(loadGuestResults()[1]?.durationSeconds).toBe(-1.4);
   });
});
