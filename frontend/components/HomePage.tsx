import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { MdLanguage } from 'react-icons/md';
import { BsArrowRepeat } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { setActiveWord, setTime, setUserInput } from '../store/Actions';
import { getText } from '../helpers/GetTextParagraph';
import TextArea from './TextArea';
import { useHotkeys } from 'react-hotkeys-hook';
import UserSelectPallete from './UserSelectPallete';
import { State } from '../store/@types.';
import { userConfigStore, useStore } from '../store';
import useGetStatefromStorage from '../utils/useZustandHook';
// import Timer, { startTimeCountDown } from '../modules/Timer';

// cache selectors to prevent unnecessary computations
const selector = ({ disabled, activeWord, userInput }: State) => {
   return {
      disabledInput: disabled,
      activeWord,
      userInput,
   };
};

const HomePage = () => {
   const [text, setText] = useState<string[]>([]);

   const router = useRouter();
   useHotkeys('tab', () => router.reload());

   const { disabledInput, activeWord, userInput } = useStore(selector);

   // const { time } = useStore(({ time }) => ({ time }));

   const time = useGetStatefromStorage(
      userConfigStore,
      (state: any) => state.time
   );

   //  Serves the selected paragraph to text of useState
   // useEffect(() => {
   //    setText(getText());
   // }, []);

   // const processInput = (value: string) => {
   //    if (value.endsWith(' ')) {
   //       checkWordsIfEqual();
   //       setUserInput('');
   //       setActiveWord(activeWord + 1);
   //    } else {
   //       setUserInput(value);
   //    }
   // };

   return (
      <div className="xl:max-w-6xl mx-auto font-poppins">
         <UserSelectPallete />
         <div className="flex items-center mt-16 justify-between sm:px-10">
            {/* Time display */}
            <div className="text-2xl font-medium font-poppins text-emerald-400">
               {/* <Timer /> */}
            </div>
            <div className="flex items-center justify-center gap-x-3 lowercase tracking-widest">
               <MdLanguage />
               <p className="cursor-pointer">english</p>
            </div>
         </div>

         <TextArea text={text} activeWord={activeWord} />

         <div className="pt-8 flex items-center justify-center space-x-4">
            {/* <input
               type={userInput}
               // ref={inputRef}
               // onBlur={focus()}
               autoFocus
               className="w-[50rem] focus:outline-none px-5 py-5 rounded-lg text-lg text-black"
               onChange={(e) => {
                  processInput(e.target.value);
               }}
               // onKeyDown={(e) => console.log(e.key)}
               value={userInput}
               disabled={disabledInput}
            /> */}
            <BsArrowRepeat
               className="hover:rotate-180 transition-all duration-500 ease-out cursor-pointer active:scale-150 active:text-green-300"
               size={30}
               onClick={(e) => {
                  router.reload();
               }}
            />
         </div>
      </div>
   );
};

export default HomePage;
