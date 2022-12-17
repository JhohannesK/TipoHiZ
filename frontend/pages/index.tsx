import Head from 'next/head';
import React from 'react';
import HomePage from '../components/HomePage';
import { wordStore } from '../store';
import { useHandleText } from '../helpers/utils/useHandleText';

export default function Home() {
   const { activeWordRef } = wordStore((state) => state);
   const { caretRef } = wordStore((state) => state);

   React.useEffect(() => {
      document.onkeydown = (e) => {
         if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
            useHandleText(e.key, e.ctrlKey, caretRef, activeWordRef);
            e.preventDefault();
         }
      };
      return () => {
         document.onkeydown = null;
      };
   }, []);
   return (
      <div className="">
         <div>
            <Head>
               <title>TipoHiZ</title>
            </Head>
         </div>

         <HomePage />
      </div>
   );
}
