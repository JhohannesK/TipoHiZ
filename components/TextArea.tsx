'use client';
import React, { useState, useEffect, useRef } from 'react';
import { userConfigStore, wordStore } from '../store';
import { setCaretRef, setRef, setWordList } from '../store/actions/WordActions';

// Define types for the translation function arguments
interface TranslateWordArgs {
   word: string;
   sourceLang?: string;
   targetLang: string;
}

// Translation function
const translateWord = async ({
   word,
   sourceLang = 'en',
   targetLang,
}: TranslateWordArgs): Promise<string> => {
   const url = 'https://google-translator9.p.rapidapi.com/v2';
   const options = {
      method: 'POST',
      headers: {
         'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY!,
         'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPID_API_HOST!,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         q: word,
         source: sourceLang, // source language from prop
         target: targetLang, // target language for translation
         format: 'text',
      }),
   };

   try {
      const response = await fetch(url, options);
      const result = await response.json(); // parse JSON result
      return result.data.translations[0].translatedText; // get translated word
   } catch (error) {
      console.error('Translation error:', error);
      return word; // fallback to original word if error occurs
   }
};

// Define props interface for TextArea component
interface TextAreaProps {
   selectedLanguage: string; // language prop passed from HomePage
}

const TextArea: React.FC<TextAreaProps> = ({ selectedLanguage }) => {
   const { type } = userConfigStore((state) => state);
   const { wordList, activeWord, userInput, typedHistory } = wordStore(
      (state) => state
   );

   const [translatedWords, setTranslatedWords] = useState<string[]>([]); // State to hold translated words

   const caretRef = useRef<HTMLSpanElement>(null);
   const activeWordRef = useRef<HTMLDivElement>(null);
   const extraLetters = userInput.slice(activeWord.length).split('');

   // Initialize references
   useEffect(() => {
      setRef(activeWordRef);
      setCaretRef(caretRef);
   }, [caretRef, activeWordRef]);

   // Fetch word list and translate
   useEffect(() => {
      const loadAndTranslateWords = async () => {
         const wordsModule = await import(`../modules/TextFiles/${type}.json`);
         const words: string[] = wordsModule.default;
         setWordList(words); // Set the original word list

         // Translate each word
         const translated = await Promise.all(
            words.map(async (word) => {
               const translatedWord = await translateWord({
                  word,
                  targetLang: selectedLanguage,
               }); // Use selected language
               return translatedWord;
            })
         );

         setTranslatedWords(translated); // Set the translated words
      };

      loadAndTranslateWords();
   }, [type, selectedLanguage]); // Re-run when type or selectedLanguage changes

   return (
      <div className="flex flex-wrap overflow-hidden text-xl select-none h-28 sm:px-10 font-poppins md:text-2xl selection:bg-yellow-300 selection:text-white text-input">
         {translatedWords.length > 0 &&
            translatedWords.map((word, index) => {
               const isActive =
                  activeWord === word && typedHistory.length === index;
               return (
                  <div
                     key={word + index}
                     className="relative mt-0 mx-[7px] mb-1"
                     ref={isActive ? activeWordRef : null}
                  >
                     <div className="startView">
                        {isActive ? (
                           <span
                              ref={caretRef}
                              id="caret"
                              className="animate-blink rounded-sm flex items-start w-[.08em] h-7 top-1 bg-cursor justify-start text-cursor  absolute"
                              style={{
                                 left: userInput.length * 12.3833,
                              }}
                           />
                        ) : null}
                     </div>
                     {word.split('').map((char, charIndex) => {
                        return (
                           <span className={``} key={char + charIndex}>
                              {char}
                           </span>
                        );
                     })}
                     {isActive
                        ? extraLetters.map((char, charId) => {
                             return (
                                <span
                                   key={char + charId}
                                   className="wrong extra"
                                >
                                   {char}
                                </span>
                             );
                          })
                        : typedHistory[index]
                        ? typedHistory[index]
                             .slice(wordList[index].length)
                             .split('')
                             .map((char, charId) => {
                                return (
                                   <span
                                      key={char + charId}
                                      className="wrong extra"
                                   >
                                      {char}
                                   </span>
                                );
                             })
                        : null}
                  </div>
               );
            })}
      </div>
   );
};

export default TextArea;
