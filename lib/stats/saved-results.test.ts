import { describe, expect, it } from 'vitest';
import {
   accountResultsFromResponse,
   visibleSavedResults,
} from './saved-results';
import type { SavedTestResult } from './types';

function result(id: string, createdAt: string): SavedTestResult {
   return {
      id,
      createdAt,
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words: ['hi'],
      log: [],
      stats: {
         wpm: 40,
         rawWpm: 44,
         accuracy: 100,
         consistency: 80,
         typedEntries: 2,
         errors: 0,
         correct: 2,
         incorrect: 0,
         extra: 0,
         missed: 0,
         samples: [],
         perKey: [],
      },
   };
}

const ACCOUNT = result('acct-1', '2026-11-01T10:00:00.000Z');
const GUEST = result('guest-1', '2026-11-01T10:01:00.000Z');
const LAST = result('last-1', '2026-11-01T10:02:00.000Z');

describe('accountResultsFromResponse', () => {
   it('should drop server history when the fetch is not ok', () => {
      expect(accountResultsFromResponse(false, [ACCOUNT])).toEqual([]);
   });

   it('should treat a missing results array as an empty account', () => {
      expect(accountResultsFromResponse(true)).toEqual([]);
      expect(accountResultsFromResponse(true, null)).toEqual([]);
   });

   it('should keep the payload when the fetch succeeds', () => {
      expect(accountResultsFromResponse(true, [ACCOUNT])).toEqual([ACCOUNT]);
   });
});

describe('visibleSavedResults', () => {
   it('should keep local guest rows after a signed-in fetch failure', () => {
      const visible = visibleSavedResults({
         signedIn: true,
         account: accountResultsFromResponse(false),
         history: [GUEST],
         last: LAST,
      });

      expect(visible.map((row) => row.id)).toEqual(['last-1', 'guest-1']);
      expect(visible.some((row) => row.id === 'acct-1')).toBe(false);
   });

   it('should treat a loading null account like an empty server list', () => {
      const visible = visibleSavedResults({
         signedIn: true,
         account: null,
         history: [GUEST],
         last: null,
      });

      expect(visible.map((row) => row.id)).toEqual(['guest-1']);
   });

   it('should ignore leftover account rows when signed out', () => {
      const visible = visibleSavedResults({
         signedIn: false,
         account: [ACCOUNT],
         history: [GUEST],
         last: LAST,
      });

      expect(visible.map((row) => row.id)).toEqual(['last-1', 'guest-1']);
   });

   it('should let a primary account row win over a same-id local copy', () => {
      const localCopy = { ...ACCOUNT, createdAt: '2026-11-01T09:00:00.000Z' };
      const visible = visibleSavedResults({
         signedIn: true,
         account: [ACCOUNT],
         history: [localCopy],
         last: null,
      });

      expect(visible).toHaveLength(1);
      expect(visible[0]?.createdAt).toBe(ACCOUNT.createdAt);
   });
});
