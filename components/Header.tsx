'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuUser, LuMenu, LuX } from 'react-icons/lu';
import { SvgRender } from './SvgRender';
import Settings from './settings';

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
            <Settings />
         </div>

         <div className="z-30 flex items-center md:hidden text-input">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
               {menuOpen ? (
                  <LuX className="text-2xl text-background" />
               ) : (
                  <LuMenu className="text-2xl" />
               )}
            </button>
         </div>

         <div className="flex items-center justify-between gap-3 font-semibold">
            <Link
               href="/login"
               className="flex items-center justify-center gap-3 p-2 cursor-pointer rounded-xl text-foreground bg-input"
            >
               <p className="text-sm tracking-wide text-background">Login</p>
               <LuUser className="text-background" />
            </Link>
            <Link
               href="/register"
               className="flex items-center justify-center gap-3 p-2 cursor-pointer rounded-xl bg-foreground"
            >
               <p className="text-sm tracking-wide text-input">Sign up</p>
               <LuUser className="text-input" />
            </Link>
         </div>

         {menuOpen && (
            <div className="absolute top-0 right-0 z-20 w-full p-4 rounded-lg shadow-lg bg-input md:hidden pt-14">
               <div className="flex flex-col gap-3">
                  <div className="flex gap-3 p-2 cursor-pointer rounded-xl text-foreground bg-input">
                     <p className="text-sm tracking-wide text-background">
                        Login
                     </p>
                     <LuUser className="text-background" />
                  </div>
                  <div className="flex gap-3 p-2 cursor-pointer rounded-xl bg-background">
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
