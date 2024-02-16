'use client';

import { userConfigStore, wordStore } from '@/store';
import React, { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ResetTest } from '../reset';
import { useHandleText } from '../utils/useHandleText';

const KeydownGetter = ({ children }: { children: React.ReactNode }) => {
   const timerid = wordStore((state) => state.timerId);
   const { type } = userConfigStore((state) => state);

   const { activeWordRef } = wordStore((state) => state);

   useEffect(() => {
      document.onkeydown = (e) => {
         if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
            useHandleText(e.key, e.ctrlKey, activeWordRef);
            e.preventDefault();
         }
      };

      return () => {
         document.onkeydown = null;
      };
   }, [activeWordRef]);

   useHotkeys('tab+enter', () => {
      wordStore.setState(() => {
         return {
            typedHistory: [],
            userInput: '',
         };
      });
      ResetTest(timerid, type);
   });
   return <>{children}</>;
};

export default KeydownGetter;
