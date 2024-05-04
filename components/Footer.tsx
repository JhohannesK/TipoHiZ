import Link from 'next/link';
import React from 'react';
import Chip from './UI/Chip';

function Footer() {
   return (
      <div className="flex flex-col items-center justify-center w-full gap-8 text-input">
         <div className="flex items-center justify-center gap-3">
            <Chip className="bg-foreground text-input" name="tab" /> +{' '}
            <Chip className="bg-foreground text-input" name="enter" /> to reset
            test
         </div>
         <div className="pb-[58px] flex items-center gap-2 justify-center">
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
            </div>
         </div>
      </div>
   );
}

export default Footer;

// TODO: Add social links
