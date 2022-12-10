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
   const caretRef = React.useRef<HTMLSpanElement>(null);
   const activeWordRef = React.useRef<HTMLDivElement>(null);
   console.log(
      '🚀 ~ file: TextArea.tsx:12 ~ TextArea ~ activeWordRef',
      activeWordRef
   );

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
      <div className="flex flex-wrap p-6 sm:px-10 font-poppins text-2xl tracking-wider selection:bg-yellow-300 selection:text-white">
         {/* mapping through the text array */}
         {wordList?.map((word, index) => {
            const isActive = activeWord === word;
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
                        className="animate-blink text-green-400 ml-[-7px] absolute"
                        style={{
                           left: 0 * 14.5833,
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
