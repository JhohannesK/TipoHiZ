import Link from 'next/link';
import React from 'react';
import Chip from './UI/Chip';
import { AiOutlineBranches } from 'react-icons/ai';
import { SiAdguard } from 'react-icons/si';
import { SocialIcon } from 'react-social-icons'
function Footer() {
   return (
      <div className="flex flex-col items-center justify-center w-full gap-8 border-t-2 text-input">
         <div className="flex items-center justify-center gap-3">
            <Chip className="bg-foreground text-input" name="tab" /> +{' '}
            <Chip className="bg-foreground text-input" name="enter" /> to reset
            test
         </div>
         <div className="pb-[58px] w-full flex items-center gap-2 justify-between">
            <div>
               <p className="flex items-center justify-center gap-2">
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
                  <SocialIcon url="https://twitter.com" />
                  <SocialIcon url="https://discord.com" />
                  <SocialIcon url="https://instagram.com" />
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
                  <div>Privacy policy and terms of use</div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Footer;
