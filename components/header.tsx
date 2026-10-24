'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuUser, LuMenu, LuX } from 'react-icons/lu';
import { SvgRender } from './SvgRender';
import Settings from './settings';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { authClient } from '@/lib/auth-client';

function Header() {
   const [menuOpen, setMenuOpen] = useState(false);
   const router = useRouter();
   const session = authClient.useSession();
   const username = session.data?.user?.name;
   const isAuthenticated = Boolean(session.data?.user);

   const closeMenu = () => {
      setMenuOpen(false);
   };

   const signOut = () => {
      closeMenu();
      void authClient.signOut({
         fetchOptions: {
            onSuccess: () => {
               router.push('/login');
               router.refresh();
            },
         },
      });
   };

   return (
      <header className="relative z-30 flex w-full min-w-0 items-center justify-between gap-2 py-4 md:p-7">
         <div className="flex min-w-0 flex-1 items-center gap-x-2">
            <span className="shrink-0">
               <SvgRender />
            </span>
            <p className="min-w-0 truncate text-lg font-bold select-none text-input hover:animate-shake sm:text-xl">
               TipoHiz.__
            </p>
            <span className="shrink-0">
               <Settings />
            </span>
         </div>

         <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="shrink-0 text-input md:hidden"
         >
            {menuOpen ? (
               <LuX className="text-2xl" />
            ) : (
               <LuMenu className="text-2xl" />
            )}
         </button>

         <nav className="hidden shrink-0 items-center justify-between gap-3 font-semibold md:flex">
            <Link href="/dashboard" className="text-sm text-input">
               Stats
            </Link>
            {isAuthenticated && <p className="text-input">Hi, {username}</p>}
            {!isAuthenticated ? (
               <>
                  <Link
                     href="/login"
                     className="flex items-center justify-center gap-3 p-2 cursor-pointer rounded-xl text-foreground bg-input"
                  >
                     <p className="text-sm tracking-wide text-background">
                        Login
                     </p>
                     <LuUser className="text-background" />
                  </Link>
                  <Link
                     href="/register"
                     className="flex items-center justify-center gap-3 p-2 cursor-pointer rounded-xl bg-foreground"
                  >
                     <p className="text-sm tracking-wide text-input">Sign up</p>
                     <LuUser className="text-input" />
                  </Link>
               </>
            ) : (
               <Button
                  onClick={signOut}
                  className="flex items-center justify-center gap-3 p-2 cursor-pointer rounded-xl text-foreground bg-input"
               >
                  <p className="text-sm tracking-wide text-background">
                     Logout
                  </p>
                  <LogOut className="text-background" />
               </Button>
            )}
         </nav>

         <nav
            id="mobile-nav"
            className={
               menuOpen
                  ? 'absolute left-0 right-0 top-full z-20 flex flex-col gap-3 rounded-lg bg-input p-4 font-semibold shadow-lg md:hidden'
                  : 'hidden'
            }
         >
            <Link
               href="/dashboard"
               onClick={closeMenu}
               className="text-sm text-background"
            >
               Stats
            </Link>
            {isAuthenticated && (
               <p className="truncate text-background">Hi, {username}</p>
            )}
            {!isAuthenticated ? (
               <>
                  <Link
                     href="/login"
                     onClick={closeMenu}
                     className="flex items-center gap-3 rounded-xl bg-background p-2"
                  >
                     <p className="text-sm tracking-wide text-input">Login</p>
                     <LuUser className="text-input" />
                  </Link>
                  <Link
                     href="/register"
                     onClick={closeMenu}
                     className="flex items-center gap-3 rounded-xl bg-foreground p-2"
                  >
                     <p className="text-sm tracking-wide text-input">Sign up</p>
                     <LuUser className="text-input" />
                  </Link>
               </>
            ) : (
               <Button
                  onClick={signOut}
                  className="flex items-center justify-center gap-3 rounded-xl bg-background p-2 text-input"
               >
                  <p className="text-sm tracking-wide text-input">Logout</p>
                  <LogOut className="text-input" />
               </Button>
            )}
         </nav>
      </header>
   );
}

export default Header;
