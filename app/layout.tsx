import React from 'react';
import { Metadata } from 'next';
import '@/styles/globals.css';

import { Inconsolata } from 'next/font/google';
import { ThemeProvider } from '@/helpers/lib/theme-provider';
import KeydownGetter from '@/helpers/lib/KeydownGetter';

const font = Inconsolata({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
   title: {
      default: 'TipoHiz',
      template: `%s | TipoHiz`,
   },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
   return (
      <html lang="en" suppressHydrationWarning>
         <head />
         <body
            className={`min-h-screen bg-background font-sans antialiased ${font.variable}`}
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
               themes={[
                  'light',
                  'dark',
                  'light-orange',
                  'dark-orange',
                  'light-green',
                  'dark-green',
               ]}
            >
               <KeydownGetter>{children}</KeydownGetter>
            </ThemeProvider>
         </body>
      </html>
   );
}
