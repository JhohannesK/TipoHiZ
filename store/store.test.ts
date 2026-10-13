import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userConfigStore, wordStore } from '.';
import {
   setCategory,
   setLanguage,
   setTheme,
   setType,
   toggleSound,
} from './actions/ConfigActions';
import { resetStates, setDefaultTime } from './actions/TimeActions';
import {
   IncreaseTypedEntries,
   afterPressingSpace,
   setActiveWord,
   setCaretRef,
   setChar,
   setDisabled,
   setErrorCount,
   setNextChar,
   setPrevChar,
   setRef,
   setUserInput,
   setWordList,
} from './actions/WordActions';
import Constants from '../modules/_constants';
import { initialWordState, resetStores } from '../test/utils';

type PersistedUserConfigStore = typeof userConfigStore & {
   persist: {
      rehydrate: () => Promise<void> | void;
   };
};

function persistedConfig(): PersistedUserConfigStore {
   return userConfigStore as PersistedUserConfigStore;
}

describe('word store actions', () => {
   beforeEach(() => {
      resetStores();
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
   });

   it('should activate the first word and clear the previous attempt when a list is set', () => {
      wordStore.setState({
         userInput: 'stale',
         typedHistory: ['old'],
         activeWord: 'old',
      });

      setWordList(['alpha', 'beta', 'gamma']);

      const state = wordStore.getState();
      expect(state.wordList).toEqual(['alpha', 'beta', 'gamma']);
      expect(state.activeWord).toBe('alpha');
      expect(state.userInput).toBe('');
      expect(state.typedHistory).toEqual([]);
      expect(state.keystrokeLog).toEqual([]);
      expect(state.nextIndex).toBe(0);
      expect(state.errorCount).toBe(0);
      expect(state.typedEntries).toBe(0);
   });

   it('should split phrases into words when any entry contains a space', () => {
      setWordList(['hello world', 'next']);

      const state = wordStore.getState();
      expect(state.wordList).toEqual(['hello', 'world', 'next']);
      expect(state.activeWord).toBe('hello');
   });

   it('should append a character and advance the character index', () => {
      wordStore.setState({ userInput: 'ca', nextCharIdx: 2 });

      setChar('t');

      expect(wordStore.getState().userInput).toBe('cat');
      expect(wordStore.getState().nextCharIdx).toBe(3);
   });

   it('should read the next character from the active word', () => {
      wordStore.setState({ activeWord: 'cat', nextCharIdx: 1 });

      setNextChar();

      expect(wordStore.getState().nextChar).toBe('a');
   });

   it('should move back one word when a previous character is requested', () => {
      wordStore.setState({
         wordList: ['cat', 'dog', 'pig'],
         activeWord: 'pig',
         nextIndex: 2,
      });

      setPrevChar();

      expect(wordStore.getState().activeWord).toBe('dog');
      expect(wordStore.getState().nextIndex).toBe(1);
   });

   it('should stay on the first word when there is no previous word', () => {
      wordStore.setState({
         wordList: ['cat', 'dog'],
         activeWord: 'cat',
         nextIndex: 0,
      });

      setPrevChar();

      expect(wordStore.getState().activeWord).toBe('cat');
      expect(wordStore.getState().nextIndex).toBe(0);
   });

   it('should commit the current input and count the space when space is pressed', () => {
      wordStore.setState({
         wordList: ['cat', 'dog', 'pig'],
         activeWord: 'cat',
         userInput: 'cat',
         typedHistory: [],
         nextIndex: 0,
         nextCharIdx: 3,
         typedEntries: 3,
      });

      afterPressingSpace();

      const state = wordStore.getState();
      expect(state.userInput).toBe('');
      expect(state.typedHistory).toEqual(['cat']);
      expect(state.activeWord).toBe('dog');
      expect(state.nextIndex).toBe(1);
      expect(state.nextCharIdx).toBe(0);
      expect(state.typedEntries).toBe(4);
      expect(state.wordList).toEqual(['cat', 'dog', 'pig']);
   });

   it('should increment the typed entry count', () => {
      IncreaseTypedEntries();
      IncreaseTypedEntries();

      expect(wordStore.getState().typedEntries).toBe(2);
   });

   it('should store the latest error count', () => {
      setErrorCount(4);

      expect(wordStore.getState().errorCount).toBe(4);
   });

   it('should update the active word, input, disabled flag, and refs', () => {
      const caretRef = {
         current: document.createElement('span'),
      } as React.RefObject<HTMLSpanElement | null>;
      const activeWordRef = {
         current: document.createElement('div'),
      } as React.RefObject<HTMLDivElement | null>;

      setActiveWord('typed');
      setUserInput('ty');
      setDisabled(true);
      setCaretRef(caretRef);
      setRef(activeWordRef);

      const state = wordStore.getState();
      expect(state.activeWord).toBe('typed');
      expect(state.userInput).toBe('ty');
      expect(state.disabled).toBe(true);
      expect(state.caretRef).toBe(caretRef);
      expect(state.activeWordRef).toBe(activeWordRef);
   });
});

describe('config and time actions', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should update theme, type, category, and language', () => {
      setTheme('mint');
      setType('punctuation');
      setCategory('words');
      setLanguage('spanish');

      const state = userConfigStore.getState();
      expect(state.theme).toBe('mint');
      expect(state.type).toBe('punctuation');
      expect(state.category).toBe('words');
      expect(state.language).toBe('spanish');
   });

   it('should toggle sound', () => {
      expect(userConfigStore.getState().sound).toBe(false);

      toggleSound();
      expect(userConfigStore.getState().sound).toBe(true);

      toggleSound();
      expect(userConfigStore.getState().sound).toBe(false);
   });

   it('should default a fresh config to 30 seconds', () => {
      expect(Constants.TimeSec).toBe(30);
      expect(userConfigStore.getInitialState().time).toBe(30);
   });

   it('should keep a saved time limit when storage is rehydrated', async () => {
      localStorage.setItem(
         'userConfig',
         JSON.stringify({
            state: {
               time: 15,
               theme: '',
               type: 'default',
               category: 'time',
               sound: false,
               language: 'english',
            },
            version: 0,
         })
      );

      await persistedConfig().persist.rehydrate();

      expect(userConfigStore.getState().time).toBe(15);
      const saved = JSON.parse(localStorage.getItem('userConfig') ?? '{}') as {
         state?: { time?: number };
      };
      expect(saved.state?.time).toBe(15);
   });

   it('should persist the selected time limit', () => {
      setDefaultTime(15);

      expect(userConfigStore.getState().time).toBe(15);
      const raw = localStorage.getItem('userConfig');
      expect(raw).toBeTruthy();
      const saved = JSON.parse(raw ?? '{}') as { state?: { time?: number } };
      expect(saved.state?.time).toBe(15);
   });

   it('should clear the in-progress test without changing the saved time limit', () => {
      setDefaultTime(15);
      wordStore.setState({
         ...initialWordState,
         activeWord: 'cat',
         userInput: 'ca',
         wordList: ['cat'],
         typedHistory: ['nope'],
         nextIndex: 2,
         typedEntries: 8,
         errorCount: 3,
         disabled: true,
      });

      resetStates();

      const state = wordStore.getState();
      expect(state).toMatchObject({
         disabled: false,
         activeWord: '',
         userInput: '',
         wordList: [],
         typedHistory: [],
         nextIndex: 0,
         typedEntries: 0,
         errorCount: 0,
         keystrokeLog: [],
      });
      expect(userConfigStore.getState().time).toBe(15);
   });
});
