import React from 'react';
import { register } from '@/actions/user';
import AuthForm from '@/components/auth-form';
import { getServerSession } from '@/lib/auth/session';
import { redirectHomeIfAuthenticated } from '@/lib/auth/guest-page';

export const dynamic = 'force-dynamic';

async function RegisterPage() {
   redirectHomeIfAuthenticated(await getServerSession());

   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="register" action={register} />
      </main>
   );
}

export default RegisterPage;
