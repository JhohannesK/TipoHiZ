import Link from 'next/link';
import React from 'react';

const Footer = () => {
   return (
      <div className="pb-[58px] pt-16 flex items-center space-x-2 justify-center">
         <div>
            <p>Contribute on Github</p>
         </div>
         <div>
            <p className="text-emerald-500 text-sm">
               <Link href="https://github.com/TipoHiZ">{`\<TipoHiZ/\>`}</Link>
            </p>
         </div>
      </div>
   );
};

export default Footer;

// TODO: Add social links
