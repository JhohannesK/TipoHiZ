import React from 'react';
import { userConfigStore, wordStore } from '../store';
import {
   afterPressingSpace,
   setChar,
   setDisabled,
   setNextChar,
   setPrevChar,
} from '../store/actions/WordActions';
import {
   appendKeystroke,
   classifyTypedKey,
   syncKeystrokeStats,
} from './stats/record';
import { wordsTestFinished } from './words';

function finishWordsTest(onFinish?: () => void): void {
   const state = wordStore.getState();
   const { category, wordCount } = userConfigStore.getState();
   if (
      !wordsTestFinished({
         category,
         wordCount,
         wordListLength: state.wordList.length,
         nextIndex: state.nextIndex,
         activeWord: state.activeWord ?? '',
         userInput: state.userInput,
      })
   ) {
      return;
   }

   setDisabled(true);
   onFinish?.();
}

export const HandleText = (
   key: string,
   activeWordRef: React.RefObject<HTMLDivElement | null> | null,
   run: () => void,
   onFinish?: () => void
) => {
   if (wordStore.getState().disabled) return;

   const { userInput, activeWord, typedHistory, nextIndex, wordList } =
      wordStore.getState();

   // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
   const currWordEl = activeWordRef?.current!;

   currWordEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });

   let inputWithShift = '';
   if (key.startsWith('Shift')) {
      inputWithShift = key.charAt(key.length - 1);
      key = 'Shift';
   }

   switch (key) {
      case 'Backspace': {
         let prevWord = '';
         let prevTypedHistory = typedHistory;
         if (userInput === '') {
            if (typedHistory.length === 0) return;
            prevWord = typedHistory[typedHistory.length - 1] ?? '';
            prevTypedHistory =
               typedHistory.length > 0 ? typedHistory.slice(0, -1) : [];
            if (prevWord) setPrevChar();
            currWordEl?.classList.remove('wrong', 'right');
            const previousIndex = Math.max(0, nextIndex - 1);
            const previousTarget = wordList[previousIndex] ?? '';
            const deleteIndex = prevWord.length - 1;
            appendKeystroke({
               key: 'Backspace',
               expected:
                  deleteIndex >= previousTarget.length
                     ? null
                     : previousTarget[deleteIndex] ?? null,
               kind: 'backspace',
               wordIndex: previousIndex,
            });
         } else {
            const deleteIndex = userInput.length - 1;
            appendKeystroke({
               key: 'Backspace',
               expected:
                  deleteIndex >= activeWord.length
                     ? null
                     : activeWord[deleteIndex] ?? null,
               kind: 'backspace',
               wordIndex: nextIndex,
            });
         }
         wordStore.setState((state) => ({
            userInput:
               userInput !== '' ? state.userInput.slice(0, -1) : prevWord,
            typedHistory: prevTypedHistory,
         }));
         syncKeystrokeStats();
         break;
      }
      case 'Tab':
         return;
      case 'Shift': {
         const char = inputWithShift.toUpperCase();
         const decision = classifyTypedKey(activeWord, userInput, char);
         if (decision.blocked || char === '') return;
         appendKeystroke({
            key: char,
            expected: decision.expected,
            kind: decision.kind,
            wordIndex: nextIndex,
         });
         wordStore.setState((state) => ({
            userInput: state.userInput + char,
         }));
         syncKeystrokeStats();
         finishWordsTest(onFinish);
         break;
      }
      case ' ':
         if (userInput === '') return;
         currWordEl?.classList.add(
            userInput !== activeWord ? 'wrong' : 'right'
         );
         appendKeystroke({
            key: ' ',
            expected: ' ',
            kind: 'correct',
            wordIndex: nextIndex,
         });
         afterPressingSpace();
         syncKeystrokeStats();
         finishWordsTest(onFinish);
         break;
      default: {
         const decision = classifyTypedKey(activeWord, userInput, key);
         if (decision.blocked) return;
         appendKeystroke({
            key,
            expected: decision.expected,
            kind: decision.kind,
            wordIndex: nextIndex,
         });
         setNextChar();
         setChar(key);
         syncKeystrokeStats();
         run();
         finishWordsTest(onFinish);
         break;
      }
   }
};
