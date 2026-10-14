import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ResultSync from '@/components/result-sync';

export default async function BaseLayout({
   children,
}: React.PropsWithChildren) {
   return (
      <div className="container flex flex-col min-h-screen">
         <Header />
         <ResultSync />
         <main className="flex-1">{children}</main>
         <Footer />
      </div>
   );
}
