import React from 'react';
import { login } from '@/actions/user';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth-form';

export const dynamic = 'force-dynamic';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
   unable_to_link_account:
      'This sign-in could not be linked. Use the original login method.',
   email_does_not_match: 'The provider email does not match this account.',
   email_not_found: 'The provider did not return a verified email.',
   email_not_verified: 'The provider email is not verified.',
   account_not_linked:
      'This account is not linked. Sign in with the original method.',
   access_denied: 'Sign-in was cancelled.',
};

function firstParam(value: string | string[] | undefined): string | undefined {
   if (Array.isArray(value)) return value[0];
   return value;
}

function formatAuthError(code: string | undefined): string | undefined {
   if (!code) return undefined;
   return (
      AUTH_ERROR_MESSAGES[code] ??
      'Sign-in failed. Try again or use another method.'
   );
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
   const error = formatAuthError(firstParam(params.error));

   return (
      <main className="flex flex-col items-center justify-center w-screen h-screen text-input">
         <AuthForm mode="login" action={login} error={error} />
      </main>
   );
}

export default Login;
