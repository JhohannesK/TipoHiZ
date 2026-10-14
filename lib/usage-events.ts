import { track } from '@vercel/analytics';
import { userConfigStore, wordStore } from '../store';
import { accurateWPM, calculateAccuracy } from './utils';

export type RestartHow = 'shortcut' | 'button';

let testActive = false;

function roundMetric(value: number, digits: number): number {
   if (!Number.isFinite(value)) return 0;
   return Number(value.toFixed(digits));
}

export function trackTestStarted(): void {
   if (testActive) return;
   testActive = true;
   track('test_started', { mode: userConfigStore.getState().category });
}

export function trackTestFinished(): void {
   if (!testActive) return;
   testActive = false;

   const { category, time } = userConfigStore.getState();
   const { typedEntries, errorCount, typedHistory, userInput } =
      wordStore.getState();
   const wordCount = typedHistory.length + (userInput.length > 0 ? 1 : 0);

   track('test_finished', {
      mode: category,
      duration: time,
      wordCount,
      wpm: roundMetric(accurateWPM(errorCount, typedEntries, time), 2),
      accuracy: roundMetric(calculateAccuracy(errorCount, typedEntries), 1),
   });
}

export function trackTestRestarted(how: RestartHow): void {
   testActive = false;
   track('test_restarted', { how });
}

export function abandonTest(): void {
   testActive = false;
}
