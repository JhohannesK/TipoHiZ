import React from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/actions/WordActions';

const TextArea = () => {
   const { type } = userConfigStore((state) => state);
   const { wordList } = wordStore(({ wordList }) => {
      return { wordList };
   });

   const { activeWord } = wordStore(({ activeWord }) => {
      return { activeWord };
   });

   const { userInput } = wordStore(({ userInput }) => {
      return { userInput };
   });

   const { typedHistory } = wordStore(({ typedHistory }) => {
      return { typedHistory };
   });

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

   return (
      <div className="flex flex-wrap p-6 sm:px-10 font-poppins text-xl md:text-2xl h-32 selection:bg-yellow-300 selection:text-white select-none">
         {/* mapping through the text array */}
         {wordList?.map((word, index) => {
            const isActive =
               activeWord === word && typedHistory.length === index;
            return (
               <div
                  key={word + index}
                  className="relative mt-0 mr-[4px] mb-1"
                  ref={isActive ? activeWordRef : null}
               >
                  {isActive ? (
                     <span
                        ref={caretRef}
                        id="caret"
                        className="animate-blink text-green-400 ml-[-7.29165px] absolute"
                        style={{
                           left: userInput.length * 12.5833,
                        }}
                     >
                        |
                     </span>
                  ) : null}
                  {word.split('').map((char, charIndex) => (
                     <span className="" key={char + charIndex}>
                        {char}
                     </span>
                  ))}
               </div>
            );
         })}
      </div>
   );
};

export default TextArea;
