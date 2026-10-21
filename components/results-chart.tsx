import React from 'react';
import { buildWpmChart } from '@/lib/stats/chart';
import type { SecondSample } from '@/lib/stats/types';

function speedText(value: number): string {
   return Number.isFinite(value) ? value.toFixed(0) : '0';
}

export function ResultsChart({
   samples,
}: {
   samples: readonly SecondSample[];
}) {
   const chart = buildWpmChart(samples);

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
                     <div aria-hidden="true" className="absolute inset-0">
                        {chart.markers.map((marker) => (
                           <span
                              key={marker.second}
                              title={`Second ${marker.second + 1}: ${
                                 marker.errors
                              } errors, ${speedText(
                                 marker.wpm
                              )} wpm, ${speedText(marker.rawWpm)} raw`}
                              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wrong_char ring-2 ring-background"
                              style={{
                                 left: `${marker.x}%`,
                                 top: `${marker.yWpm}%`,
                              }}
                           />
                        ))}
                     </div>
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
            <div className="max-h-48 overflow-auto sm:sr-only">
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
                           <td className="py-1 pr-3">{speedText(point.wpm)}</td>
                           <td className="py-1 pr-3">
                              {speedText(point.rawWpm)}
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
