import type { SecondSample } from './types';

const PLOT_LEFT = 2;
const PLOT_RIGHT = 98;
const PLOT_TOP = 4;
const PLOT_BOTTOM = 96;

export interface ChartPoint {
   second: number;
   wpm: number;
   rawWpm: number;
   errors: number;
   x: number;
   yWpm: number;
   yRaw: number;
}

export interface ChartTick {
   value: number;
   y: number;
}

export interface ChartAxisLabel {
   second: number;
   x: number;
   label: string;
}

export interface WpmChart {
   points: ChartPoint[];
   markers: ChartPoint[];
   wpmLine: string;
   rawLine: string;
   yTicks: ChartTick[];
   xLabels: ChartAxisLabel[];
   summary: string;
}

function finite(value: number): number {
   return Number.isFinite(value) ? value : 0;
}

function axisMax(peak: number): number {
   if (peak <= 0) return 40;
   const padded = peak * 1.15;
   const step =
      padded <= 50 ? 10 : padded <= 120 ? 20 : padded <= 240 ? 40 : 50;
   return Math.ceil(padded / step) * step;
}

export function xAxisLabels(sampleCount: number): number[] {
   if (sampleCount <= 0) return [];
   if (sampleCount === 1) return [1];

   const step =
      sampleCount <= 8
         ? 1
         : sampleCount <= 20
         ? 5
         : sampleCount <= 45
         ? 10
         : sampleCount <= 90
         ? 15
         : 30;
   const labels = new Set<number>([1, sampleCount]);
   for (let second = step; second < sampleCount; second += step) {
      labels.add(second);
   }
   return [...labels].sort((left, right) => left - right);
}

function xOf(index: number, count: number): number {
   if (count <= 1) return 50;
   return PLOT_LEFT + (index / (count - 1)) * (PLOT_RIGHT - PLOT_LEFT);
}

function yOf(value: number, max: number): number {
   const ratio = max <= 0 ? 0 : Math.min(Math.max(finite(value) / max, 0), 1);
   return PLOT_TOP + (1 - ratio) * (PLOT_BOTTOM - PLOT_TOP);
}

function coord(x: number, y: number): string {
   return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function line(points: readonly ChartPoint[], field: 'yWpm' | 'yRaw'): string {
   if (points.length === 0) return '';
   if (points.length === 1) {
      const y = points[0]?.[field] ?? PLOT_BOTTOM;
      return `${coord(PLOT_LEFT, y)} ${coord(PLOT_RIGHT, y)}`;
   }
   return points.map((point) => coord(point.x, point[field])).join(' ');
}

function summaryFor(samples: readonly SecondSample[]): string {
   if (samples.length === 0) {
      return 'No per-second speed data for this test.';
   }
   const withErrors = samples.filter((sample) => sample.errors > 0).length;
   const errorText =
      withErrors === 1
         ? '1 second has errors.'
         : `${withErrors} seconds have errors.`;
   return `Net WPM and raw WPM for each second of the test. ${errorText}`;
}

function formatLastSecond(
   sampleSecond: number,
   durationSeconds?: number
): string {
   if (
      durationSeconds === undefined ||
      !Number.isFinite(durationSeconds) ||
      durationSeconds <= 0
   ) {
      return String(sampleSecond);
   }
   const tenths = Math.round(durationSeconds * 10) / 10;
   if (Number.isInteger(tenths)) return String(tenths);
   return tenths.toFixed(1);
}

export function buildWpmChart(
   samples: readonly SecondSample[],
   durationSeconds?: number
): WpmChart {
   const ordered = [...samples].sort(
      (left, right) => left.second - right.second
   );
   const peak = ordered.reduce(
      (max, sample) => Math.max(max, finite(sample.wpm), finite(sample.rawWpm)),
      0
   );
   const max = axisMax(peak);
   const points = ordered.map((sample, index) => ({
      second: sample.second,
      wpm: sample.wpm,
      rawWpm: sample.rawWpm,
      errors: sample.errors,
      x: xOf(index, ordered.length),
      yWpm: yOf(sample.wpm, max),
      yRaw: yOf(sample.rawWpm, max),
   }));
   const labels = xAxisLabels(ordered.length);

   return {
      points,
      markers: points.filter((point) => point.errors > 0),
      wpmLine: line(points, 'yWpm'),
      rawLine: line(points, 'yRaw'),
      yTicks: [max, Math.round(max / 2), 0].map((value) => ({
         value,
         y: yOf(value, max),
      })),
      xLabels: labels.map((second) => {
         const point = points[second - 1];
         const last = second === ordered.length;
         return {
            second,
            x: point?.x ?? 50,
            label: last
               ? formatLastSecond(second, durationSeconds)
               : String(second),
         };
      }),
      summary: summaryFor(ordered),
   };
}

export type TooltipAlign = 'start' | 'end';

export interface ChartTooltip {
   second: number;
   wpm: string;
   rawWpm: string;
   errors: number;
   errorText: string;
   x: number;
   align: TooltipAlign;
   summary: string;
}

export function formatChartSpeed(value: number): string {
   return finite(value).toFixed(0);
}

function errorText(errors: number): string {
   const count = finite(errors);
   if (count === 1) return '1 error';
   return `${count} errors`;
}

export function tooltipAlign(x: number): TooltipAlign {
   return x > 62 ? 'end' : 'start';
}

export function chartTooltip(point: ChartPoint): ChartTooltip {
   const second = point.second + 1;
   const wpm = formatChartSpeed(point.wpm);
   const rawWpm = formatChartSpeed(point.rawWpm);
   const errors = finite(point.errors);
   const errorsLabel = errorText(errors);

   return {
      second,
      wpm,
      rawWpm,
      errors,
      errorText: errorsLabel,
      x: point.x,
      align: tooltipAlign(point.x),
      summary: `Second ${second}: ${wpm} wpm, ${rawWpm} raw wpm, ${errorsLabel}`,
   };
}

export function nearestChartPoint(
   points: readonly ChartPoint[],
   percentX: number
): ChartPoint | null {
   const first = points[0];
   if (!first || !Number.isFinite(percentX)) return null;

   let best = first;
   let bestDistance = Math.abs(first.x - percentX);
   for (const point of points) {
      const distance = Math.abs(point.x - percentX);
      if (distance < bestDistance) {
         best = point;
         bestDistance = distance;
      }
   }
   return best;
}

export function chartStep(
   count: number,
   index: number,
   key: string
): number | null {
   if (count <= 0) return null;
   if (key === 'Home') return 0;
   if (key === 'End') return count - 1;
   if (key === 'ArrowRight' || key === 'ArrowUp') {
      if (index < 0) return 0;
      return Math.min(count - 1, index + 1);
   }
   if (key === 'ArrowLeft' || key === 'ArrowDown') {
      if (index < 0) return count - 1;
      return Math.max(0, index - 1);
   }
   return null;
}
