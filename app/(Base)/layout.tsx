import React from 'react';
import AuthSessionProvider from '@/lib/providers/session-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default async function BaseLayout({
   children,
}: React.PropsWithChildren) {
   return (
      <AuthSessionProvider>
         <div className="container flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
         </div>
      </AuthSessionProvider>
   );
}
