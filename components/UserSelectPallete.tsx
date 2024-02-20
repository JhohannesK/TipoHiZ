'use client';

import React, { useState } from 'react';
import Constants from '../modules/_constants';
import { userConfigStore } from '../store';
import { setCategory, setType } from '../store/actions/ConfigActions';
import { setDefaultTime } from '../store/actions/TimeActions';
import { AiTwotoneSetting } from 'react-icons/ai';
import Chip from './UI/Chip';
import { resetTest } from '@/helpers/reset';

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
               break;
            case 'type':
               setType(target.value);
               break;
            case 'category':
               setCategory(target.value);
               break;
         }
      }
   };

   return (
      <div className="flex items-center justify-center text-xl w-full pt-3">
         <div className="items-center justify-center hidden px-3 py-2 space-x-2 rounded-md sm:flex bg-foreground text-input ">
            {Object.entries(options).map(([option, choices]) => (
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
            ))}
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
                     ? `flex absolute top-8 w-[11rem] bg-foreground text-input opacity-80 px-5 py-4 rounded-xl z-10 flex-col gap-4`
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
