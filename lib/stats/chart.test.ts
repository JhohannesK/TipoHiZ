import { describe, expect, it } from 'vitest';
import { calculateStats } from './calculate';
import { buildWpmChart, xAxisLabels } from './chart';
import type { Keystroke, SecondSample } from './types';

function sample(
   second: number,
   wpm: number,
   rawWpm: number,
   errors: number,
   characters = 0
): SecondSample {
   return {
      second,
      wpm,
      rawWpm,
      accuracy: 100,
      characters,
      errors,
   };
}

describe('buildWpmChart', () => {
   it('should keep calculator speeds and mark only seconds that have errors', () => {
      const samples = [sample(0, 40, 40, 0, 0), sample(1, 20, 80, 3, 0)];
      const chart = buildWpmChart(samples);

      expect(
         chart.points.map((point) => [point.wpm, point.rawWpm, point.errors])
      ).toEqual([
         [40, 40, 0],
         [20, 80, 3],
      ]);
      expect(chart.markers).toEqual([
         expect.objectContaining({ second: 1, errors: 3, wpm: 20 }),
      ]);
      expect(chart.markers[0]?.yWpm).toBe(chart.points[1]?.yWpm);
      expect(chart.points[1]?.yRaw).toBeLessThan(chart.points[1]?.yWpm ?? 0);
      expect(chart.points[0]?.x).toBeLessThan(chart.points[1]?.x ?? 0);
   });

   it('should plot calculator samples without deriving a new speed', () => {
      const log: Keystroke[] = [
         {
            key: 'a',
            expected: 'a',
            kind: 'correct',
            timestampMs: 100,
            wordIndex: 0,
         },
         {
            key: 'x',
            expected: 'b',
            kind: 'incorrect',
            timestampMs: 1_200,
            wordIndex: 0,
         },
      ];
      const stats = calculateStats({
         log,
         words: ['ab'],
         durationMs: 2_000,
      });
      const chart = buildWpmChart(stats.samples);

      expect(
         chart.points.map((point) => [point.wpm, point.rawWpm, point.errors])
      ).toEqual(
         stats.samples.map((item) => [item.wpm, item.rawWpm, item.errors])
      );
      expect(chart.markers.map((point) => point.second)).toEqual(
         stats.samples
            .filter((item) => item.errors > 0)
            .map((item) => item.second)
      );
   });

   it('should order shuffled seconds from left to right', () => {
      const chart = buildWpmChart([
         sample(2, 10, 10, 0),
         sample(0, 30, 30, 1),
         sample(1, 20, 20, 0),
      ]);

      expect(chart.points.map((point) => point.second)).toEqual([0, 1, 2]);
      expect(chart.markers.map((point) => point.second)).toEqual([0]);
   });

   it('should describe an empty series', () => {
      const chart = buildWpmChart([]);

      expect(chart.points).toEqual([]);
      expect(chart.markers).toEqual([]);
      expect(chart.wpmLine).toBe('');
      expect(chart.summary).toMatch(/no per-second/i);
   });

   it('should draw a flat line when the test has a single second', () => {
      const chart = buildWpmChart([sample(0, 50, 60, 1)]);

      expect(chart.points[0]?.x).toBe(50);
      expect(chart.wpmLine).toMatch(/^2\.00,/);
      expect(chart.wpmLine).toMatch(/ 98\.00,/);
      expect(chart.xLabels.map((label) => label.label)).toEqual(['1']);
   });
});

describe('xAxisLabels', () => {
   it.each([
      [0, []],
      [1, [1]],
      [8, [1, 2, 3, 4, 5, 6, 7, 8]],
      [15, [1, 5, 10, 15]],
      [30, [1, 10, 20, 30]],
      [60, [1, 15, 30, 45, 60]],
   ])('should label %i seconds as %j', (count, expected) => {
      expect(xAxisLabels(count)).toEqual(expected);
   });
});
