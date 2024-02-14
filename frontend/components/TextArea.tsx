'use client';

import React from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/actions/WordActions';
import useRecordInput from '@/helpers/utils/useRecordInput';

const TextArea = () => {
   const { type } = userConfigStore((state) => state);
   const { wordList, activeWord, userInput, typedHistory } = wordStore(
      (state) => state
   );

   const caretRef = React.useRef<HTMLSpanElement>(null);
   const activeWordRef = React.useRef<HTMLDivElement>(null);
   const extraLetters = userInput.slice(activeWord.length).split('');

   React.useEffect(() => {
      setRef(activeWordRef);
      setCaretRef(caretRef);
   }, [caretRef, activeWordRef]);

   React.useEffect(() => {
      import(`../modules/TextFiles/${type}.json`).then((word) => {
         setWordList(word.default);
      });
   }, [type]);

   useRecordInput();

   return (
      <div className="flex flex-wrap h-32 overflow-hidden text-xl select-none sm:px-10 font-poppins md:text-2xl selection:bg-yellow-300 selection:text-white">
         {wordList?.map((word, index) => {
            const isActive =
               activeWord === word && typedHistory.length === index;
            return (
               <div
                  key={word + index}
                  className="relative mt-0 mr-[14px] mb-1"
                  ref={isActive ? activeWordRef : null}
               >
                  <div className="startView">
                     {isActive ? (
                        <span
                           ref={caretRef}
                           id="caret"
                           className="animate-blink text-green-400 ml-[-7.29165px] absolute"
                           style={{
                              left: userInput.length * 12.5833,
                           }}
                        >
                           |
                        </span>
                     ) : null}
                  </div>
                  {word.split('').map((char, charIndex) => {
                     return (
                        <span className={``} key={char + charIndex}>
                           {char}
                        </span>
                     );
                  })}
                  {isActive
                     ? extraLetters.map((char, charId) => {
                          return (
                             <span key={char + charId} className="wrong extra">
                                {char}
                             </span>
                          );
                       })
                     : typedHistory[index]
                     ? typedHistory[index]
                          .slice(wordList[index].length)
                          .split('')
                          .map((char, charId) => {
                             return (
                                <span
                                   key={char + charId}
                                   className="wrong extra"
                                >
                                   {char}
                                </span>
                             );
                          })
                     : null}
               </div>
            );
         })}
      </div>
   );
};

export default TextArea;
