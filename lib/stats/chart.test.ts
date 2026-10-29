import { describe, expect, it } from 'vitest';
import { calculateStats } from './calculate';
import {
   buildWpmChart,
   chartStep,
   chartTooltip,
   nearestChartPoint,
   tooltipAlign,
   xAxisLabels,
} from './chart';
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

   it('should label a partial last second with the elapsed time', () => {
      const chart = buildWpmChart(
         [sample(0, 40, 40, 0), sample(1, 20, 20, 0)],
         1.44
      );

      expect(chart.points.map((point) => point.wpm)).toEqual([40, 20]);
      expect(chart.xLabels.map((label) => label.label)).toEqual(['1', '1.4']);
   });

   it('should keep a whole-second axis when the run ends on a second', () => {
      const chart = buildWpmChart(
         [sample(0, 40, 40, 0), sample(1, 20, 20, 0)],
         2
      );

      expect(chart.xLabels.map((label) => label.label)).toEqual(['1', '2']);
   });

   it('should round a last second of 1.95 to a whole-second label', () => {
      const chart = buildWpmChart(
         [sample(0, 40, 40, 0), sample(1, 20, 20, 0)],
         1.95
      );

      expect(chart.xLabels.map((label) => label.label)).toEqual(['1', '2']);
      expect(chart.points.map((point) => point.wpm)).toEqual([40, 20]);
   });

   it('should fall back to the sample second when elapsed time is not finite', () => {
      const chart = buildWpmChart(
         [sample(0, 40, 40, 0), sample(1, 20, 20, 0)],
         Number.NaN
      );

      expect(chart.xLabels.map((label) => label.label)).toEqual(['1', '2']);
   });
});

describe('chartTooltip', () => {
   it('should map each plotted second to wpm, raw wpm, and errors', () => {
      const chart = buildWpmChart([
         sample(0, 80.2, 90.8, 0),
         sample(1, 40, 70, 2),
      ]);

      expect(chart.points.map((point) => chartTooltip(point))).toEqual([
         {
            second: 1,
            wpm: '80',
            rawWpm: '91',
            errors: 0,
            errorText: '0 errors',
            x: chart.points[0]?.x,
            align: 'start',
            summary: 'Second 1: 80 wpm, 91 raw wpm, 0 errors',
         },
         {
            second: 2,
            wpm: '40',
            rawWpm: '70',
            errors: 2,
            errorText: '2 errors',
            x: chart.points[1]?.x,
            align: 'end',
            summary: 'Second 2: 40 wpm, 70 raw wpm, 2 errors',
         },
      ]);
      expect(chartTooltip(chart.points[0]!).second).toBe(
         Number(chart.xLabels[0]?.label)
      );
   });

   it('should singularize one error and zero non-finite speeds', () => {
      expect(
         chartTooltip({
            second: 4,
            wpm: Number.NaN,
            rawWpm: Number.POSITIVE_INFINITY,
            errors: 1,
            x: 10,
            yWpm: 0,
            yRaw: 0,
         })
      ).toEqual({
         second: 5,
         wpm: '0',
         rawWpm: '0',
         errors: 1,
         errorText: '1 error',
         x: 10,
         align: 'start',
         summary: 'Second 5: 0 wpm, 0 raw wpm, 1 error',
      });
   });

   it('should treat a non-finite error count as zero', () => {
      expect(
         chartTooltip({
            second: 0,
            wpm: 12.4,
            rawWpm: 12.5,
            errors: Number.NaN,
            x: 80,
            yWpm: 0,
            yRaw: 0,
         })
      ).toMatchObject({
         wpm: '12',
         rawWpm: '13',
         errors: 0,
         errorText: '0 errors',
         align: 'end',
      });
   });
});

describe('nearestChartPoint', () => {
   it('should pick the closest second and keep the earlier one on a tie', () => {
      const chart = buildWpmChart([
         sample(0, 10, 10, 0),
         sample(1, 20, 20, 0),
         sample(2, 30, 30, 1),
      ]);
      const first = chart.points[0];
      const middle = chart.points[1];
      const last = chart.points[2];

      expect(nearestChartPoint(chart.points, 0)?.second).toBe(0);
      expect(nearestChartPoint(chart.points, 100)?.second).toBe(2);
      expect(nearestChartPoint(chart.points, middle?.x ?? 0)?.second).toBe(1);
      const midpoint = ((first?.x ?? 0) + (middle?.x ?? 0)) / 2;
      expect(nearestChartPoint(chart.points, midpoint)?.second).toBe(0);
      expect(
         nearestChartPoint(chart.points, (last?.x ?? 0) + 0.01)?.second
      ).toBe(2);
      expect(nearestChartPoint([], 50)).toBeNull();
      expect(nearestChartPoint(chart.points, Number.NaN)).toBeNull();
   });
});

describe('chartStep', () => {
   it('should move within the series from the keyboard', () => {
      expect(chartStep(3, -1, 'ArrowRight')).toBe(0);
      expect(chartStep(3, 0, 'ArrowRight')).toBe(1);
      expect(chartStep(3, 2, 'ArrowUp')).toBe(2);
      expect(chartStep(3, -1, 'ArrowLeft')).toBe(2);
      expect(chartStep(3, 0, 'ArrowDown')).toBe(0);
      expect(chartStep(3, 1, 'Home')).toBe(0);
      expect(chartStep(3, 1, 'End')).toBe(2);
      expect(chartStep(3, 1, 'Tab')).toBeNull();
      expect(chartStep(0, 0, 'Home')).toBeNull();
   });
});

describe('tooltipAlign', () => {
   it.each([
      [0, 'start'],
      [62, 'start'],
      [62.1, 'end'],
      [100, 'end'],
   ] as const)('should place %s%% on the %s side of the guide', (x, align) => {
      expect(tooltipAlign(x)).toBe(align);
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
