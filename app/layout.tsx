import React from 'react';
import { Metadata } from 'next';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Inconsolata } from 'next/font/google';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import Head from 'next/head';
import { THEMES } from '@/components/expo/theme.constant';
import { Toaster } from '@/components/ui/toaster';

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
            <Toaster />
            <ThemeProvider
               attribute="class"
               defaultTheme="dark-gray"
               enableSystem
               disableTransitionOnChange
               themes={THEMES}
            >
               {children}
            </ThemeProvider>
         </body>
      </html>
   );
}
