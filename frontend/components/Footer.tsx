import Link from 'next/link';
import React from 'react';

const Footer = () => {
   return (
      <div className="pb-[58px] pt-16 flex items-center justify-center">
         <div>
            <pre className="text-emerald-500 text-sm"> {`\<TipoHiZ/\>`} </pre>
         </div>
         <div>
            <p>
               Contribute on{' '}
               <Link href="https://github.com/TipoHiZ">Github</Link>
            </p>
         </div>
      </div>
   );
};

export default Footer;

// TODO: Add social links
