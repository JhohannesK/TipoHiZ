import React from 'react';

interface ITextAreaProps {
   text: string[];
   activeWord: number;
}

const TextArea = ({ text, activeWord }: ITextAreaProps) => {
   return (
      <div className="flex flex-wrap p-6 sm:px-10 font-poppins text-2xl tracking-widest selection:bg-yellow-300 selection:text-white">
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
