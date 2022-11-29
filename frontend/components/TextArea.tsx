import React from 'react';
import Timer from './modules/Timer';

interface ITextAreaProps {
   text: string[];
   activeWord: number;
   inputRef: React.RefObject<HTMLInputElement>;
}

const TextArea = ({ inputRef, text, activeWord }: ITextAreaProps) => {
   return (
      <div className="flex flex-wrap p-6 sm:px-36 font-poppins text-2xl tracking-widest selection:bg-yellow-300 selection:text-white">
         {/* Time display */}
         <div className="absolute top-[12.5rem] text-2xl font-medium font-poppins text-emerald-400">
            <Timer input={inputRef} />
         </div>

         {/* mapping through the text array */}
         {text?.map((word, index) => {
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
   );
};

export default TextArea;
