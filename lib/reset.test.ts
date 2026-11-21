import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userConfigStore, wordStore } from '../store';
import { resetStates } from '../store/actions/TimeActions';
import { resetStores } from '../test/utils';
import { loadWords, resetTest } from './reset';

describe('resetTest', () => {
   beforeEach(() => {
      resetStores();
   });

   afterEach(() => {
      document.body.replaceChildren();
   });

   it('should finish the reset when the start view is missing', async () => {
      const reset = vi.fn();

      await expect(resetTest('default', reset)).resolves.toBeUndefined();

      expect(reset).toHaveBeenCalledTimes(1);
      expect(wordStore.getState().wordList.length).toBeGreaterThan(0);
   });

   it('should keep a passage after a time-mode restart clears state', async () => {
      userConfigStore.setState({ category: 'time', time: 15, wordCount: 10 });
      wordStore.setState({
         wordList: ['stale'],
         userInput: 's',
         typedHistory: ['old'],
      });
      const reset = vi.fn();

      const pending = resetTest('default', reset);
      resetStates();
      await pending;

      expect(reset).toHaveBeenCalledTimes(1);
      expect(wordStore.getState().wordList.length).toBeGreaterThan(0);
      expect(wordStore.getState().wordList).not.toEqual(['stale']);
      expect(wordStore.getState().userInput).toBe('');
   });

   it.each([10, 25, 50, 100])(
      'should keep %i words after a words-mode restart clears state',
      async (count) => {
         userConfigStore.setState({ category: 'words', wordCount: count });
         wordStore.setState({ wordList: [], userInput: 'gone' });
         const reset = vi.fn();

         const pending = resetTest('default', reset);
         resetStates();
         await pending;

         expect(reset).toHaveBeenCalledTimes(1);
         expect(wordStore.getState().wordList).toHaveLength(count);
         expect(wordStore.getState().userInput).toBe('');
      }
   );

   it('should keep the newer word list when an older reset resolves last', async () => {
      userConfigStore.setState({ category: 'words', wordCount: 10 });
      let releaseFirst: (words: string[]) => void = () => {};
      let releaseSecond: (words: string[]) => void = () => {};
      const firstWords = new Promise<string[]>((resolve) => {
         releaseFirst = resolve;
      });
      const secondWords = new Promise<string[]>((resolve) => {
         releaseSecond = resolve;
      });
      const newer = [
         'second',
         'passage',
         'wins',
         'here',
         'now',
         'with',
         'extra',
         'tokens',
         'present',
         'done',
      ];
      const resetFirst = vi.fn();
      const resetSecond = vi.fn();

      const first = resetTest('default', resetFirst, () => firstWords);
      const second = resetTest('punctuation', resetSecond, () => secondWords);

      releaseSecond(newer);
      await second;

      expect(resetSecond).toHaveBeenCalledTimes(1);
      const winning = wordStore.getState().wordList;
      expect([...winning].sort()).toEqual([...newer].sort());

      releaseFirst([
         'stale',
         'list',
         'should',
         'lose',
         'completely',
         'after',
         'the',
         'newer',
         'call',
         'lands',
      ]);
      await first;

      expect(resetFirst).not.toHaveBeenCalled();
      expect(wordStore.getState().wordList).toEqual(winning);
      expect(wordStore.getState().userInput).toBe('');
   });

   it('should scroll the start view into view when the element exists', async () => {
      const startView = document.createElement('div');
      startView.className = 'startView';
      const scrollIntoView = vi.fn();
      startView.scrollIntoView = scrollIntoView;
      document.body.appendChild(startView);

      await resetTest('default', vi.fn());

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
   });
});

describe('loadWords', () => {
   it('should load the spanish and french default banks', async () => {
      const spanish = await loadWords('spanish', 'default');
      const french = await loadWords('french', 'default');

      expect(spanish[0]).toBe('hola');
      expect(spanish).toContain('perro');
      expect(french[0]).toBe('le');
      expect(french).toContain('une');
      expect(spanish).not.toContain('lorem');
      expect(french).not.toContain('lorem');
   });

   it('should load language-specific punctuation instead of the english bank', async () => {
      const frenchPunctuation = await loadWords('french', 'punctuation');
      const englishPunctuation = await loadWords('english', 'punctuation');

      expect(frenchPunctuation[0]).toMatch(/^Le soleil/);
      expect(englishPunctuation[0]).toMatch(/^lorem ipsum/);
      expect(frenchPunctuation[0]).not.toBe(englishPunctuation[0]);
   });

   it('should share the numbers bank across languages', async () => {
      const englishNumbers = await loadWords('english', 'numbers');
      const spanishNumbers = await loadWords('spanish', 'numbers');

      expect(englishNumbers[0]).toBe('1');
      expect(spanishNumbers).toEqual(englishNumbers);
   });

   it('should fall back to english punctuation when the language file is missing', async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      const englishPunctuation = await loadWords('english', 'punctuation');

      const fallback = await loadWords('klingon', 'punctuation');

      expect(fallback).toEqual(englishPunctuation);
      expect(log).toHaveBeenCalled();
      log.mockRestore();
   });

   it('should fall back to the default english bank when the language is unknown', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const englishDefault = await loadWords('english', 'default');

      const fallback = await loadWords('klingon', 'default');

      expect(fallback).toEqual(englishDefault);
      expect(fallback[0]).toBe('lorem');
      expect(error).toHaveBeenCalled();
      error.mockRestore();
   });

   it('should fall back to the default english bank when the type file is missing', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const englishDefault = await loadWords('english', 'default');

      const fallback = await loadWords('english', 'missing-bank');

      expect(fallback).toEqual(englishDefault);
      expect(error).toHaveBeenCalled();
      error.mockRestore();
   });
});
