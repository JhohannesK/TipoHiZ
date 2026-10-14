import { describe, expect, it, vi } from 'vitest';
import {
   formatElapsed,
   generatePassage,
   resolveWordCount,
   wordsTestFinished,
} from './words';

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

   it('should split phrases before applying the count', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      expect(generatePassage(['hello world', 'next'], 2)).toEqual([
         'hello',
         'world',
      ]);
   });

   it('should leave the source bank untouched', () => {
      const bank = ['alpha', 'beta', 'gamma'];

      generatePassage(bank, 2);

      expect(bank).toEqual(['alpha', 'beta', 'gamma']);
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
});
