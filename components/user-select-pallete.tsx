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

const UserSelectPallete = ({ reset }: { reset: () => void }) => {
   const [open, setOpen] = useState(false);
   const { options } = Constants;
   const time = userConfigStore((state) => state.time);
   const type = userConfigStore((state) => state.type);
   const category = userConfigStore((state) => state.category);
   const wordCount = userConfigStore((state) => state.wordCount);
   const wordsMode = category === 'words';
   const groups: { option: string; choices: readonly (string | number)[] }[] = [
      { option: 'type', choices: options.type },
      { option: 'category', choices: options.category },
      wordsMode
         ? { option: 'words', choices: options.words }
         : { option: 'time', choices: options.time },
   ];

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

   const renderGroups = (
      onPick: (event: React.MouseEvent<HTMLButtonElement>) => void
   ) =>
      groups.map((group, optionIndex) => (
         <Fragment key={group.option}>
            <div
               className={`${group.option} flex items-center justify-center space-x-2`}
            >
               {group.choices.map((choice) => (
                  <button
                     tabIndex={-1}
                     value={choice}
                     key={choice}
                     data-option={group.option}
                     onClick={onPick}
                  >
                     {choice}
                  </button>
               ))}
            </div>
            {optionIndex < groups.length - 1 && (
               <span className="text-[2rem]">|</span>
            )}
         </Fragment>
      ));

   return (
      <div className="flex items-center justify-center w-full pt-3 text-xl">
         <div className="items-center justify-center hidden px-3 py-2 space-x-2 rounded-md sm:flex bg-foreground text-input ">
            {renderGroups(handleOption)}
         </div>
         <div className="relative flex sm:hidden">
            <Chip
               onClick={() => setOpen(!open)}
               name="Test settings"
               className="relative px-5 bg-foreground text-input"
               icon={<AiTwotoneSetting />}
            />
            <div
               className={
                  open
                     ? `flex absolute top-8 w-[11rem] bg-foreground text-input opacity-95 px-5 py-4 rounded-xl z-10 flex-col gap-4`
                     : 'hidden'
               }
            >
               {groups.map((group) => (
                  <div
                     key={group.option}
                     className={`${group.option} flex flex-col items-center justify-center gap-2`}
                  >
                     {group.choices.map((choice) => (
                        <button
                           value={choice}
                           key={choice}
                           data-option={group.option}
                           onClick={(event) => {
                              handleOption(event);
                              setOpen(false);
                           }}
                        >
                           {choice}
                        </button>
                     ))}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default UserSelectPallete;
