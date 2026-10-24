'use client';
import React, { useState } from 'react';
import {
   buildWpmChart,
   chartStep,
   chartTooltip,
   formatChartSpeed,
   nearestChartPoint,
   type ChartPoint,
   type ChartTooltip,
   type TooltipAlign,
} from '@/lib/stats/chart';
import type { SecondSample } from '@/lib/stats/types';
import { cn } from '@/lib/utils';

function tooltipPosition(align: TooltipAlign): string {
   switch (align) {
      case 'start':
         return 'translate-x-2';
      case 'end':
         return '-translate-x-[calc(100%+0.5rem)]';
      default: {
         const unreachable: never = align;
         return unreachable;
      }
   }
}

function secondAtPointer(
   event: React.PointerEvent<HTMLElement>,
   points: readonly ChartPoint[]
): number | null {
   const rect = event.currentTarget.getBoundingClientRect();
   if (rect.width <= 0) return null;
   const percent = ((event.clientX - rect.left) / rect.width) * 100;
   return nearestChartPoint(points, percent)?.second ?? null;
}

function ChartHover({ tooltip }: { tooltip: ChartTooltip }) {
   return (
      <>
         <span
            data-testid="wpm-chart-guide"
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-input"
            style={{ left: `${tooltip.x}%` }}
         />
         <span
            role="tooltip"
            className={cn(
               'pointer-events-none absolute top-2 z-20 whitespace-nowrap rounded-md border border-input/40 bg-background px-2.5 py-1.5 text-left text-xs leading-4 text-input shadow-sm',
               tooltipPosition(tooltip.align)
            )}
            style={{ left: `${tooltip.x}%` }}
         >
            <span className="block font-medium tabular-nums">
               Second {tooltip.second}
            </span>
            <span className="block tabular-nums text-accent">
               {tooltip.wpm} wpm
            </span>
            <span className="block tabular-nums">{tooltip.rawWpm} raw</span>
            <span
               className={cn(
                  'block tabular-nums',
                  tooltip.errors > 0 && 'text-wrong_char'
               )}
            >
               {tooltip.errorText}
            </span>
         </span>
      </>
   );
}

export function ResultsChart({
   samples,
   durationSeconds,
}: {
   samples: readonly SecondSample[];
   durationSeconds?: number;
}) {
   const chart = buildWpmChart(samples, durationSeconds);
   const [hoverSecond, setHoverSecond] = useState<number | null>(null);
   const [focusSecond, setFocusSecond] = useState<number | null>(null);
   const [keyboardActive, setKeyboardActive] = useState(false);
   const activeSecond = hoverSecond ?? focusSecond;
   const activePoint =
      activeSecond == null
         ? null
         : chart.points.find((point) => point.second === activeSecond) ?? null;
   const tooltip = activePoint ? chartTooltip(activePoint) : null;

   function selectHover(second: number | null) {
      setKeyboardActive(false);
      setHoverSecond((current) => (current === second ? current : second));
   }

   function selectFocus(second: number | null) {
      setHoverSecond(null);
      setFocusSecond(second);
   }

   return (
      <figure className="w-full min-w-0 space-y-3">
         <figcaption>
            <ul
               aria-label="Chart series"
               className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-input"
            >
               <li className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-accent" aria-hidden="true" />
                  wpm
               </li>
               <li className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-6 bg-input/60" aria-hidden="true" />
                  raw
               </li>
               <li className="inline-flex items-center gap-2">
                  <span
                     className="h-2.5 w-2.5 rounded-full bg-wrong_char"
                     aria-hidden="true"
                  />
                  errors
               </li>
            </ul>
         </figcaption>
         {chart.points.length === 0 ? (
            <p className="text-sm text-input/70">{chart.summary}</p>
         ) : (
            <div>
               <div className="flex h-44 gap-2 sm:h-60">
                  <div
                     aria-hidden="true"
                     className="flex h-full w-9 shrink-0 flex-col justify-between text-right text-xs tabular-nums text-input/80 sm:w-10 sm:text-sm"
                  >
                     {chart.yTicks.map((tick) => (
                        <span key={tick.value}>{tick.value}</span>
                     ))}
                  </div>
                  <div className="relative min-w-0 flex-1">
                     <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        role="img"
                        aria-labelledby="wpm-chart-title"
                        className="absolute inset-0 h-full w-full"
                     >
                        <title id="wpm-chart-title">{chart.summary}</title>
                        {chart.yTicks.map((tick) => (
                           <line
                              key={tick.value}
                              x1="0"
                              x2="100"
                              y1={tick.y}
                              y2={tick.y}
                              className="stroke-input/20"
                              strokeWidth="1"
                              vectorEffect="non-scaling-stroke"
                           />
                        ))}
                        <polyline
                           points={chart.rawLine}
                           fill="none"
                           className="stroke-input/70"
                           strokeWidth="2"
                           vectorEffect="non-scaling-stroke"
                        />
                        <polyline
                           points={chart.wpmLine}
                           fill="none"
                           className="stroke-accent"
                           strokeWidth="2.5"
                           vectorEffect="non-scaling-stroke"
                        />
                     </svg>
                     <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                     >
                        {chart.markers.map((marker) => (
                           <span
                              key={marker.second}
                              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wrong_char ring-2 ring-background"
                              style={{
                                 left: `${marker.x}%`,
                                 top: `${marker.yWpm}%`,
                              }}
                           />
                        ))}
                     </div>
                     <button
                        type="button"
                        aria-label="Per-second speed. Use arrow keys to inspect each second."
                        aria-keyshortcuts="ArrowLeft ArrowRight Home End"
                        className="absolute inset-0 z-10 cursor-crosshair appearance-none border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                        onPointerMove={(event) => {
                           const second = secondAtPointer(event, chart.points);
                           if (event.pointerType === 'mouse') {
                              selectHover(second);
                              return;
                           }
                           if (event.buttons === 0) return;
                           setKeyboardActive(false);
                           selectFocus(second);
                        }}
                        onPointerDown={(event) => {
                           if (event.pointerType === 'mouse') return;
                           setKeyboardActive(false);
                           selectFocus(secondAtPointer(event, chart.points));
                           event.currentTarget.focus();
                        }}
                        onPointerLeave={(event) => {
                           if (event.pointerType !== 'mouse') return;
                           selectHover(null);
                        }}
                        onMouseDown={(event) => {
                           event.preventDefault();
                        }}
                        onFocus={(event) => {
                           if (!event.currentTarget.matches(':focus-visible')) {
                              return;
                           }
                           setKeyboardActive(true);
                           setFocusSecond(
                              (current) =>
                                 current ?? chart.points[0]?.second ?? null
                           );
                        }}
                        onBlur={() => {
                           setHoverSecond(null);
                           setFocusSecond(null);
                           setKeyboardActive(false);
                        }}
                        onKeyDown={(event) => {
                           if (event.key === 'Escape') {
                              event.currentTarget.blur();
                              return;
                           }
                           const index = chart.points.findIndex(
                              (point) => point.second === activeSecond
                           );
                           const next = chartStep(
                              chart.points.length,
                              index,
                              event.key
                           );
                           if (next == null) return;
                           const point = chart.points[next];
                           if (!point) return;
                           event.preventDefault();
                           setKeyboardActive(true);
                           selectFocus(point.second);
                        }}
                     >
                        {tooltip ? <ChartHover tooltip={tooltip} /> : null}
                     </button>
                     <p
                        className="pointer-events-none sr-only"
                        aria-live="polite"
                     >
                        {keyboardActive ? tooltip?.summary ?? '' : ''}
                     </p>
                  </div>
               </div>
               <div
                  aria-hidden="true"
                  className="relative ml-11 mt-1 h-5 text-xs tabular-nums text-input/80 sm:ml-12 sm:text-sm"
               >
                  {chart.xLabels.map((label) => (
                     <span
                        key={label.second}
                        className="absolute -translate-x-1/2"
                        style={{ left: `${label.x}%` }}
                     >
                        {label.label}
                     </span>
                  ))}
               </div>
            </div>
         )}
         {chart.points.length > 0 && (
            <div className="sr-only">
               <table className="w-full text-left text-sm tabular-nums text-input">
                  <caption className="pb-2 text-left text-sm text-input/80">
                     Net WPM, raw WPM, and errors for each second
                  </caption>
                  <thead className="sticky top-0 bg-background">
                     <tr>
                        <th scope="col" className="py-1 pr-3 font-medium">
                           Second
                        </th>
                        <th scope="col" className="py-1 pr-3 font-medium">
                           WPM
                        </th>
                        <th scope="col" className="py-1 pr-3 font-medium">
                           Raw WPM
                        </th>
                        <th scope="col" className="py-1 font-medium">
                           Errors
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {chart.points.map((point) => (
                        <tr
                           key={point.second}
                           className="border-t border-input/20"
                        >
                           <th scope="row" className="py-1 pr-3 font-normal">
                              {point.second + 1}
                           </th>
                           <td className="py-1 pr-3">
                              {formatChartSpeed(point.wpm)}
                           </td>
                           <td className="py-1 pr-3">
                              {formatChartSpeed(point.rawWpm)}
                           </td>
                           <td className="py-1">{point.errors}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </figure>
   );
}
