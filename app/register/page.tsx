import React from 'react';
import { register } from '@/actions/user';
import AuthForm from '@/components/auth-form';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

async function RegisterPage() {
   const session = await getServerSession();

   if (session) {
      redirect('/');
   }

   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="register" action={register} />
      </main>
   );
}

export default RegisterPage;
