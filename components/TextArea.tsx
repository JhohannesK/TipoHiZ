import React from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/actions/WordActions';
import { useTheme } from 'next-themes';

const TextArea = () => {
   const { type } = userConfigStore((state) => state);
   const { wordList, activeWord, userInput, typedHistory } = wordStore(
      (state) => state
   );
   const { theme } = useTheme();

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

   const getCorrectColor = () => {
      switch (theme) {
         case 'light':
            return 'text-lightcorrect';
         case 'dark':
            return 'text-darkcorrect';
         case 'light-orange':
            return 'text-lightorangecorrect';
         case 'dark-orange':
            return 'text-darkorangecorrect';
         case 'light-green':
            return 'text-lightgreencorrect';
         case 'dark-green':
            return 'text-darkgreencorrect';
         case 'dark-gray':
            return 'text-darkgraycorrect';
         case 'midnight-blue':
            return 'text-midnightbluecorrect';
         case 'ocean':
            return 'text-oceancorrect';
         case 'girly':
            return 'text-girlycorrect';
         case 'retro':
            return 'text-retrocorrect';
         case 'sunshine':
            return 'text-sunshinecorrect';
         case 'hacktoberfest':
            return 'text-hacktoberfestcorrect';
         case 'cyberpunk':
            return 'text-cyberpunkcorrect';
         default:
            return 'text-lightcorrect';
      }
   };

   const getWrongColor = () => {
      switch (theme) {
         case 'light':
            return 'text-lightwrong';
         case 'dark':
            return 'text-darkwrong';
         case 'light-orange':
            return 'text-lightorangewrong';
         case 'dark-orange':
            return 'text-darkorangewrong';
         case 'light-green':
            return 'text-lightgreenwrong';
         case 'dark-green':
            return 'text-darkgreenwrong';
         case 'dark-gray':
            return 'text-darkgraywrong';
         case 'midnight-blue':
            return 'text-midnightbluewrong';
         case 'ocean':
            return 'text-oceanwrong';
         case 'girly':
            return 'text-girlywrong';
         case 'retro':
            return 'text-retrowrong';
         case 'sunshine':
            return 'text-sunshinewrong';
         case 'hacktoberfest':
            return 'text-hacktoberfestwrong';
         case 'cyberpunk':
            return 'text-cyberpunkwrong';
         default:
            return 'text-lightwrong';
      }
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
                     const isCorrect = char === typedChar;
                     const colorClass = typedChar
                        ? (isCorrect ? getCorrectColor() : getWrongColor())
                        : '';
                     
                     return (
                        <span
                           key={char + charIndex}
                           className={colorClass}
                        >
                           {char}
                        </span>
                     );
                  })}
                  {typedWord.length > word.length && (
                     <span className={getWrongColor()}>
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