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
   // Shuffle passage entries (paragraphs) on a copy, then split into words.
   // Sentence order inside a paragraph stays put, and the source bank is
   // left alone. Shuffling after the split turns punctuation and code
   // passages into a bag of random words.
   const entries = [...wordList];
   entries.sort(() => Math.random() - 0.5);
   const expanded = entries.some((entry) => entry.includes(' '))
      ? entries.flatMap((entry) => entry.split(' '))
      : entries;
   if (count === undefined) return expanded;

   const total = Math.floor(count);
   if (!Number.isFinite(total) || total <= 0 || expanded.length === 0) {
      return [];
   }

   const passage: string[] = [];
   while (passage.length < total) {
      passage.push(...expanded);
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
   // A wrong or extra letter must not end the test. The typist fixes it
   // or presses Space, which takes the nextIndex >= total branch above.
   return input.activeWord.length > 0 && input.userInput === input.activeWord;
}
