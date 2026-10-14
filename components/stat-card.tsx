import React from 'react';
import { cn } from '@/lib/utils';

export function StatCard({
   className,
   label,
   value,
   detail,
   emphasis = false,
}: {
   label: string;
   value: string;
   detail?: string;
   emphasis?: boolean;
   className?: string;
}) {
   return (
      <article
         className={cn(
            'rounded-lg border border-input/30 px-4 py-2 text-center sm:px-8',
            emphasis && 'border-0 bg-transparent px-0 text-left sm:px-0',
            className
         )}
      >
         <p
            className={cn(
               'font-medium tabular-nums',
               emphasis
                  ? 'text-4xl tracking-tight sm:text-5xl lg:text-6xl'
                  : 'text-lg break-words sm:text-xl'
            )}
         >
            {value}
         </p>
         <h3 className="text-sm text-input/70">{label}:</h3>
         {detail ? (
            <span className="mt-1 block text-xs text-input/70">{detail}</span>
         ) : null}
      </article>
   );
}
