import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userConfigStore, wordStore } from '../store';
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

function mountPassage(words: string[]): HTMLTextAreaElement {
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

   const field = document.querySelector('textarea');
   if (!field) {
      throw new Error('typing field missing');
   }
   return field;
}

describe('mobile and IME typing', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should type from the input fallback when beforeinput is missing', () => {
      const field = mountPassage(['abcde']);

      field.value = 'abcde';
      fireEvent.input(field);

      expect(wordStore.getState().userInput).toBe('abcde');
      expect(wordStore.getState().typedEntries).toBe(5);
      expect(field.value).toBe('');
   });

   it('should not double-count input after a real keydown', () => {
      const field = mountPassage(['abcde']);

      fireEvent.keyDown(field, {
         key: 'a',
         ctrlKey: false,
         altKey: false,
         metaKey: false,
      });
      field.value = 'a';
      fireEvent.input(field);

      expect(wordStore.getState().userInput).toBe('a');
      expect(wordStore.getState().typedEntries).toBe(1);
      expect(field.value).toBe('');
   });

   it('should ignore composing keydowns so IME does not insert twice', () => {
      const field = mountPassage(['abcde']);

      fireEvent.keyDown(field, {
         key: 'a',
         isComposing: true,
         ctrlKey: false,
         altKey: false,
         metaKey: false,
      });

      expect(wordStore.getState().userInput).toBe('');
      expect(wordStore.getState().typedEntries).toBe(0);
   });
});
