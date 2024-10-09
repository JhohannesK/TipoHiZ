import React from 'react';
import { wordStore } from '../../store';
import {
   IncreaseTypedEntries,
   afterPressingSpace,
   setChar,
   setNextChar,
   setPrevChar,
} from '../../store/actions/WordActions';

export const useHandleText = (
   key: string,
   activeWordRef: React.RefObject<HTMLDivElement> | null,
   run: () => void
) => {
   const {
      userInput,
      activeWord,
      typedHistory,
      correctEntries,
      incorrectEntries,
   } = wordStore.getState();

   // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
   const currWordEl = activeWordRef?.current!;

   currWordEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });

   switch (key) {
      case 'Backspace':
         let prevWord: string = '';
         let prevTypedHistory: string[] = typedHistory;
         if (userInput === '') {
            prevWord = typedHistory.length
               ? typedHistory[typedHistory.length - 1]
               : '';
            prevTypedHistory =
               typedHistory.length > 0 ? typedHistory.slice(0, -1) : [];
            prevWord ? setPrevChar() : null;
            currWordEl?.classList.remove('wrong', 'right');
         }
         wordStore.setState((state) => ({
            userInput:
               userInput !== '' ? state.userInput.slice(0, -1) : prevWord,
            typedHistory: prevTypedHistory,
         }));
         break;
      case 'Tab':
         return;
      case ' ':
         if (userInput === '') return;
         if (userInput !== activeWord) {
            wordStore.setState({
               incorrectEntries: incorrectEntries + 1,
            });
         } else {
            wordStore.setState({
               correctEntries: correctEntries + 1,
            });
         }
         currWordEl?.classList.add(
            userInput !== activeWord ? 'wrong' : 'right'
         );
         afterPressingSpace();
         break;
      default:
         setNextChar();
         IncreaseTypedEntries();
         setChar(key);
         run();
         break;
   }
};
