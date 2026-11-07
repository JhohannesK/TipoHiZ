import { describe, expect, it } from 'vitest';
import {
   compactLog,
   expandLog,
   submissionOf,
   type Keystroke,
   type SavedTestResult,
} from './types';

const LOG: Keystroke[] = [
   {
      key: 'h',
      expected: 'h',
      kind: 'correct',
      timestampMs: 12,
      wordIndex: 0,
   },
   {
      key: 'x',
      expected: null,
      kind: 'extra',
      timestampMs: 40,
      wordIndex: 0,
   },
   {
      key: 'Backspace',
      expected: null,
      kind: 'backspace',
      timestampMs: 55,
      wordIndex: 0,
   },
];

const RESULT: SavedTestResult = {
   id: 'r1',
   createdAt: '2026-10-28T10:00:00.000Z',
   mode: 'time',
   category: 'time',
   language: 'english',
   durationSeconds: 15,
   wordCount: 2,
   words: ['hi', 'there'],
   log: compactLog(LOG),
   stats: {
      wpm: 40,
      rawWpm: 44,
      accuracy: 90,
      consistency: 80,
      typedEntries: 10,
      errors: 1,
      correct: 9,
      incorrect: 1,
      extra: 1,
      missed: 0,
      samples: [],
      perKey: [],
   },
};

describe('compactLog / expandLog', () => {
   it('should round-trip extra and backspace rows including null expected', () => {
      expect(expandLog(compactLog(LOG))).toEqual(LOG);
      expect(compactLog(LOG)[1]).toEqual(['x', null, 'extra', 40, 0]);
   });

   it('should round-trip an empty log', () => {
      expect(expandLog(compactLog([]))).toEqual([]);
   });
});

describe('submissionOf', () => {
   it('should drop stats so guest migrate cannot send derived scores', () => {
      const submission = submissionOf(RESULT);
      expect(submission).toEqual({
         id: 'r1',
         createdAt: '2026-10-28T10:00:00.000Z',
         mode: 'time',
         category: 'time',
         language: 'english',
         durationSeconds: 15,
         wordCount: 2,
         words: ['hi', 'there'],
         log: RESULT.log,
      });
      expect(submission).not.toHaveProperty('stats');
   });
});
