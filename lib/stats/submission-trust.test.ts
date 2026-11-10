import { describe, expect, it } from 'vitest';
import {
   resultFromSubmission,
   statsFromResult,
   summarizeResults,
} from './aggregate';
import { compactLog } from './types';
import type { Keystroke, ResultSubmission } from './types';

function typedLog(word: string): Keystroke[] {
   return [...word].map((key, index) => ({
      key,
      expected: key,
      kind: 'correct' as const,
      timestampMs: index * 100,
      wordIndex: 0,
   }));
}

function submit(over: Partial<ResultSubmission> = {}): ResultSubmission {
   return {
      id: 'result-1',
      createdAt: '2026-10-24T10:00:00.000Z',
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words: ['hello'],
      log: compactLog(typedLog('hello')),
      ...over,
   };
}

describe('resultFromSubmission duration trust', () => {
   it('should scale WPM by the client-supplied duration', () => {
      const honest = resultFromSubmission(submit({ durationSeconds: 15 }));
      const short = resultFromSubmission(submit({ durationSeconds: 1 }));

      expect(honest.stats.typedEntries).toBe(5);
      expect(short.stats.typedEntries).toBe(5);
      expect(short.stats.wpm).toBeCloseTo(honest.stats.wpm * 15, 5);
      expect(short.stats.rawWpm).toBeCloseTo(honest.stats.rawWpm * 15, 5);
   });

   it('should report zero WPM when durationSeconds is not positive', () => {
      const saved = resultFromSubmission(submit({ durationSeconds: 0 }));
      expect(saved.stats.wpm).toBe(0);
      expect(saved.stats.rawWpm).toBe(0);
      expect(statsFromResult(saved).wpm).toBe(0);
   });
});

describe('summarizeResults wordCount trust', () => {
   it('should keep the submitted wordCount even when the log is shorter', () => {
      const saved = resultFromSubmission(
         submit({
            wordCount: 50,
            words: ['ab'],
            log: compactLog(typedLog('ab')),
         })
      );
      const summary = summarizeResults([saved]);

      expect(saved.stats.typedEntries).toBe(2);
      expect(summary.recent[0]?.wordCount).toBe(50);
      expect(summary.recent[0]?.durationSeconds).toBe(15);
   });
});
