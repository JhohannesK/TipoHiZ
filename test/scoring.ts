export function mismatches(
   target: string,
   typed: string,
   countUntyped: boolean
): number {
   let count = 0;
   const shared = Math.min(target.length, typed.length);

   for (let index = 0; index < shared; index += 1) {
      if (target[index] !== typed[index]) count += 1;
   }

   if (typed.length > target.length) {
      count += typed.length - target.length;
   } else if (countUntyped && typed.length < target.length) {
      count += target.length - typed.length;
   }

   return count;
}

export function scoreTypedRun(input: {
   words: string[];
   completed: string[];
   current: string;
}): { typedEntries: number; errors: number } {
   let typedEntries = 0;
   let errors = 0;

   input.completed.forEach((typed, index) => {
      const target = input.words[index] ?? '';
      typedEntries += typed.length + 1;
      errors += mismatches(target, typed, true);
   });

   const currentTarget = input.words[input.completed.length] ?? '';
   typedEntries += input.current.length;
   errors += mismatches(currentTarget, input.current, false);

   return { typedEntries, errors };
}

export function garble(word: string): string {
   const garbled = word.replace(/./g, (char) =>
      char.toLowerCase() === 'x' ? 'y' : 'x'
   );
   return garbled === word ? `${word}z` : garbled;
}
