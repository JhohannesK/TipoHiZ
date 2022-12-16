import React from 'react';
import { FaUserAlt } from 'react-icons/fa';

// REVIEW: Change font-style and add some few things to it.

const Header = () => {
   return (
      <div className="flex items-center justify-between p-7 sm:px-32 ">
         <div className="flex items-center justify-center gap-x-5">
            <p className="font-bold text-xl text-emerald-400 select-none">
               TipoHiz.__
            </p>
         </div>
         <div className="flex items-center justify-center gap-x-7">
            <FaUserAlt className="text-gray-400" />
            <p className=" text-sm tracking-wide">username</p>
         </div>
      </div>
   );
};

export default Header;
