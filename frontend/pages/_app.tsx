import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { Inconsolata } from 'next/font/google';

const inter = Inconsolata({ weight: '400', subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <main className={inter.className}>
         <Component {...pageProps} />;
      </main>
   );
}

export default MyApp;
