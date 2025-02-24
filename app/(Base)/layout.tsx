import React from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import AuthSessionProvider from '@/lib/providers/session-provider';

export default async function BaseLayout({
   children,
}: React.PropsWithChildren) {
   return (
      <AuthSessionProvider>
         <div className="flex min-h-screen flex-col container">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
         </div>
      </AuthSessionProvider>
   );
}
