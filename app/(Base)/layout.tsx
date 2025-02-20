import React from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function BaseLayout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex min-h-screen flex-col container">
         <Header />
         <main className="flex-1">{children}</main>
         <Footer />
      </div>
   );
}
