import { isAPIError } from 'better-auth/api';

/**
 * One copy for every credential failure. Unknown emails, wrong passwords,
 * and missing credential accounts must not be distinguishable.
 */
export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

/**
 * Sign-up duplicate. Does not confirm that the email is registered.
 * The register action still returns success for these codes so the
 * response shape matches a new account.
 */
const SIGN_UP_GENERIC =
   'Unable to create an account with those details. Try again.';

const CREDENTIAL_FAILURE_CODES = [
   'INVALID_EMAIL_OR_PASSWORD',
   'INVALID_PASSWORD',
   'USER_NOT_FOUND',
   'INVALID_USER',
   'USER_EMAIL_NOT_FOUND',
   'CREDENTIAL_ACCOUNT_NOT_FOUND',
   'ACCOUNT_NOT_FOUND',
] as const;

/** Better Auth / OAuth codes → user-facing copy. */
const AUTH_ERROR_BY_CODE: Record<string, string> = {
   ...Object.fromEntries(
      CREDENTIAL_FAILURE_CODES.map((code) => [
         code,
         INVALID_CREDENTIALS_MESSAGE,
      ])
   ),
   INVALID_EMAIL: 'Enter a valid email address.',
   EMAIL_NOT_VERIFIED: 'Verify your email before signing in.',
   USER_ALREADY_EXISTS: SIGN_UP_GENERIC,
   USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: SIGN_UP_GENERIC,
   PASSWORD_TOO_SHORT: 'Password is too short.',
   PASSWORD_TOO_LONG: 'Password is too long.',
   SESSION_EXPIRED: 'Your session expired. Sign in again.',
   TOO_MANY_REQUESTS: 'Too many attempts. Try again later.',
   INVALID_TOKEN: 'This link is invalid or has expired.',
   TOKEN_EXPIRED: 'This link is invalid or has expired.',
   unable_to_link_account:
      'This sign-in could not be linked. Use the original login method.',
   email_does_not_match: 'The provider email does not match this account.',
   email_not_found: 'The provider did not return a verified email.',
   email_not_verified: 'The provider email is not verified.',
   account_not_linked:
      'This account is not linked. Sign in with the original method.',
   access_denied: 'Sign-in was cancelled.',
};

const DUPLICATE_SIGN_UP_CODES = new Set([
   'USER_ALREADY_EXISTS',
   'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
]);

const AUTH_ERROR_BY_MESSAGE: Record<string, string> = {
   'user not found': INVALID_CREDENTIALS_MESSAGE,
   'invalid user': INVALID_CREDENTIALS_MESSAGE,
   'user email not found': INVALID_CREDENTIALS_MESSAGE,
   'invalid email or password': INVALID_CREDENTIALS_MESSAGE,
   'invalid password': INVALID_CREDENTIALS_MESSAGE,
   'credential account not found': INVALID_CREDENTIALS_MESSAGE,
   'account not found': INVALID_CREDENTIALS_MESSAGE,
   'invalid email': AUTH_ERROR_BY_CODE.INVALID_EMAIL,
   'email not verified': AUTH_ERROR_BY_CODE.EMAIL_NOT_VERIFIED,
   'user already exists.': SIGN_UP_GENERIC,
   'user already exists. use another email.': SIGN_UP_GENERIC,
   'invalid token': AUTH_ERROR_BY_CODE.INVALID_TOKEN,
   'token expired': AUTH_ERROR_BY_CODE.TOKEN_EXPIRED,
};

const DUPLICATE_SIGN_UP_MESSAGES = new Set([
   'user already exists.',
   'user already exists. use another email.',
]);

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

function normalizedCode(code: string): string {
   return code.trim().toUpperCase();
}

function normalizedMessage(message: string): string {
   return message.trim().toLowerCase();
}

/**
 * True when Better Auth rejected sign-up because the email is taken.
 * With `autoSignIn: false` the API usually returns a synthetic success
 * instead of throwing. This still catches the explicit duplicate codes.
 */
export function isDuplicateSignUpError(error: unknown): boolean {
   if (!isAPIError(error)) return false;

   const code = authErrorCode(error);
   if (code && DUPLICATE_SIGN_UP_CODES.has(normalizedCode(code))) return true;

   const message = authErrorMessage(error);
   if (!message) return false;
   const normalized = normalizedMessage(message);
   if (DUPLICATE_SIGN_UP_MESSAGES.has(normalized)) return true;
   return normalized.replace(/[.!\s]+$/g, '').startsWith('user already exists');
}

/**
 * Sign-up failures that would confirm the email is registered are
 * reported as success. The password is not updated in that case.
 */
export function resolveRegisterAuthFailure(
   error: unknown
): { success: true } | { error: string } {
   if (isDuplicateSignUpError(error)) return { success: true };

   return {
      error:
         mapBetterAuthError(error) ?? 'Something went wrong. Please try again.',
   };
}
