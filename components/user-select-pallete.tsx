'use client';

import React, { useState } from 'react';
import Constants from '../modules/_constants';
import { userConfigStore } from '../store';
import { setCategory, setType } from '../store/actions/ConfigActions';
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

   React.useEffect(() => {
      document.querySelector('.time')?.childNodes.forEach((el) => {
         if (el instanceof HTMLButtonElement) el.classList.remove('selected');
      });
      document
         .querySelector(`button[value="${time}"]`)
         ?.classList.add('selected');
      reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [time]);

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

   const handleOption = ({ target }: React.MouseEvent<HTMLButtonElement>) => {
      if (target instanceof HTMLButtonElement && target.dataset.option) {
         switch (target.dataset.option) {
            case 'time':
               setDefaultTime(+target.value);
               resetTest(type, reset);
               reset();
               resetStates();
               break;
            case 'type':
               reset();
               resetStates();
               setType(target.value);
               break;
            case 'category':
               reset();
               resetStates();
               setCategory(target.value);
               break;
         }
      }
   };

   return (
      <div className="flex items-center justify-center w-full pt-3 text-xl">
         <div className="items-center justify-center hidden px-3 py-2 space-x-2 rounded-md sm:flex bg-foreground text-input ">
            {Object.entries(options).map(
               ([option, choices], optionIndex, entries) => (
                  <>
                     <div
                        key={option}
                        className={`${option} flex items-center justify-center space-x-2`}
                     >
                        {choices.map((choice, index) => {
                           return (
                              <button
                                 tabIndex={-1}
                                 value={choice}
                                 key={index}
                                 data-option={option}
                                 onClick={(e) => handleOption(e)}
                              >
                                 {choice}
                              </button>
                           );
                        })}
                     </div>
                     {optionIndex < entries.length - 1 && (
                        <span className="text-[2rem]">|</span>
                     )}
                  </>
               )
            )}
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
               {Object.entries(options).map(([option, choices]) => (
                  <div
                     key={option}
                     className={`${option} flex flex-col items-center justify-center gap-2`}
                  >
                     {choices.map((choice, index) => {
                        return (
                           <button
                              value={choice}
                              key={index}
                              data-option={option}
                              onClick={(e) => {
                                 handleOption(e);
                                 setOpen(false);
                              }}
                           >
                              {choice}
                           </button>
                        );
                     })}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default UserSelectPallete;
