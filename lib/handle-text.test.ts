import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HandleText } from './handle-text';
import { wordStore } from '../store';
import { initialWordState, resetStores } from '../test/utils';

function wordRef(): React.RefObject<HTMLDivElement | null> {
   const element = document.createElement('div');
   document.body.appendChild(element);
   return { current: element };
}

describe('HandleText', () => {
   const run = vi.fn();

   beforeEach(() => {
      resetStores();
      wordStore.setState({
         ...initialWordState,
         wordList: ['cat', 'dog'],
         activeWord: 'cat',
      });
   });

   afterEach(() => {
      document.body.replaceChildren();
   });

   it('should append the key, count the entry, and start the timer when a letter is pressed', () => {
      const ref = wordRef();

      HandleText('c', ref, run);

      const state = wordStore.getState();
      expect(state.userInput).toBe('c');
      expect(state.typedEntries).toBe(1);
      expect(state.nextCharIdx).toBe(1);
      expect(state.nextChar).toBe('c');
      expect(run).toHaveBeenCalledTimes(1);
   });

   it('should build the active word across successive letters', () => {
      const ref = wordRef();

      HandleText('c', ref, run);
      HandleText('a', ref, run);
      HandleText('t', ref, run);

      const state = wordStore.getState();
      expect(state.userInput).toBe('cat');
      expect(state.typedEntries).toBe(3);
      expect(state.nextCharIdx).toBe(3);
      expect(run).toHaveBeenCalledTimes(3);
   });

   it('should ignore tab without starting the timer', () => {
      HandleText('Tab', wordRef(), run);

      expect(wordStore.getState().userInput).toBe('');
      expect(wordStore.getState().typedEntries).toBe(0);
      expect(run).not.toHaveBeenCalled();
   });

   it('should ignore space when nothing has been typed', () => {
      HandleText(' ', wordRef(), run);

      expect(wordStore.getState().nextIndex).toBe(0);
      expect(wordStore.getState().typedHistory).toEqual([]);
      expect(run).not.toHaveBeenCalled();
   });

   it('should commit a matching word and advance when space is pressed', () => {
      const ref = wordRef();
      wordStore.setState({ userInput: 'cat', typedEntries: 3, nextCharIdx: 3 });

      HandleText(' ', ref, run);

      const state = wordStore.getState();
      expect(ref.current?.classList.contains('right')).toBe(true);
      expect(state.typedHistory).toEqual(['cat']);
      expect(state.userInput).toBe('');
      expect(state.activeWord).toBe('dog');
      expect(state.nextIndex).toBe(1);
      expect(state.nextCharIdx).toBe(0);
      expect(state.typedEntries).toBe(4);
      expect(run).not.toHaveBeenCalled();
   });

   it('should mark a mismatched word wrong when space is pressed', () => {
      const ref = wordRef();
      wordStore.setState({ userInput: 'cx', typedEntries: 2 });

      HandleText(' ', ref, run);

      expect(ref.current?.classList.contains('wrong')).toBe(true);
      expect(wordStore.getState().typedHistory).toEqual(['cx']);
      expect(wordStore.getState().activeWord).toBe('dog');
   });

   it('should delete the last typed character on backspace', () => {
      wordStore.setState({ userInput: 'ca', typedEntries: 2, nextCharIdx: 2 });

      HandleText('Backspace', wordRef(), run);

      expect(wordStore.getState().userInput).toBe('c');
      expect(wordStore.getState().typedHistory).toEqual([]);
      expect(run).not.toHaveBeenCalled();
   });

   it('should restore the previous word when backspace is pressed on an empty input', () => {
      const ref = wordRef();
      ref.current?.classList.add('wrong');
      wordStore.setState({
         activeWord: 'dog',
         userInput: '',
         typedHistory: ['cx'],
         nextIndex: 1,
         typedEntries: 3,
      });

      HandleText('Backspace', ref, run);

      const state = wordStore.getState();
      expect(state.userInput).toBe('cx');
      expect(state.typedHistory).toEqual([]);
      expect(state.activeWord).toBe('cat');
      expect(state.nextIndex).toBe(0);
      expect(ref.current?.classList.contains('wrong')).toBe(false);
   });

   it('should append the uppercased trailing character when the key starts with Shift', () => {
      HandleText('Shift', wordRef(), run);

      expect(wordStore.getState().userInput).toBe('T');
      expect(run).not.toHaveBeenCalled();
   });

   it('should type when the active word element is missing', () => {
      expect(() => HandleText('z', null, run)).not.toThrow();
      expect(wordStore.getState().userInput).toBe('z');
   });
});
