import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { Inconsolata } from 'next/font/google';

const font = Inconsolata({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <main className={font.className}>
         <Component {...pageProps} />;
      </main>
   );
}

export default MyApp;
