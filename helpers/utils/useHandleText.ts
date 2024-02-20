import React from 'react';
import { wordStore } from '../../store';
import {
   afterPressingSpace,
   setChar,
   setCurrChar,
} from '../../store/actions/WordActions';

export const useHandleText = (
   key: string,
   activeWordRef: React.RefObject<HTMLDivElement> | null,
   run: () => void
) => {
   const { userInput, activeWord } = wordStore.getState();

   // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
   const currWordEl = activeWordRef?.current!;

   currWordEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });

   switch (key) {
      case 'Backspace':
         wordStore.setState(() => ({
            userInput: '',
            typedHistory: [],
         }));
         break;
      case 'Tab':
         return;
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
         run();
         break;
   }
};
