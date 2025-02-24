import React from 'react';
import { SessionProvider } from 'next-auth/react';

const AuthSessionProvider = ({ children }: { children: React.ReactNode }) => {
   return <SessionProvider>{children}</SessionProvider>;
};

export default AuthSessionProvider;
