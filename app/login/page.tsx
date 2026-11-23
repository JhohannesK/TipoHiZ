import React from 'react';
import { login } from '@/actions/user';
import { getServerSession } from '@/lib/auth/session';
import {
   loginErrorFromSearchParams,
   redirectHomeIfAuthenticated,
} from '@/lib/auth/guest-page';
import AuthForm from '@/components/auth-form';

export const dynamic = 'force-dynamic';

async function Login({
   searchParams,
}: {
   searchParams: Promise<{ error?: string | string[] }>;
}) {
   redirectHomeIfAuthenticated(await getServerSession());

   const params = await searchParams;
   const error = loginErrorFromSearchParams(params.error);

   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="login" action={login} error={error} />
      </main>
   );
}

export default Login;
