import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
   formatElapsed,
   generatePassage,
   resolveWordCount,
   wordsTestFinished,
} from './words';

const textFilesDir = path.resolve('modules/TextFiles');

function readWordBank(fileName: string): string[] {
   const raw = readFileSync(path.join(textFilesDir, fileName), 'utf8');
   return JSON.parse(raw) as string[];
}

function phraseTokens(entry: string): string[] {
   return entry.split(' ').filter((token) => token.length > 0);
}

function containsPhrase(words: readonly string[], entry: string): boolean {
   const tokens = phraseTokens(entry);
   if (tokens.length < 2) return true;

   const compact = words.filter((word) => word.length > 0);
   for (let index = 0; index <= compact.length - tokens.length; index += 1) {
      let matches = true;
      for (let offset = 0; offset < tokens.length; offset += 1) {
         if (compact[index + offset] !== tokens[offset]) {
            matches = false;
            break;
         }
      }
      if (matches) return true;
   }

   return false;
}

describe('words mode passage', () => {
   it('should keep the offered counts and fall back otherwise', () => {
      expect(resolveWordCount(10)).toBe(10);
      expect(resolveWordCount(25)).toBe(25);
      expect(resolveWordCount(50)).toBe(50);
      expect(resolveWordCount(100)).toBe(100);
      expect(resolveWordCount(7)).toBe(10);
   });

   it('should format elapsed seconds as minutes and seconds', () => {
      expect(formatElapsed(0)).toBe('0:00');
      expect(formatElapsed(12)).toBe('0:12');
      expect(formatElapsed(75)).toBe('1:15');
   });

   it('should return a shuffled bank when no count is requested', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      expect(generatePassage(['alpha', 'beta', 'gamma'])).toEqual([
         'alpha',
         'beta',
         'gamma',
      ]);
   });

   it('should return exactly the requested number of words', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const bank = Array.from({ length: 12 }, (_, index) => `w${index}`);

      expect(generatePassage(bank, 10)).toEqual(bank.slice(0, 10));
   });

   it('should repeat a short bank until the count is filled', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      expect(generatePassage(['alpha', 'beta'], 5)).toEqual([
         'alpha',
         'beta',
         'alpha',
         'beta',
         'alpha',
      ]);
   });

   it('should keep sentence order when paragraphs are reordered', () => {
      // A negative comparator reverses the entries. Math.random = 0.5
      // makes the comparator return 0, which hides a word-level shuffle.
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const bank = ['alpha beta gamma', 'one two', 'red blue green'];

      expect(generatePassage(bank)).toEqual([
         'red',
         'blue',
         'green',
         'one',
         'two',
         'alpha',
         'beta',
         'gamma',
      ]);
      expect(generatePassage(bank, 4)).toEqual(['red', 'blue', 'green', 'one']);
      expect(bank).toEqual(['alpha beta gamma', 'one two', 'red blue green']);
   });

   it('should keep multi-word entries intact in every language file', () => {
      const files = readdirSync(textFilesDir).filter((name) =>
         name.endsWith('.json')
      );
      const french = readWordBank('french.json');
      expect(french).toEqual(
         expect.arrayContaining([
            "s'il vous plaît",
            'au revoir',
            'se réveiller',
         ])
      );

      const random = vi.spyOn(Math, 'random').mockReturnValue(0);

      let phraseCount = 0;
      for (const file of files) {
         const entries = readWordBank(file);
         const phrases = entries.filter((entry) => entry.includes(' '));
         phraseCount += phrases.length;
         const snapshot = [...entries];
         const words = generatePassage(entries);

         expect(entries, file).toEqual(snapshot);
         for (const phrase of phrases) {
            expect(containsPhrase(words, phrase), `${file}: ${phrase}`).toBe(
               true
            );
         }
      }

      expect(phraseCount).toBeGreaterThan(0);

      random.mockRestore();
      const seen = new Set<string>();
      for (let attempt = 0; attempt < 12; attempt += 1) {
         const words = generatePassage(french);
         seen.add(words.slice(0, 3).join('\n'));
         for (const phrase of french.filter((entry) => entry.includes(' '))) {
            expect(containsPhrase(words, phrase)).toBe(true);
         }
      }
      expect(seen.size).toBeGreaterThan(1);
   });

   it('should leave the source bank untouched', () => {
      const bank = ['alpha', 'beta', 'gamma'];

      generatePassage(bank, 2);

      expect(bank).toEqual(['alpha', 'beta', 'gamma']);
   });

   it('should return an empty passage for an empty bank or invalid count', () => {
      expect(generatePassage([], 10)).toEqual([]);
      expect(generatePassage(['alpha'], 0)).toEqual([]);
      expect(generatePassage(['alpha'], -4)).toEqual([]);
      expect(generatePassage(['alpha'], Number.NaN)).toEqual([]);
   });
});

describe('wordsTestFinished', () => {
   const base = {
      category: 'words',
      wordCount: 10,
      wordListLength: 2,
      nextIndex: 0,
      activeWord: 'cat',
      userInput: '',
   };

   it('should stay open for a timed test', () => {
      expect(
         wordsTestFinished({
            ...base,
            category: 'time',
            nextIndex: 1,
            userInput: 'dog',
            activeWord: 'dog',
         })
      ).toBe(false);
   });

   it('should stay open until the last word is filled', () => {
      expect(wordsTestFinished({ ...base, userInput: 'cat' })).toBe(false);
      expect(
         wordsTestFinished({
            ...base,
            nextIndex: 1,
            activeWord: 'dog',
            userInput: 'do',
         })
      ).toBe(false);
      expect(
         wordsTestFinished({
            ...base,
            nextIndex: 1,
            activeWord: 'dog',
            userInput: 'dog',
         })
      ).toBe(true);
   });

   it('should finish when the last word matches exactly', () => {
      expect(
         wordsTestFinished({
            ...base,
            wordListLength: 1,
            nextIndex: 0,
            activeWord: 'cat',
            userInput: 'cat',
         })
      ).toBe(true);
   });

   it('should stay open when the last word has a wrong letter', () => {
      expect(
         wordsTestFinished({
            ...base,
            wordListLength: 1,
            nextIndex: 0,
            activeWord: 'cat',
            userInput: 'cax',
         })
      ).toBe(false);
      expect(
         wordsTestFinished({
            ...base,
            wordListLength: 1,
            nextIndex: 0,
            activeWord: 'cat',
            userInput: 'catx',
         })
      ).toBe(false);
   });

   it('should finish once the caret moves past the last word', () => {
      expect(
         wordsTestFinished({
            ...base,
            nextIndex: 2,
            activeWord: '',
            userInput: '',
         })
      ).toBe(true);
   });

   it('should finish against the generated list when it is shorter than the picker count', () => {
      const shortList = {
         ...base,
         wordCount: 100,
         wordListLength: 3,
         nextIndex: 2,
         activeWord: 'end',
         userInput: 'en',
      };

      expect(wordsTestFinished(shortList)).toBe(false);
      expect(wordsTestFinished({ ...shortList, userInput: 'end' })).toBe(true);
      expect(
         wordsTestFinished({
            ...shortList,
            nextIndex: 3,
            activeWord: '',
            userInput: '',
         })
      ).toBe(true);
   });

   it('should stay open when the word list is empty', () => {
      expect(
         wordsTestFinished({
            ...base,
            wordListLength: 0,
            nextIndex: 0,
            activeWord: '',
            userInput: '',
         })
      ).toBe(false);
   });
});
