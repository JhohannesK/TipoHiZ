import React from 'react';
import { login } from '@/actions/user';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth-form';

async function Login() {
   const session = await auth();

   if (session) {
      redirect('/');
   }
   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="login" action={login} />
      </main>
   );
}

export default Login;
