import React from 'react';
import { cn } from '@/lib/utils';

export function StatCard({
   className,
   label,
   value,
}: {
   label: string;
   value: string;
   className?: string;
}) {
   return (
      <article
         className={cn(
            'rounded-lg border border-input/30 px-4 sm:px-10 py-2 text-center',
            className,
         )}
      >
         <h3 className="text-input/50 text-sm capitalize">{label}:</h3>
         <p className="text-lg sm:text-xl font-medium">{value}</p>
      </article>
   );
}
