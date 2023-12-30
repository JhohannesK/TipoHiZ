import React from 'react';
import { wordStore } from '../../store';
import {
   afterPressingSpace,
   setChar,
   setCurrChar,
} from '../../store/actions/WordActions';

export const useHandleText = (
   key: string,
   CtrlKey: boolean,
   caretRef: React.RefObject<HTMLSpanElement> | null,
   activeWordRef: React.RefObject<HTMLDivElement> | null
) => {
   const { userInput, activeWord } = wordStore.getState();

   // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
   const currWordEl = activeWordRef?.current!;

   currWordEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });

   const caret = caretRef?.current;

   caret?.classList.remove('animate-blink');

   setTimeout(() => caret?.classList.add('animate-blink'), 500);

   switch (key) {
      case 'Backspace':
         if (CtrlKey) {
            wordStore.setState(() => ({
               userInput: '',
               typedHistory: [],
            }));
         }
         break;
      case ' ':
         if (userInput === '') return;
         currWordEl?.classList.add(
            userInput !== activeWord ? 'wrong' : 'right'
         );
         afterPressingSpace();
         break;
      default:
         setCurrChar(key);
         setChar(key);
         break;
   }
};
