import { describe, expect, it } from 'vitest';
import { formatAuthErrorCode, mapBetterAuthError } from './error-messages';

describe('formatAuthErrorCode', () => {
   it('should map USER_NOT_FOUND to a clear account message', () => {
      expect(formatAuthErrorCode('USER_NOT_FOUND')).toBe(
         'No account found for that email. Check the email or sign up.'
      );
   });

   it('should map invalid credentials codes', () => {
      expect(formatAuthErrorCode('INVALID_EMAIL_OR_PASSWORD')).toMatch(
         /Invalid email or password/
      );
   });

   it('should keep oauth snake_case mappings', () => {
      expect(formatAuthErrorCode('access_denied')).toBe(
         'Sign-in was cancelled.'
      );
   });

   it('should fall back for unknown codes without exposing them', () => {
      expect(formatAuthErrorCode('SOME_WEIRD_CODE')).toBe(
         'Sign-in failed. Try again or use another method.'
      );
   });
});

describe('mapBetterAuthError', () => {
   it('should map APIError-shaped objects via code', () => {
      const error = {
         name: 'APIError',
         message: 'User not found',
         body: { code: 'USER_NOT_FOUND', message: 'User not found' },
      };
      expect(mapBetterAuthError(error)).toBe(
         'No account found for that email. Check the email or sign up.'
      );
   });

   it('should map by message when code is missing', () => {
      const error = {
         name: 'APIError',
         message: 'Invalid email or password',
         body: { message: 'Invalid email or password' },
      };
      expect(mapBetterAuthError(error)).toMatch(/Invalid email or password/);
   });

   it('should return undefined for non-API errors', () => {
      expect(mapBetterAuthError(new Error('boom'))).toBeUndefined();
   });
});
