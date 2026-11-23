import { redirect } from 'next/navigation';
import { formatAuthErrorCode } from './error-messages';

/**
 * Cookie proxy is optimistic. Login and register still confirm the
 * session on the server before rendering guest auth UI.
 */
export function redirectHomeIfAuthenticated(session: unknown): void {
   if (session) {
      redirect('/');
   }
}

export function firstSearchParam(
   value: string | string[] | undefined
): string | undefined {
   if (Array.isArray(value)) return value[0];
   return value;
}

/** Better Auth OAuth failures land on /login?error=…; keep the first code. */
export function loginErrorFromSearchParams(
   error: string | string[] | undefined
): string | undefined {
   return formatAuthErrorCode(firstSearchParam(error));
}
