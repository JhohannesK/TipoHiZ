import { beforeEach, describe, expect, it } from 'vitest';
import { resultFromSubmission } from './aggregate';
import {
   GUEST_RESULTS_KEY,
   LAST_RESULT_KEY,
   clearGuestResults,
   loadClientResults,
   loadGuestResults,
   rememberLastResult,
   saveGuestResult,
} from './storage';
import { GUEST_RESULT_LIMIT, compactLog } from './types';
import type { ResultSubmission, SavedTestResult } from './types';

function result(id: string, createdAt: string): SavedTestResult {
   const input: ResultSubmission = {
      id,
      createdAt,
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

describe('guest result storage', () => {
   beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
   });

   it('should keep the newest guest results and cap the history at 50', () => {
      for (let index = 0; index < GUEST_RESULT_LIMIT + 5; index += 1) {
         saveGuestResult(
            result(
               `result-${index.toString().padStart(2, '0')}`,
               `2026-10-13T00:${String(index).padStart(2, '0')}:00.000Z`
            )
         );
      }

      const history = loadGuestResults();
      expect(history).toHaveLength(GUEST_RESULT_LIMIT);
      expect(history[0]?.id).toBe(
         `result-${(GUEST_RESULT_LIMIT + 4).toString().padStart(2, '0')}`
      );
      expect(history.some((item) => item.id === 'result-00')).toBe(false);
      expect(localStorage.getItem(GUEST_RESULTS_KEY)).toBeTruthy();
   });

   it('should replace a guest result when the same id is saved again', () => {
      saveGuestResult(result('same-id-1', '2026-10-13T00:00:00.000Z'));
      saveGuestResult(result('same-id-1', '2026-10-13T00:05:00.000Z'));

      const history = loadGuestResults();
      expect(history).toHaveLength(1);
      expect(history[0]?.createdAt).toBe('2026-10-13T00:05:00.000Z');
   });

   it('should ignore corrupt storage and clear the guest history', () => {
      localStorage.setItem(GUEST_RESULTS_KEY, '{not json');
      expect(loadGuestResults()).toEqual([]);

      saveGuestResult(result('kept-id-1', '2026-10-13T00:00:00.000Z'));
      clearGuestResults();
      expect(loadGuestResults()).toEqual([]);
   });

   it('should remember the last result for the results screen', () => {
      const saved = result('last-id-1', '2026-10-13T00:00:00.000Z');
      rememberLastResult(saved);

      expect(sessionStorage.getItem(LAST_RESULT_KEY)).toBeTruthy();
      expect(loadClientResults().last?.id).toBe('last-id-1');
      expect(loadClientResults()).toBe(loadClientResults());
   });

   it('should keep only valid rows when guest history is mixed', () => {
      const kept = result('kept-id-2', '2026-10-13T00:00:00.000Z');
      localStorage.setItem(
         GUEST_RESULTS_KEY,
         JSON.stringify([
            kept,
            { ...kept, id: 'no-stats', stats: undefined },
            { id: 'x' },
            {
               ...kept,
               id: 'bad-kind',
               log: [['a', 'a', 'typo', 0, 0]],
            },
            {
               ...kept,
               id: 'short-tuple',
               log: [['a', 'a', 'correct']],
            },
         ])
      );

      expect(loadGuestResults().map((item) => item.id)).toEqual(['kept-id-2']);

      saveGuestResult(result('kept-id-3', '2026-10-13T00:01:00.000Z'));
      expect(loadGuestResults().map((item) => item.id)).toEqual([
         'kept-id-3',
         'kept-id-2',
      ]);
   });
});
