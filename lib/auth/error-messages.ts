import { isAPIError } from 'better-auth/api';

const INVALID_CREDENTIALS =
   'Invalid email or password. Check your credentials and try again.';

/** Better Auth / OAuth codes → user-facing copy. */
const AUTH_ERROR_BY_CODE: Record<string, string> = {
   INVALID_EMAIL_OR_PASSWORD: INVALID_CREDENTIALS,
   INVALID_PASSWORD: INVALID_CREDENTIALS,
   INVALID_EMAIL: 'Enter a valid email address.',
   USER_NOT_FOUND:
      'No account found for that email. Check the email or sign up.',
   EMAIL_NOT_VERIFIED: 'Verify your email before signing in.',
   USER_ALREADY_EXISTS: 'An account with this email already exists.',
   USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
      'An account with this email already exists. Try another email.',
   CREDENTIAL_ACCOUNT_NOT_FOUND: INVALID_CREDENTIALS,
   PASSWORD_TOO_SHORT: 'Password is too short.',
   PASSWORD_TOO_LONG: 'Password is too long.',
   ACCOUNT_NOT_FOUND: 'No account found. Try another sign-in method.',
   SESSION_EXPIRED: 'Your session expired. Sign in again.',
   TOO_MANY_REQUESTS: 'Too many attempts. Try again later.',
   unable_to_link_account:
      'This sign-in could not be linked. Use the original login method.',
   email_does_not_match: 'The provider email does not match this account.',
   email_not_found: 'The provider did not return a verified email.',
   email_not_verified: 'The provider email is not verified.',
   account_not_linked:
      'This account is not linked. Sign in with the original method.',
   access_denied: 'Sign-in was cancelled.',
};

const AUTH_ERROR_BY_MESSAGE: Record<string, string> = {
   'user not found': AUTH_ERROR_BY_CODE.USER_NOT_FOUND,
   'invalid email or password': INVALID_CREDENTIALS,
   'invalid password': INVALID_CREDENTIALS,
   'invalid email': AUTH_ERROR_BY_CODE.INVALID_EMAIL,
   'email not verified': AUTH_ERROR_BY_CODE.EMAIL_NOT_VERIFIED,
   'user already exists.': AUTH_ERROR_BY_CODE.USER_ALREADY_EXISTS,
   'user already exists. use another email.':
      AUTH_ERROR_BY_CODE.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL,
};

function lookupAuthError(value: string): string | undefined {
   const trimmed = value.trim();
   if (!trimmed) return undefined;

   return (
      AUTH_ERROR_BY_CODE[trimmed] ??
      AUTH_ERROR_BY_CODE[trimmed.toUpperCase()] ??
      AUTH_ERROR_BY_CODE[trimmed.toLowerCase()] ??
      AUTH_ERROR_BY_MESSAGE[trimmed.toLowerCase()]
   );
}

/** Map a query-param / code string from Better Auth redirects. */
export function formatAuthErrorCode(
   code: string | undefined
): string | undefined {
   if (!code) return undefined;
   return (
      lookupAuthError(code) ??
      'Sign-in failed. Try again or use another method.'
   );
}

function authErrorCode(error: {
   body?: unknown;
   message?: string;
}): string | undefined {
   const body = error.body;
   if (body && typeof body === 'object' && 'code' in body) {
      const code = (body as { code?: unknown }).code;
      if (typeof code === 'string') return code;
   }
   return undefined;
}

function authErrorMessage(error: {
   body?: unknown;
   message?: string;
}): string | undefined {
   if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
   }
   const body = error.body;
   if (body && typeof body === 'object' && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) return message;
   }
   return undefined;
}

/** Map a thrown Better Auth / better-call APIError to UI copy. */
export function mapBetterAuthError(error: unknown): string | undefined {
   if (!isAPIError(error)) return undefined;

   const code = authErrorCode(error);
   const fromCode = code ? lookupAuthError(code) : undefined;
   if (fromCode) return fromCode;

   const message = authErrorMessage(error);
   const fromMessage = message ? lookupAuthError(message) : undefined;
   if (fromMessage) return fromMessage;

   return 'Something went wrong. Please try again.';
}
