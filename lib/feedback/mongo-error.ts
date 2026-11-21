export function mongoErrorLabel(error: unknown): {
   name: string;
   code: unknown;
} {
   if (typeof error !== 'object' || error === null) {
      return { name: 'Error', code: undefined };
   }

   const record = error as { name?: unknown; code?: unknown };
   return {
      name: typeof record.name === 'string' ? record.name : 'Error',
      code: record.code,
   };
}
