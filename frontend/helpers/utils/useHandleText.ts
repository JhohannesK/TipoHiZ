import React from 'react';
import { wordStore } from '../../store';
import { afterPressingSpace, setChar } from '../../store/actions/WordActions';

export const useHandleText = (
   key: string,
   CtrlKey: boolean,
   caretRef: React.RefObject<HTMLSpanElement> | null,
   activeWordRef: React.RefObject<HTMLDivElement> | null
) => {
   const { userInput, activeWord } = wordStore.getState();

   const currWordEl = activeWordRef?.current!;
   console.log('🚀 ~ file: useHandleText.ts:14 ~ currWordEl:', currWordEl);

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
         if (userInput === '') return;
         currWordEl.classList.add(userInput !== activeWord ? 'wrong' : 'right');
         afterPressingSpace();
         break;
      default:
         setChar(key);
         break;
   }
};
