import { describe, expect, it } from 'vitest';
import {
   INVALID_CREDENTIALS_MESSAGE,
   formatAuthErrorCode,
   isDuplicateSignUpError,
   mapBetterAuthError,
   resolveRegisterAuthFailure,
} from './error-messages';

const CREDENTIAL_FAILURE_CODES = [
   'USER_NOT_FOUND',
   'INVALID_PASSWORD',
   'CREDENTIAL_ACCOUNT_NOT_FOUND',
   'INVALID_EMAIL_OR_PASSWORD',
   'INVALID_USER',
   'USER_EMAIL_NOT_FOUND',
   'ACCOUNT_NOT_FOUND',
] as const;

const CREDENTIAL_FAILURE_MESSAGES = [
   'User not found',
   'Invalid password',
   'Credential account not found',
   'Invalid email or password',
   'Invalid user',
   'User email not found',
   'Account not found',
] as const;

function apiError(input: { code?: string; message?: string }) {
   return {
      name: 'APIError',
      message: input.message ?? input.code ?? '',
      body: {
         ...(input.code ? { code: input.code } : {}),
         ...(input.message ? { message: input.message } : {}),
      },
   };
}

describe('formatAuthErrorCode', () => {
   it.each(CREDENTIAL_FAILURE_CODES)(
      'should map %s to the generic credentials message',
      (code) => {
         expect(formatAuthErrorCode(code)).toBe(INVALID_CREDENTIALS_MESSAGE);
      }
   );

   it('should use one message for every credential failure code', () => {
      const messages = CREDENTIAL_FAILURE_CODES.map((code) =>
         formatAuthErrorCode(code)
      );
      expect(new Set(messages)).toEqual(new Set([INVALID_CREDENTIALS_MESSAGE]));
      expect(INVALID_CREDENTIALS_MESSAGE).toBe('Invalid email or password');
   });

   it('should map lowercase and mixed-case credential codes', () => {
      expect(formatAuthErrorCode('user_not_found')).toBe(
         INVALID_CREDENTIALS_MESSAGE
      );
      expect(formatAuthErrorCode('Invalid_Password')).toBe(
         INVALID_CREDENTIALS_MESSAGE
      );
   });

   it('should keep oauth snake_case mappings', () => {
      expect(formatAuthErrorCode('access_denied')).toBe(
         'Sign-in was cancelled.'
      );
   });

   it.each([
      [
         'unable_to_link_account',
         'This sign-in could not be linked. Use the original login method.',
      ],
      [
         'email_does_not_match',
         'The provider email does not match this account.',
      ],
      ['email_not_found', 'The provider did not return a verified email.'],
      ['email_not_verified', 'The provider email is not verified.'],
      [
         'account_not_linked',
         'This account is not linked. Sign in with the original method.',
      ],
   ] as const)('should map oauth code %s', (code, message) => {
      expect(formatAuthErrorCode(code)).toBe(message);
      expect(message.toLowerCase()).not.toContain('no account');
      expect(message.toLowerCase()).not.toContain('that email');
   });

   it('should map account_not_linked from an APIError code', () => {
      expect(mapBetterAuthError(apiError({ code: 'account_not_linked' }))).toBe(
         'This account is not linked. Sign in with the original method.'
      );
   });

   it('should map email not verified from the message when code is missing', () => {
      expect(
         mapBetterAuthError(apiError({ message: 'email not verified' }))
      ).toBe('Verify your email before signing in.');
   });

   it('should fall back for unknown codes without exposing them', () => {
      expect(formatAuthErrorCode('SOME_WEIRD_CODE')).toBe(
         'Sign-in failed. Try again or use another method.'
      );
   });

   it('should not confirm an existing account for duplicate sign-up codes', () => {
      for (const code of [
         'USER_ALREADY_EXISTS',
         'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
      ]) {
         const message = formatAuthErrorCode(code) ?? '';
         expect(message.toLowerCase()).not.toContain('already');
         expect(message.toLowerCase()).not.toContain('exists');
         expect(message.toLowerCase()).not.toContain('no account');
         expect(message.toLowerCase()).not.toContain('that email');
      }
   });

   it('should map password-reset token errors without naming an account', () => {
      for (const code of ['INVALID_TOKEN', 'TOKEN_EXPIRED']) {
         const message = formatAuthErrorCode(code) ?? '';
         expect(message).toBe('This link is invalid or has expired.');
         expect(message.toLowerCase()).not.toContain('no account');
         expect(message.toLowerCase()).not.toContain('not found');
      }
   });
});

describe('mapBetterAuthError', () => {
   it.each(CREDENTIAL_FAILURE_CODES)(
      'should map APIError code %s to the generic credentials message',
      (code) => {
         expect(
            mapBetterAuthError(
               apiError({
                  code,
                  message: 'No account found for that email',
               })
            )
         ).toBe(INVALID_CREDENTIALS_MESSAGE);
      }
   );

   it.each(CREDENTIAL_FAILURE_MESSAGES)(
      'should map message %s when the code is missing',
      (message) => {
         expect(mapBetterAuthError(apiError({ message }))).toBe(
            INVALID_CREDENTIALS_MESSAGE
         );
      }
   );

   it('should return undefined for non-API errors', () => {
      expect(mapBetterAuthError(new Error('boom'))).toBeUndefined();
   });

   it('should keep a generic fallback for unmapped API errors', () => {
      expect(
         mapBetterAuthError(
            apiError({
               code: 'FAILED_TO_CREATE_SESSION',
               message: 'Failed to create session',
            })
         )
      ).toBe('Something went wrong. Please try again.');
   });
});

describe('resolveRegisterAuthFailure', () => {
   it.each([
      'USER_ALREADY_EXISTS',
      'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
   ] as const)('should report success when sign-up returns %s', (code) => {
      const error = apiError({
         code,
         message: 'User already exists. Use another email.',
      });
      expect(isDuplicateSignUpError(error)).toBe(true);
      expect(resolveRegisterAuthFailure(error)).toEqual({ success: true });
   });

   it('should report success when only the duplicate message is present', () => {
      const error = apiError({ message: 'User already exists.' });
      expect(isDuplicateSignUpError(error)).toBe(true);
      expect(resolveRegisterAuthFailure(error)).toEqual({ success: true });
   });

   it('should report success when the duplicate message has no trailing period', () => {
      const error = apiError({
         message: 'User already exists. Use another email',
      });
      expect(resolveRegisterAuthFailure(error)).toEqual({ success: true });
   });

   it('should still surface unrelated sign-up failures', () => {
      expect(
         resolveRegisterAuthFailure(
            apiError({
               code: 'PASSWORD_TOO_SHORT',
               message: 'Password too short',
            })
         )
      ).toEqual({ error: 'Password is too short.' });
   });

   it('should not treat a plain Error as a duplicate account', () => {
      expect(isDuplicateSignUpError(new Error('User already exists.'))).toBe(
         false
      );
      expect(
         resolveRegisterAuthFailure(new Error('User already exists.'))
      ).toEqual({ error: 'Something went wrong. Please try again.' });
   });
});
