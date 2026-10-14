import { track } from '@vercel/analytics';

export function trackTestFinished(wordCount: number): void {
   track('test_finished', { wordCount });
}
