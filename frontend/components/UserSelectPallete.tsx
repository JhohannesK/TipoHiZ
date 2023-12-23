import React from 'react';
import Constants from '../modules/_constants';
import { userConfigStore } from '../store';
import { setCategory, setType } from '../store/actions/ConfigActions';
import { setTime } from '../store/actions/TimeActions';

const UserSelectPallete = () => {
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
               setTime(+target.value);
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
      <div className="w-full pt-3 flex items-center justify-center">
         <div className="flex items-center justify-center space-x-2 bg-slate-900 px-3 py-2 rounded-md">
            {Object.entries(options).map(([option, choices]) => (
               <div
                  key={option}
                  className={`${option} flex items-center justify-center space-x-2`}
               >
                  {choices.map((choice, index) => (
                     <button
                        value={choice}
                        key={index}
                        className={``}
                        data-option={option}
                        onClick={(e) => handleOption(e)}
                     >
                        {choice}
                     </button>
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
};

export default UserSelectPallete;
