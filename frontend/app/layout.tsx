import { Metadata } from 'next';
import '@/styles/globals.css';

import { Inconsolata } from 'next/font/google';

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
            {children}
         </body>
      </html>
   );
}
