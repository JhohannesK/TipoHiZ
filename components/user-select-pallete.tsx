'use client';

import React, { Fragment, useState } from 'react';
import Constants from '../modules/_constants';
import { userConfigStore } from '../store';
import {
   setCategory,
   setType,
   setWordCount,
} from '../store/actions/ConfigActions';
import { resetStates, setDefaultTime } from '../store/actions/TimeActions';
import { AiTwotoneSetting } from 'react-icons/ai';
import { resetTest } from '@/lib/reset';
import Chip from './ui/chip';

const UserSelectPallete = ({
   reset,
   hidden = false,
}: {
   reset: () => void;
   hidden?: boolean;
}) => {
   const [open, setOpen] = useState(false);
   const { options } = Constants;
   const time = userConfigStore((state) => state.time);
   const type = userConfigStore((state) => state.type);
   const category = userConfigStore((state) => state.category);
   const wordCount = userConfigStore((state) => state.wordCount);
   const wordsMode = category === 'words';
   const fixed: { option: string; choices: readonly (string | number)[] }[] = [
      { option: 'type', choices: options.type },
      { option: 'category', choices: options.category },
   ];
   const barClass = hidden ? 'pointer-events-none opacity-0' : 'opacity-100';

   React.useEffect(() => {
      document.querySelector('.type')?.childNodes.forEach((el) => {
         if (el instanceof HTMLButtonElement) el.classList.remove('selected');
      });
      document
         .querySelector(`button[value="${type}"]`)
         ?.classList.add('selected');
   }, [type]);

   React.useEffect(() => {
      document.querySelector('.category')?.childNodes.forEach((el) => {
         if (el instanceof HTMLButtonElement) el.classList.remove('selected');
      });
      document
         .querySelector(`button[value="${category}"]`)
         ?.classList.add('selected');
   }, [category]);

   React.useEffect(() => {
      const group = wordsMode ? 'words' : 'time';
      const selected = wordsMode ? wordCount : time;
      document.querySelectorAll('.time button, .words button').forEach((el) => {
         el.classList.remove('selected');
      });
      document
         .querySelectorAll(`div.${group} button[value="${selected}"]`)
         .forEach((el) => el.classList.add('selected'));
      reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [time, wordCount, wordsMode]);

   const handleOption = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget;
      if (!target.dataset.option) return;

      switch (target.dataset.option) {
         case 'time':
            setDefaultTime(+target.value);
            reset();
            resetStates();
            void resetTest(type, reset);
            break;
         case 'words':
            setWordCount(+target.value);
            reset();
            resetStates();
            void resetTest(type, reset);
            break;
         case 'type':
            reset();
            resetStates();
            setType(target.value);
            break;
         case 'category':
            setCategory(target.value);
            reset();
            resetStates();
            void resetTest(type, reset);
            break;
         default:
            break;
      }
   };

   const renderChoices = (
      option: string,
      choices: readonly (string | number)[],
      vertical: boolean,
      onPick: (event: React.MouseEvent<HTMLButtonElement>) => void
   ) => (
      <div
         className={`${option} flex items-center justify-center ${
            vertical ? 'flex-col gap-2' : 'space-x-2'
         }`}
      >
         {choices.map((choice) => (
            <button
               tabIndex={-1}
               value={choice}
               key={choice}
               data-option={option}
               onClick={onPick}
            >
               {choice}
            </button>
         ))}
      </div>
   );

   const renderCounts = (
      vertical: boolean,
      onPick: (event: React.MouseEvent<HTMLButtonElement>) => void
   ) => {
      const layout = vertical
         ? 'flex flex-col items-center justify-center gap-2'
         : 'flex items-center justify-center space-x-2';
      return (
         <div className="grid">
            <div
               className={`time col-start-1 row-start-1 ${layout} transition-opacity duration-[250ms] ${
                  wordsMode ? 'pointer-events-none opacity-0' : 'opacity-100'
               }`}
               aria-hidden={wordsMode}
               data-active={wordsMode ? 'false' : 'true'}
            >
               {options.time.map((choice) => (
                  <button
                     tabIndex={-1}
                     value={choice}
                     key={choice}
                     data-option="time"
                     onClick={onPick}
                  >
                     {choice}
                  </button>
               ))}
            </div>
            <div
               className={`words col-start-1 row-start-1 ${layout} transition-opacity duration-[250ms] ${
                  wordsMode ? 'opacity-100' : 'pointer-events-none opacity-0'
               }`}
               aria-hidden={!wordsMode}
               data-active={wordsMode ? 'true' : 'false'}
            >
               {options.words.map((choice) => (
                  <button
                     tabIndex={-1}
                     value={choice}
                     key={choice}
                     data-option="words"
                     onClick={onPick}
                  >
                     {choice}
                  </button>
               ))}
            </div>
         </div>
      );
   };

   return (
      <div className="flex items-center justify-center w-full pt-3 text-xl">
         <div
            data-testid="config-bar"
            className={`items-center justify-center hidden px-3 py-2 space-x-2 rounded-md sm:flex bg-foreground text-input transition-opacity duration-[250ms] ${barClass}`}
         >
            {fixed.map((group, optionIndex) => (
               <Fragment key={group.option}>
                  {renderChoices(
                     group.option,
                     group.choices,
                     false,
                     handleOption
                  )}
                  {optionIndex < fixed.length - 1 && (
                     <span className="text-[2rem]">|</span>
                  )}
               </Fragment>
            ))}
            <span className="text-[2rem]">|</span>
            {renderCounts(false, handleOption)}
         </div>
         <div
            data-testid="config-bar"
            className={`relative flex sm:hidden transition-opacity duration-[250ms] ${barClass}`}
         >
            <Chip
               onClick={() => setOpen(!open)}
               name="Test settings"
               className="relative px-5 bg-foreground text-input"
               icon={<AiTwotoneSetting />}
            />
            <div
               className={
                  open && !hidden
                     ? `flex absolute top-8 w-[11rem] bg-foreground text-input opacity-95 px-5 py-4 rounded-xl z-10 flex-col gap-4`
                     : 'hidden'
               }
            >
               {fixed.map((group) => (
                  <Fragment key={group.option}>
                     {renderChoices(
                        group.option,
                        group.choices,
                        true,
                        (event) => {
                           handleOption(event);
                           setOpen(false);
                        }
                     )}
                  </Fragment>
               ))}
               {renderCounts(true, (event) => {
                  handleOption(event);
                  setOpen(false);
               })}
            </div>
         </div>
      </div>
   );
};

export default UserSelectPallete;
