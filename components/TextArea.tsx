import React, { useEffect, useRef, useState } from 'react';
import { userConfigStore, wordStore } from '../store';
import { HandleText } from '../lib/handle-text';
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
   run: () => void;
}

const TextArea: React.FC<soundProps> = ({ sound, run }) => {
   const { type } = userConfigStore((state) => state);
   const { wordList, activeWord, userInput, typedHistory } = wordStore(
      (state) => state
   );

   //state to hold the typing sound
   const [typingSound, setTypingSound] = useState<HTMLAudioElement | null>(
      null
   );

   // State to track cursor position
   const [caretPosition, setCaretPosition] = useState(0);
   const animationFrameRef = useRef<number | null>(null);

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
   const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
   const suppressInputRef = useRef(false);

   const focusHiddenInput = () => {
      const el = hiddenInputRef.current;
      if (!el) return;
      // Virtual keyboards generally require a focusable input/textarea.
      // This may no-op without a user gesture (browser policy), so we also
      // call it from pointer events.
      try {
         // Older TS DOM libs may not include preventScroll typing.
         (el as unknown as { focus: (opts?: unknown) => void }).focus({
            preventScroll: true,
         });
      } catch {
         el.focus();
      }
      // Keep caret at end (some mobile keyboards behave better).
      try {
         el.setSelectionRange(el.value.length, el.value.length);
      } catch {
         // ignore
      }
   };

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

   // Update caret position with requestAnimationFrame
   useEffect(() => {
      // Cancel any existing animation frame
      if (animationFrameRef.current !== null) {
         cancelAnimationFrame(animationFrameRef.current);
      }

      // Schedule a new animation frame
      animationFrameRef.current = requestAnimationFrame(() => {
         setCaretPosition(userInput.length);
      });

      // Cleanup function
      return () => {
         if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
         }
      };
   }, [userInput]);

   useEffect(() => {
      calculateErrors();
   }, [userInput, activeWord]);

   useEffect(() => {
      setRef(activeWordRef);
      setCaretRef(caretRef);
   }, [caretRef, activeWordRef]);

   useEffect(() => {
      focusHiddenInput();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

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
      <div className="relative">
         <textarea
            ref={hiddenInputRef}
            aria-hidden="true"
            tabIndex={-1}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            // Keep it present+focusable but invisible.
            className="fixed bottom-0 left-0 w-1 h-1 opacity-0"
            onKeyDown={(e) => {
               if (e.nativeEvent.isComposing) return;

               if (
                  (e.key.length === 1 || e.key === 'Backspace') &&
                  !e.ctrlKey &&
                  !e.altKey &&
                  !e.metaKey &&
                  e.key !== 'Enter' &&
                  e.key !== 'Tab'
               ) {
                  suppressInputRef.current = true;
                  window.setTimeout(() => {
                     suppressInputRef.current = false;
                  }, 0);

                  HandleText(e.key, activeWordRef, run);
                  e.preventDefault();
               }
            }}
            onBeforeInput={(e) => {
               if (suppressInputRef.current) return;

               const native = e.nativeEvent as unknown as InputEvent;
               const inputType = (native as unknown as { inputType?: string })
                  .inputType;
               const data = (native as unknown as { data?: string | null })
                  .data;

               if (inputType === 'deleteContentBackward') {
                  HandleText('Backspace', activeWordRef, run);
                  return;
               }

               if (typeof data === 'string' && data.length > 0) {
                  for (const ch of data) {
                     HandleText(ch, activeWordRef, run);
                  }
               }
            }}
            onInput={(e) => {
               if (suppressInputRef.current) {
                  e.currentTarget.value = '';
                  return;
               }

               // Fallback for browsers where keydown/beforeinput are unreliable (mobile VK).
               const value = e.currentTarget.value;
               if (value) {
                  for (const ch of value) {
                     HandleText(ch, activeWordRef, run);
                  }
               }
               e.currentTarget.value = '';
            }}
         />

         <div
            className="flex flex-wrap overflow-hidden text-xl select-none h-28 sm:px-10 font-poppins md:text-2xl selection:bg-yellow-300 selection:text-white text-input"
            onPointerDown={() => {
               focusHiddenInput();
            }}
            onClick={() => {
               focusHiddenInput();
            }}
         >
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
                              left: `${caretPosition}ch`,
                              transform: 'translateZ(0)',
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
      </div>
   );
};

export default TextArea;
