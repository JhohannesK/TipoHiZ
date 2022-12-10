import React from 'react';
import { wordStore } from '../store';
import { setChar } from '../store/Actions';

export const useHandleText = (
   key: string,
   CtrlKey: boolean,
   caretRef: React.RefObject<HTMLSpanElement> | null,
   activeWordRef: React.RefObject<HTMLDivElement> | null
) => {
   const currWordEl = activeWordRef?.current!;
   currWordEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
   const caret = caretRef?.current;
   caret?.classList.remove('animate-blink');
   setTimeout(() => caret?.classList.add('animate-blink'), 500);
   switch (key) {
      case 'Backspace':
         if (CtrlKey) {
            wordStore.setState((state) => ({
               userInput: '',
               typedHistory: [],
            }));
         }
         break;
      case ' ':
         wordStore.setState((state) => ({
            userInput: '',
            // typedHistory: [...state.typedHistory, state.userInput],
         }));
      default:
         setChar(key);
         break;
   }
};
