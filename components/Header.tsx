import React from 'react';
import { FaUserAlt } from 'react-icons/fa';

// REVIEW: Change font-style and add some few things to it.

function Header() {
   return (
      <div className="flex items-center justify-between p-7">
         <div className="flex items-center justify-center gap-x-5">
            <p className="text-xl font-bold select-none text-input hover:animate-shake">
               TipoHiz.__
            </p>
         </div>
         <div className="flex items-center justify-center gap-x-7">
            <FaUserAlt className="text-input" />
            <p className="text-sm tracking-wide text-input">username</p>
         </div>
      </div>
   );
}

export default Header;
