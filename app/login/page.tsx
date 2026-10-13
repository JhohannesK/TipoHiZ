import React from 'react';
import { login } from '@/actions/user';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth-form';
import { formatAuthErrorCode } from '@/lib/auth/error-messages';

export const dynamic = 'force-dynamic';

function firstParam(value: string | string[] | undefined): string | undefined {
   if (Array.isArray(value)) return value[0];
   return value;
}

async function Login({
   searchParams,
}: {
   searchParams: Promise<{ error?: string | string[] }>;
}) {
   const session = await getServerSession();

   if (session) {
      redirect('/');
   }

   const params = await searchParams;
   const error = formatAuthErrorCode(firstParam(params.error));

   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="login" action={login} error={error} />
      </main>
   );
}

export default Login;
