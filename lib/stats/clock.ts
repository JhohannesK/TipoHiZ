let origin: number | null = null;

function defaultNow(): number {
   if (typeof performance !== 'undefined') return performance.now();
   return Date.now();
}

let now: () => number = defaultNow;

export function resetKeystrokeClock(): void {
   origin = null;
}

export function setKeystrokeClock(clock: () => number): void {
   now = clock;
   origin = null;
}

export function restoreKeystrokeClock(): void {
   now = defaultNow;
   origin = null;
}

export function keystrokeTimestamp(): number {
   const current = now();
   if (origin === null) origin = current;
   const elapsed = current - origin;
   if (!Number.isFinite(elapsed) || elapsed <= 0) return 0;
   return Math.round(elapsed);
}
