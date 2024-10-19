import Link from 'next/link';
import React from 'react';
import Chip from './UI/Chip';
import { AiOutlineBranches } from 'react-icons/ai';
import { SiAdguard } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';
import { FaDiscord } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

function Footer() {
   return (
      <div className="flex flex-col items-center justify-center w-full gap-8 border-t-2 border-input text-input">
         <div className="flex items-center justify-center gap-3 mt-3">
            <Chip className="bg-foreground text-input" name="tab" /> +{' '}
            <Chip className="bg-foreground text-input" name="enter" /> to reset
            test
         </div>
         <div className="pb-[58px] w-full flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-2 justify-between sm:px-4">
            <div>
               <p className="flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
                  Contribute on Github{' '}
                  <span className="text-sm text-primary">
                     <Link
                        tabIndex={-1}
                        aria-label="Link to TipoHiZ on GitHub"
                        className="font-bold"
                        href="https://github.com/JhohannesK/TipoHiZ"
                     >{`\<TipoHiZ/\>`}</Link>
                  </span>
               </p>
               <p>Follow us on</p>
               <div className="flex items-center gap-2">
                  <a href="https://github.com/JhohannesK">
                     <FaGithub />
                  </a>
                  <a href="https://discord.gg/8Z67Fv8z">
                     <FaDiscord />
                  </a>
                  <a href="#">
                     <FaXTwitter />
                  </a>
               </div>
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <AiOutlineBranches />
                  <div>v0.0.2</div>
               </div>
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <SiAdguard />
                  <div className="text-center sm:text-left">
                     Privacy policy and terms of use
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Footer;
