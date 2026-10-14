import { calculateStats } from './calculate';
import { expandLog } from './types';
import type {
   PerKeyStat,
   ResultSubmission,
   SavedTestResult,
   TestStats,
} from './types';

export interface PersonalBests {
   wpm: number | null;
   rawWpm: number | null;
   accuracy: number | null;
   consistency: number | null;
}

export interface RecentTest {
   id: string;
   createdAt: string;
   mode: string;
   category: string;
   language: string;
   durationSeconds: number;
   wordCount: number;
   wpm: number;
   rawWpm: number;
   accuracy: number;
   consistency: number;
}

export interface DashboardSummary {
   tests: number;
   averageWpm: number;
   averageRawWpm: number;
   averageAccuracy: number;
   averageConsistency: number;
   personalBests: PersonalBests;
   recent: RecentTest[];
   perKey: PerKeyStat[];
}

export function statsFromResult(
   result: Pick<SavedTestResult, 'log' | 'words' | 'durationSeconds'>
): TestStats {
   return calculateStats({
      log: expandLog(result.log),
      words: result.words,
      durationMs: result.durationSeconds * 1000,
   });
}

export function resultFromSubmission(input: ResultSubmission): SavedTestResult {
   return {
      ...input,
      stats: statsFromResult(input),
   };
}

export function mergeResults(
   primary: readonly SavedTestResult[],
   extras: readonly SavedTestResult[]
): SavedTestResult[] {
   const byId = new Map<string, SavedTestResult>();
   for (const result of [...primary, ...extras]) {
      if (!byId.has(result.id)) byId.set(result.id, result);
   }
   return [...byId.values()].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt)
   );
}

function mean(values: readonly number[]): number {
   if (values.length === 0) return 0;
   return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function combinePerKey(groups: readonly PerKeyStat[][]): PerKeyStat[] {
   const tally = new Map<string, Omit<PerKeyStat, 'key' | 'accuracy'>>();
   for (const group of groups) {
      for (const stat of group) {
         const current = tally.get(stat.key) ?? {
            correct: 0,
            incorrect: 0,
            extra: 0,
         };
         current.correct += stat.correct;
         current.incorrect += stat.incorrect;
         current.extra += stat.extra;
         tally.set(stat.key, current);
      }
   }

   return [...tally.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, counts]) => {
         const attempts = counts.correct + counts.incorrect + counts.extra;
         return {
            key,
            ...counts,
            accuracy: attempts === 0 ? 100 : (counts.correct / attempts) * 100,
         };
      });
}

export function summarizeResults(
   results: readonly SavedTestResult[]
): DashboardSummary {
   const scored = results.map((result) => ({
      result,
      stats: statsFromResult(result),
   }));

   const personalBests = scored.reduce<PersonalBests>(
      (best, item) => ({
         wpm:
            best.wpm === null || item.stats.wpm > best.wpm
               ? item.stats.wpm
               : best.wpm,
         rawWpm:
            best.rawWpm === null || item.stats.rawWpm > best.rawWpm
               ? item.stats.rawWpm
               : best.rawWpm,
         accuracy:
            best.accuracy === null || item.stats.accuracy > best.accuracy
               ? item.stats.accuracy
               : best.accuracy,
         consistency:
            best.consistency === null ||
            item.stats.consistency > best.consistency
               ? item.stats.consistency
               : best.consistency,
      }),
      { wpm: null, rawWpm: null, accuracy: null, consistency: null }
   );

   const recent = [...scored]
      .sort((left, right) =>
         right.result.createdAt.localeCompare(left.result.createdAt)
      )
      .map(({ result, stats }) => ({
         id: result.id,
         createdAt: result.createdAt,
         mode: result.mode,
         category: result.category,
         language: result.language,
         durationSeconds: result.durationSeconds,
         wordCount: result.wordCount,
         wpm: stats.wpm,
         rawWpm: stats.rawWpm,
         accuracy: stats.accuracy,
         consistency: stats.consistency,
      }));

   return {
      tests: scored.length,
      averageWpm: mean(scored.map((item) => item.stats.wpm)),
      averageRawWpm: mean(scored.map((item) => item.stats.rawWpm)),
      averageAccuracy: mean(scored.map((item) => item.stats.accuracy)),
      averageConsistency: mean(scored.map((item) => item.stats.consistency)),
      personalBests,
      recent,
      perKey: combinePerKey(scored.map((item) => item.stats.perKey)),
   };
}
