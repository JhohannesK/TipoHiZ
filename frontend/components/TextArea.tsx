import React from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/Actions';

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
   console.log(
      '🚀 ~ file: TextArea.tsx:18 ~ const{typedHistory}=wordStore ~ typedHistory',
      typedHistory
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

   // TODO: prevent caret from disppearing when user presses spacebar.

   return (
      <div className="flex flex-wrap p-6 sm:px-10 font-poppins text-2xl tracking-wider selection:bg-yellow-300 selection:text-white select-none">
         {/* mapping through the text array */}
         {wordList?.map((word, index) => {
            const isActive =
               activeWord === word && typedHistory.length === index;
            return (
               <div
                  key={word + index}
                  className="word relative"
                  ref={activeWordRef}
               >
                  {isActive && (
                     <span
                        ref={caretRef}
                        id="caret"
                        className="animate-blink text-green-400 ml-[-4px] absolute"
                        style={{
                           left: userInput.length * 14.5833,
                        }}
                     >
                        |
                     </span>
                  )}
                  {word.split('').map((char: string, charIndex: number) => (
                     <span key={char + charIndex}>{char}</span>
                  ))}
               </div>
            );
         })}
      </div>
   );
};

export default TextArea;
