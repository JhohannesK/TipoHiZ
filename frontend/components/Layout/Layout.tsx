import React, { PropsWithChildren } from 'react';
import Footer from '../Footer';
import Header from '../Header';

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className=" bg-slate-800 text-gray-400 font-open-sans h-screen 2xl:max-w-7xl mx-auto">
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
