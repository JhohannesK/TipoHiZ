import { statsFromResult } from '@/lib/stats/aggregate';
import { describeKeystrokeLog, testDuration } from '@/lib/stats/record';
import { compactLog } from '@/lib/stats/types';
import type {
   CompactKeystroke,
   Keystroke,
   SavedTestResult,
   TestStats,
} from '@/lib/stats/types';

export interface ResultConfig {
   time: number;
   category: string;
   type: string;
   language: string;
}

export interface DisplayedResult {
   stats: TestStats;
   durationSeconds: number;
   category: string;
   mode: string;
   language: string;
   wordCount: number;
}

export function sameKeystrokeLog(
   live: readonly Keystroke[],
   saved: readonly CompactKeystroke[]
): boolean {
   if (live.length !== saved.length) return false;
   const compact = compactLog(live);
   return compact.every((entry, index) => {
      const other = saved[index];
      if (!other) return false;
      return (
         entry[0] === other[0] &&
         entry[1] === other[1] &&
         entry[2] === other[2] &&
         entry[3] === other[3] &&
         entry[4] === other[4]
      );
   });
}

export function displayedResult(input: {
   liveLog: readonly Keystroke[];
   liveWords: readonly string[];
   config: ResultConfig;
   saved: SavedTestResult | null;
}): DisplayedResult {
   const saved = input.saved;
   const savedMatches =
      saved !== null &&
      (input.liveLog.length === 0 ||
         sameKeystrokeLog(input.liveLog, saved.log));

   if (savedMatches && saved) {
      return {
         stats: statsFromResult(saved),
         durationSeconds: saved.durationSeconds,
         category: saved.category,
         mode: saved.mode,
         language: saved.language,
         wordCount: saved.wordCount,
      };
   }

   const durationSeconds =
      input.liveLog.length === 0
         ? input.config.time
         : testDuration(
              input.liveLog,
              input.config.category,
              input.config.time
           ).durationSeconds;
   const described = describeKeystrokeLog(
      input.liveLog,
      input.liveWords,
      durationSeconds
   );
   return {
      stats: described.stats,
      durationSeconds,
      category: input.config.category,
      mode: input.config.type,
      language: input.config.language,
      wordCount: described.wordCount,
   };
}

export function formatTestMode(
   result: Pick<
      DisplayedResult,
      'category' | 'mode' | 'language' | 'durationSeconds' | 'wordCount'
   >
): string {
   const length =
      result.category === 'words'
         ? `${result.wordCount} words`
         : `${result.durationSeconds}s`;
   return `${result.category} ${length} ${result.language} ${result.mode}`;
}
