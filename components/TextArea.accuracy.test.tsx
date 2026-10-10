import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { accurateWPM, grossWPM } from '../lib/utils';
import { userConfigStore, wordStore } from '../store';
import { garble, mismatches, scoreTypedRun } from '../test/scoring';
import { initialWordState, resetStores } from '../test/utils';
import TextArea from './TextArea';

vi.mock('../store/actions/WordActions', async () => {
   const actual = await vi.importActual<
      typeof import('../store/actions/WordActions')
   >('../store/actions/WordActions');

   return {
      ...actual,
      setWordList: () => undefined,
   };
});

function mountPassage(words: string[]): void {
   wordStore.setState({
      ...initialWordState,
      wordList: words,
      activeWord: words[0] ?? '',
   });
   userConfigStore.setState({
      language: 'english',
      type: 'default',
      time: 15,
   });
   render(<TextArea sound={false} run={vi.fn()} />);
}

function press(key: string): void {
   const field = document.querySelector('textarea');
   if (!field) {
      throw new Error('typing field missing');
   }

   fireEvent.keyDown(field, {
      key,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
   });
}

function typeSequence(value: string): void {
   for (const key of value) {
      press(key);
   }
}

describe('typing accuracy', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should report no errors when the active word is typed in full', () => {
      mountPassage(['abcde']);

      typeSequence('abcde');

      const state = wordStore.getState();
      expect(state.userInput).toBe('abcde');
      expect(state.typedEntries).toBe(5);
      expect(state.errorCount).toBe(0);
   });

   // P0: calculateErrors adds every not-yet-typed letter on the active word
   // to errorCount. Those letters are not mistakes.
   it.fails('should ignore letters the user has not typed yet', () => {
      mountPassage(['abcde', 'fghij']);

      typeSequence('ab');

      expect(wordStore.getState().userInput).toBe('ab');
      expect(wordStore.getState().errorCount).toBe(0);
   });

   // P0: errorCount is replaced on every keystroke with only the active word,
   // so a finished mistype disappears once the next word is typed.
   it.fails(
      'should keep a mistyped word after the user moves to the next word',
      () => {
         mountPassage(['abcde', 'fghij']);

         typeSequence('abxde ');
         typeSequence('fghij');

         expect(wordStore.getState().typedHistory).toEqual(['abxde']);
         expect(wordStore.getState().userInput).toBe('fghij');
         expect(wordStore.getState().errorCount).toBe(
            mismatches('abcde', 'abxde', true)
         );
      }
   );

   // P0: a run that mistypes every 4th word currently scores about 233 WPM.
   // Finished mistakes are dropped, so the results page bills the run as clean.
   // 49 words of 5 letters plus the spaces between them is 293 entries over the
   // 15s limit: gross speed is 234.4 WPM, and the live error count stays 0.
   it.fails(
      'should lower wpm for a run that mistypes every fourth word',
      () => {
         const words = Array.from({ length: 49 }, () => 'abcde');
         const completed: string[] = [];
         let current = '';

         mountPassage(words);

         words.forEach((word, index) => {
            const mistype = (index + 1) % 4 === 0;
            const typed = mistype ? garble(word) : word;
            const isLast = index === words.length - 1;

            typeSequence(typed);
            if (isLast) {
               current = typed;
               return;
            }

            press(' ');
            completed.push(typed);
         });

         const expected = scoreTypedRun({ words, completed, current });
         const state = wordStore.getState();
         const reportedWpm = accurateWPM(
            state.errorCount,
            state.typedEntries,
            15
         );
         const expectedWpm = accurateWPM(
            expected.errors,
            expected.typedEntries,
            15
         );

         expect(state.typedEntries).toBe(expected.typedEntries);
         expect(expected.errors).toBeGreaterThan(0);
         expect(state.errorCount).toBe(expected.errors);
         expect(reportedWpm).toBeCloseTo(expectedWpm, 5);
         expect(reportedWpm).toBeLessThan(grossWPM(expected.typedEntries, 15));
      }
   );
});
