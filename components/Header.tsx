import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { SvgRender } from './SvgRender';

function Header() {
   return (
      <div className="flex items-center justify-between p-7">
         <div className="flex items-center justify-center gap-x-2">
            <SvgRender />
            <p className="text-xl font-bold select-none text-input hover:animate-shake">
               TipoHiz.__
            </p>
         </div>
         <div className="flex items-center justify-center p-2 px-2 rounded-full gap-x-5 bg-foreground">
            <FaUserAlt className="text-input" />
            <p className="text-sm tracking-wide text-input">Login</p>
         </div>
      </div>
   );
}

export default Header;
