import Constants from '../modules/_constants';

export function resolveWordCount(value: number): number {
   return Constants.options.words.includes(value) ? value : Constants.WordCount;
}

export function formatElapsed(seconds: number): string {
   const total = Math.max(0, Math.floor(seconds));
   const minutes = Math.floor(total / 60);
   const rest = total % 60;
   return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

export function generatePassage(
   wordList: readonly string[],
   count?: number
): string[] {
   const expanded = wordList.some((word) => word.includes(' '))
      ? wordList.flatMap((word) => word.split(' '))
      : [...wordList];
   const shuffled = expanded.sort(() => Math.random() - 0.5);
   if (count === undefined) return shuffled;

   const total = Math.floor(count);
   if (!Number.isFinite(total) || total <= 0 || shuffled.length === 0) {
      return [];
   }

   const passage: string[] = [];
   while (passage.length < total) {
      passage.push(...shuffled);
   }
   return passage.slice(0, total);
}

export function wordsTestFinished(input: {
   category: string;
   wordCount: number;
   wordListLength: number;
   nextIndex: number;
   activeWord: string;
   userInput: string;
}): boolean {
   if (input.category !== 'words') return false;
   if (input.wordListLength <= 0) return false;

   const total = Math.min(
      resolveWordCount(input.wordCount),
      input.wordListLength
   );
   if (total <= 0) return false;
   if (input.nextIndex >= total) return true;
   if (input.nextIndex !== total - 1) return false;
   return (
      input.activeWord.length > 0 &&
      input.userInput.length >= input.activeWord.length
   );
}
