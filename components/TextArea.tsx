'use client';
import React from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/actions/WordActions';

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

   return (
      <div className="flex flex-wrap overflow-hidden text-xl select-none h-28 sm:px-10 font-poppins md:text-2xl selection:bg-yellow-300 selection:text-white text-input">
         {/* <input
            type="text"
            className="absolute bg-transparent cursor-default pointer-events-none -z-10 "
            autoCapitalize="off"
            aria-autocomplete="none"
            autoCorrect="off"
            spellCheck="false"
            data-enable-grammarly="false"
         /> */}
         {wordList?.map((word, index) => {
            const isActive =
               activeWord === word && typedHistory.length === index;
            return (
               <div
                  key={word + index}
                  className="relative mt-0 mx-[7px] mb-1"
                  ref={isActive ? activeWordRef : null}
               >
                  <div className="startView">
                     {isActive ? (
                        <span
                           ref={caretRef}
                           id="caret"
                           className="animate-blink rounded-sm flex items-start w-[.08em] h-7 top-1 bg-cursor justify-start text-cursor  absolute"
                           style={{
                              left: userInput.length * 12.3833,
                           }}
                        />
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
