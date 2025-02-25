import React from 'react';
import { register } from '@/actions/user';
import AuthForm from '@/components/auth-form';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

async function Login() {
   const session = await auth();

   if (session) {
      redirect('/');
   }

   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="register" action={register} />
      </main>
   );
}

export default Login;
