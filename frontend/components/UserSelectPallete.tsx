import React from 'react';
import Constants from '../modules/_constants';

const UserSelectPallete = () => {
   const { options } = Constants;

   const handleOption = ({ target }: React.MouseEvent<HTMLButtonElement>) => {
      console.log(target);
      if (target instanceof HTMLButtonElement) {
         console.log(target.dataset.option);
      }
   };

   return (
      <div className="w-full pt-3 flex items-center justify-center">
         <div className="flex items-center justify-center space-x-2 bg-slate-900 px-3 py-2 rounded-md">
            {Object.entries(options).map(([option, choices]) => (
               <div
                  key={option}
                  className="flex items-center justify-center space-x-2"
               >
                  {choices.map((choice, index) => (
                     <button
                        value={choice}
                        key={index}
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
