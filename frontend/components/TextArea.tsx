import React, { useState, useEffect, useCallback, useRef } from 'react';
import { paragraphs } from './Paragraphs';
import { MdLanguage } from 'react-icons/md';
import { BsArrowRepeat } from 'react-icons/bs';
import { useRouter } from 'next/router';

/* 
TODO: 
* Hide textbox
* Make correct words green and wrong words red.

FIXME: - Active word advancing even if user is deleting a character when there is a space and also advances on continous spacebar keydown.
*/

const NUM_OF_WORDS: number = 30;
const TimeSec: number = 5;

const TextArea = () => {
   const [text, setText] = useState<string[]>([]);
   const [timer, setTimer] = useState(TimeSec);
   const [activeWord, setActiveWord] = useState(0);
   const [userInput, setUserInput] = useState('');
   const inputRef = useRef<HTMLInputElement>();
   const [correctWord, setCorrectWord] = useState(false);
   const [totalCountOfCorrectWords, setTotalCountOfCorrectWords] = useState(0);
   const [disableTextField, setDisableTextField] = useState(false);

   const router = useRouter();

   //  Serves the selected paragraph to text of useState
   useEffect(() => {
      setText(getText());

      if (inputRef.current) {
         inputRef.current.addEventListener('keydown', startTimeCountDown);
      }
   }, []);

   // Selecting one paragrah from paragraphs array
   const getText = () => {
      return paragraphs[0].split(' ', NUM_OF_WORDS);
   };

   // For Countdown
   const startTimeCountDown = useCallback(() => {
      if (inputRef.current) {
         inputRef.current.removeEventListener('keydown', startTimeCountDown);
      }
      let timeInterval = setInterval(() => {
         setTimer((preCount) => {
            // Timer stops when it gets to zero
            if (preCount === 1) {
               clearInterval(timeInterval);
               setDisableTextField(true);
            }
            return preCount - 1;
         });
      }, 1000);
   }, []);

   if (timer === 0) {
      router.push('/results');
   }

   const processInput = (value: string) => {
      if (value.endsWith(' ')) {
         checkWordsIfEqual();
         setUserInput('');
         setActiveWord((preActiveWord) => preActiveWord + 1);
      } else {
         setUserInput(value);
      }
   };

   const checkWordsIfEqual = () => {
      const currWord: string = text[activeWord];
      const isMatch: boolean = currWord === userInput.trim();
      console.log({ isMatch });
      if (isMatch) {
         setTotalCountOfCorrectWords((prevCount) => prevCount + 1);
         setCorrectWord(true);
      } else {
         setCorrectWord(false);
      }
   };

   return (
      <div className="xl:max-w-7xl mx-auto pt-32 font-poppins">
         <div className="flex items-center justify-center gap-x-3 lowercase tracking-widest">
            <MdLanguage />
            <p className="cursor-pointer">english</p>
         </div>
         <div className="flex flex-wrap p-6 sm:px-36 font-poppins text-2xl tracking-widest selection:bg-yellow-300 selection:text-white">
            {/* Time display */}
            <div className="absolute top-[12.5rem] text-2xl font-medium font-poppins">
               {timer}
            </div>

            {/* mapping through the text array */}
            {text.map((word, index) => {
               if (index === activeWord) {
                  return (
                     <>
                        <span key={index}>
                           {/* Bolden the next word to be typed */}
                           <strong>
                              {word
                                 .split('')
                                 .map((char: string, index: number) => (
                                    <span key={index}>{char}</span>
                                 ))}
                           </strong>
                        </span>
                        <pre> </pre>
                     </>
                  );
               }
               return (
                  <>
                     <span key={index}>
                        {word.split('').map((char: string, index: number) => (
                           <span key={index}>{char}</span>
                        ))}
                     </span>
                     <pre> </pre>
                  </>
               );
            })}
         </div>

         <div className="pt-8 flex items-center justify-center space-x-4">
            <input
               type={userInput}
               ref={inputRef}
               // onBlur={this.focus()}
               autoFocus
               className="w-[50rem] focus:outline-none px-5 py-5 rounded-lg text-lg text-black"
               onChange={(e) => {
                  processInput(e.target.value);
               }}
               // onKeyDown={(e) => console.log(e.key)}
               value={userInput}
               disabled={disableTextField}
            />
            <BsArrowRepeat
               className="hover:rotate-180 transition-all duration-500 ease-out cursor-pointer active:scale-150 active:text-green-300"
               size={30}
            />
         </div>
      </div>
   );
};

export default TextArea;
