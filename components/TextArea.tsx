'use client';
import React, { useEffect, useRef, useState } from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/actions/WordActions';

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

   // State to hold the typing sound
   const [typingSound, setTypingSound] = useState<HTMLAudioElement | null>(
      null
   );

   // Effect to load the typing sound
   useEffect(() => {
      const audio = new Audio('/modules/AudioFiles/type.mp3');
      setTypingSound(audio);
      return () => {
         // Clean up audio instance on unmount
         setTypingSound(null);
      };
   }, []);

   // Effect to handle keydown events and play sound
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
               typingSound.volume = sound ? 1 : 0; // Set volume based on the `sound` prop
               typingSound.playbackRate = 1; // Adjust playback speed if needed
               typingSound.play();
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Clean up the event listener on component unmount
      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [typingSound, sound]); // Adding `sound` to dependencies

   const caretRef = useRef<HTMLSpanElement>(null);
   const activeWordRef = useRef<HTMLDivElement>(null);
   const extraLetters = userInput.slice(activeWord.length).split('');

   useEffect(() => {
      setRef(activeWordRef);
      setCaretRef(caretRef);
   }, [caretRef, activeWordRef]);

   useEffect(() => {
      import(`../modules/TextFiles/${type}.json`).then((word) => {
         setWordList(word.default);
      });
   }, [type]);

   return (
      <div className="flex flex-wrap overflow-hidden text-xl select-none h-28 sm:px-10 font-poppins md:text-2xl selection:bg-yellow-300 selection:text-white text-input">
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
                     {isActive && (
                        <span
                           ref={caretRef}
                           id="caret"
                           className="animate-blink rounded-sm flex items-start w-[.08em] h-7 top-1 bg-cursor justify-start text-cursor absolute"
                           style={{
                              left: userInput.length * 12.3833,
                           }}
                        />
                     )}
                  </div>
                  {word.split('').map((char, charIndex) => {
                     const isCorrectlyTyped =
                        isActive && char === userInput[charIndex];
                     return (
                        <span
                           key={char + charIndex}
                           className={isCorrectlyTyped ? 'text-yellow-500' : ''}
                        >
                           {char}
                        </span>
                     );
                  })}
                  {isActive
                     ? extraLetters.map((char, charId) => (
                          <span key={char + charId} className="wrong extra">
                             {char}
                          </span>
                       ))
                     : typedHistory[index]
                     ? typedHistory[index]
                          .slice(wordList[index].length)
                          .split('')
                          .map((char, charId) => (
                             <span key={char + charId} className="wrong extra">
                                {char}
                             </span>
                          ))
                     : null}
               </div>
            );
         })}
      </div>
   );
};

export default TextArea;
