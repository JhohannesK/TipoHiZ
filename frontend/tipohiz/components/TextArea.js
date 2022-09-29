import React, { useState, useEffect } from 'react';
import { paragraphs } from './Paragraphs';
import { MdLanguage } from 'react-icons/md';

/* 
TODO: 
* Hide textbox
* 

FIXME: - Make counter work well
      - Active word advancing even if user is deleting a character.

*/

const NUM_OF_WORDS = 30;
const TimeSec = 60;

const TextArea = () => {
   const [text, setText] = useState([]);
   const [timer, setTimer] = useState(TimeSec);
   const [activeWord, setActiveWord] = useState(0);
   const [userInput, setUserInput] = useState(' ');

   //  Serves the selected paragraph to text of useState
   useEffect(() => {
      setText(getText());
      // startTimeCountDown();
   }, []);

   // Selecting one paragrah from paragraphs array
   const getText = () => {
      return paragraphs[0].split(' ', NUM_OF_WORDS);
   };

   // For Countdown
   const startTimeCountDown = () => {
      setInterval(() => {
         setTimer((preCount) => preCount - 1);
      }, 1000);
   };

   const processInput = (value) => {
      if (value.endsWith(' ')) {
         setActiveWord((preActiveWord) => preActiveWord + 1);
         setUserInput('');
      } else {
         setUserInput(value);
      }
   };

   return (
      <div className="pt-20 font-poppins">
         <div className="flex items-center justify-center gap-x-3 lowercase tracking-widest">
            <MdLanguage />
            <p className="cursor-pointer">english</p>
         </div>
         <div className="flex flex-wrap p-6 sm:px-36 font-poppins text-2xl tracking-widest selection:bg-yellow-300 selection:text-white">
            {/* Time display */}
            <div className="absolute top-[115px] text-2xl font-medium font-poppins">
               {timer}
            </div>

            {/* mapping through the text array */}
            {text.map((char, index) => {
               if (index === activeWord) {
                  return (
                     <>
                        <span>
                           <strong>{char}</strong>
                        </span>
                        <pre> </pre>
                     </>
                  );
               }
               return (
                  <>
                     <span key={index}>{char} </span>
                     <pre> </pre>
                  </>
               );
            })}
         </div>

         <div className="pt-8 flex items-center justify-center">
            <input
               type={userInput}
               className="w-[50rem] focus:outline-none px-5 py-5 rounded-lg text-lg text-black"
               onChange={(e) => processInput(e.target.value)}
            />
         </div>
      </div>
   );
};

export default TextArea;
