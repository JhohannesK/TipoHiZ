import React from 'react';
import { LuUser } from "react-icons/lu";
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
         <div className='flex justify-between items-center gap-3 font-semibold '>
            <div className="flex items-center justify-center p-2 rounded-xl bg-foreground gap-3 cursor-pointer text-black bg-slate-100">
               <p className="text-sm tracking-wide">Login</p>
               <LuUser />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-foreground gap-3 cursor-pointer text-white">
               <p className="text-sm tracking-wide">Sign up</p>
               <LuUser  />
            </div>
         </div>

      </div>
   );
}

export default Header;
