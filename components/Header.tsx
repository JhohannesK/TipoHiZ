'use client';
import React, { useState } from 'react';
import { LuUser, LuMenu, LuX } from 'react-icons/lu';
import { SvgRender } from './SvgRender';

function Header() {
   const [menuOpen, setMenuOpen] = useState(false);

   const toggleMenu = () => {
      setMenuOpen(!menuOpen);
   };

   return (
      <div className="flex items-center justify-between p-7">
         <div className="flex items-center justify-center gap-x-2">
            <SvgRender />
            <p className="text-xl font-bold select-none text-input hover:animate-shake">
               TipoHiz.__
            </p>
         </div>
         <div className="md:hidden flex items-center text-input z-30">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
               {menuOpen ? (
                  <LuX className="text-2xl text-foreground" />
               ) : (
                  <LuMenu className="text-2xl" />
               )}
            </button>
         </div>

         <div className="hidden md:flex justify-between items-center gap-3 font-semibold">
            <div className="flex items-center justify-center p-2 rounded-xl gap-3 cursor-pointer text-foreground bg-input">
               <p className="text-sm tracking-wide text-background">Login</p>
               <LuUser className="text-background" />
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl bg-foreground gap-3 cursor-pointer">
               <p className="text-sm tracking-wide text-input">Sign up</p>
               <LuUser className="text-input" />
            </div>
         </div>

         {menuOpen && (
            <div className="absolute top-0 right-0 bg-input rounded-lg p-4 shadow-lg md:hidden w-full z-20 pt-14">
               <div className="flex flex-col  gap-3">
                  <div className="flex  p-2 rounded-xl gap-3 cursor-pointer text-foreground bg-input">
                     <p className="text-sm tracking-wide text-background">
                        Login
                     </p>
                     <LuUser className="text-background" />
                  </div>
                  <div className="flex p-2 rounded-xl bg-foreground gap-3 cursor-pointer">
                     <p className="text-sm tracking-wide text-input">Sign up</p>
                     <LuUser className="text-input" />
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Header;
