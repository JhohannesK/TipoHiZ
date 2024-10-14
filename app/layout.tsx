import React from 'react';
import { Metadata } from 'next';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Inconsolata } from 'next/font/google';
import { ThemeProvider } from '@/helpers/lib/theme-provider';
import Head from 'next/head';
import { SettingsProvider } from '@/components/UI/settings-context';

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
         <Head>
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
         </Head>
         <Analytics />
         <body
            className={`min-h-screen bg-background text-foreground font-sans antialiased ${font.variable}`}
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
                  'dark-gray',
                  'midnight-blue',
                  'ocean',
                  'girly',
                  'retro',
                  'sunshine',
                  'hacktoberfest',
                  'cyberpunk',
               ]}
            >
               <SettingsProvider>
                  {children}
               </SettingsProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
