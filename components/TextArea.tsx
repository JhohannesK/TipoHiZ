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

   React.useEffect(() => {
      setRef(activeWordRef);
      setCaretRef(caretRef);
   }, [caretRef, activeWordRef]);

   React.useEffect(() => {
      import(`../modules/TextFiles/${type}.json`).then((word) => {
         setWordList(word.default);
      });
   }, [type]);

   const getCharStyle = (isCorrect: boolean | null) => {
      if (isCorrect === null) return {};
      return {
         color: `hsl(var(--${isCorrect ? 'correct' : 'wrong'}_char))`
      };
   };

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
         {wordList?.map((word, wordIndex) => {
            const isActive = activeWord === word && typedHistory.length === wordIndex;
            const typedWord = isActive ? userInput : typedHistory[wordIndex] || '';
            
            return (
               <div
                  key={word + wordIndex}
                  className="relative mt-0 mx-[7px] mb-1"
                  ref={isActive ? activeWordRef : null}
               >
                  {isActive && (
                     <span
                        ref={caretRef}
                        id="caret"
                        className="animate-blink rounded-sm flex items-start w-[.08em] h-7 top-1 bg-cursor justify-start text-cursor absolute"
                        style={{
                           left: typedWord.length * 12.3833,
                        }}
                     />
                  )}
                  {word.split('').map((char, charIndex) => {
                     const typedChar = typedWord[charIndex];
                     const isCorrect = typedChar !== undefined ? char === typedChar : null;
                     
                     return (
                        <span
                           key={char + charIndex}
                           style={getCharStyle(isCorrect)}
                        >
                           {char}
                        </span>
                     );
                  })}
                  {typedWord.length > word.length && (
                     <span style={getCharStyle(false)}>
                        {typedWord.slice(word.length)}
                     </span>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default TextArea;