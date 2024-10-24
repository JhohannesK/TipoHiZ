import React, { useEffect, useRef, useState } from 'react';
import { userConfigStore, wordStore } from '../store';
import {
   setCaretRef,
   setErrorCount,
   setRef,
   setWordList,
} from '../store/actions/WordActions';

interface keyObj {
   key: string;
}

interface soundProps {
   sound: boolean;
}

const TextArea: React.FC<soundProps> = ({ sound }) => {
   const { type } = userConfigStore((state) => state);
   const { wordList, activeWord, userInput, typedHistory } = wordStore(
      (state) => state
   );

   //state to hold the typing sound
   const [typingSound, setTypingSound] = useState<HTMLAudioElement | null>(
      null
   );

   //effect to load the typing sound
   useEffect(() => {
      const audio = new Audio('/modules/AudioFiles/type.mp3');
      setTypingSound(audio);
      return () => {
         if (typingSound) {
            typingSound.pause(); //pause the audio
            typingSound.currentTime = 0; //reset to the beginning
         }
         setTypingSound(null);
      };
   }, []);

   //effect to handle keydown events and play sound
   useEffect(() => {
      const handleKeyDown = (e: keyObj) => {
         if (
            e &&
            e.key !== 'Meta' &&
            e.key !== 'Alt' &&
            e.key !== 'Control' &&
            e.key !== 'Shift' &&
            e.key !== 'CapsLock' &&
            e.key !== 'Tab'
         ) {
            if (typingSound) {
               typingSound.currentTime = 0; // Reset sound to the beginning
               typingSound.volume = sound ? 0.1 : 0; // Set volume based on the `sound` prop
               typingSound.playbackRate = 1; // Adjust playback speed if needed
               typingSound.play();
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);

      // clean up the event listener on component unmount
      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [typingSound, sound]); // Adding `sound` to dependencies

   const caretRef = useRef<HTMLSpanElement>(null);
   const activeWordRef = useRef<HTMLDivElement>(null);

   const calculateErrors = () => {
      let count = 0;
      const activeWordLength = activeWord.length;
      const userInputLength = userInput.length;

      for (let i = 0; i < Math.min(activeWordLength, userInputLength); i++) {
         if (userInput[i] !== activeWord[i]) {
            count++;
         }
      }

      if (userInputLength > activeWordLength) {
         count += userInputLength - activeWordLength;
      } else if (userInputLength < activeWordLength) {
         count += activeWordLength - userInputLength;
      }

      setErrorCount(count);
   };

   useEffect(() => {
      calculateErrors();
   }, [userInput, activeWord]);

   useEffect(() => {
      setRef(activeWordRef);
      setCaretRef(caretRef);
   }, [caretRef, activeWordRef]);

   useEffect(() => {
      import(`../modules/TextFiles/${type}.json`).then((word) => {
         setWordList(word.default);
      });
   }, [type]);

   const getCharClass = (isCorrect: boolean | null) => {
      if (isCorrect === null) return '';
      return isCorrect ? 'text-correct_char' : 'text-wrong_char';
   };

   return (
      <div className="flex flex-wrap overflow-hidden text-xl select-none h-28 sm:px-10 font-poppins md:text-2xl selection:bg-yellow-300 selection:text-white text-input">
         {wordList?.map((word, wordIndex) => {
            const isActive =
               activeWord === word && typedHistory.length === wordIndex;
            const typedWord = isActive
               ? userInput
               : typedHistory[wordIndex] || '';

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
                     const isCorrect =
                        typedChar !== undefined ? char === typedChar : null;

                     return (
                        <span
                           key={char + charIndex}
                           className={getCharClass(isCorrect)}
                        >
                           {char}
                        </span>
                     );
                  })}
                  {typedWord.length > word.length && (
                     <span className="text-wrong_char">
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
