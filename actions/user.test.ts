// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INVALID_CREDENTIALS_MESSAGE } from '@/lib/auth/error-messages';

const { signInEmail, signUpEmail } = vi.hoisted(() => ({
   signInEmail: vi.fn(),
   signUpEmail: vi.fn(),
}));

vi.mock('@/auth', () => ({
   getAuth: () => ({
      api: {
         signInEmail,
         signUpEmail,
      },
   }),
}));

vi.mock('next/headers', () => ({
   headers: async () => new Headers(),
}));

import { login, register } from './user';

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

function formFrom(fields: Record<string, string>): FormData {
   const form = new FormData();
   for (const [key, value] of Object.entries(fields)) {
      form.append(key, value);
   }
   return form;
}

function loginForm(overrides: Record<string, string> = {}) {
   return formFrom({
      email: 'ada@example.com',
      password: 'Password1!',
      ...overrides,
   });
}

function registerForm(overrides: Record<string, string> = {}) {
   return formFrom({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Password1!',
      ...overrides,
   });
}

describe('login / register actions', () => {
   afterEach(() => {
      vi.clearAllMocks();
   });

   it('should return the first Zod issue for a short login password', async () => {
      const result = await login(loginForm({ password: 'short' }));
      expect(signInEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
         error: 'Password must be at least 8 characters long',
      });
   });

   it('should not distinguish a missing account from a wrong password', async () => {
      signInEmail.mockRejectedValueOnce(
         apiError({
            code: 'USER_NOT_FOUND',
            message: 'No account found for that email',
         })
      );
      const missing = await login(loginForm());

      signInEmail.mockRejectedValueOnce(
         apiError({
            code: 'INVALID_PASSWORD',
            message: 'Invalid password',
         })
      );
      const wrong = await login(loginForm());

      expect(missing).toEqual({ error: INVALID_CREDENTIALS_MESSAGE });
      expect(wrong).toEqual({ error: INVALID_CREDENTIALS_MESSAGE });
      expect(missing).toEqual(wrong);
   });

   it('should fall back to a generic error when login throws a non-API error', async () => {
      signInEmail.mockRejectedValueOnce(new Error('socket hang up'));
      expect(await login(loginForm())).toEqual({
         error: 'Something went wrong. Please try again.',
      });
   });

   it('should report success when sign-up hits a duplicate-account API error', async () => {
      signUpEmail.mockRejectedValueOnce(
         apiError({
            code: 'USER_ALREADY_EXISTS',
            message: 'User already exists. Use another email.',
         })
      );

      expect(await register(registerForm())).toEqual({ success: true });
      expect(signUpEmail).toHaveBeenCalledTimes(1);
   });

   it('should still surface unrelated sign-up failures', async () => {
      signUpEmail.mockRejectedValueOnce(
         apiError({
            code: 'PASSWORD_TOO_SHORT',
            message: 'Password too short',
         })
      );

      expect(await register(registerForm())).toEqual({
         error: 'Password is too short.',
      });
   });

   it('should return the first Zod issue for a short register name', async () => {
      const result = await register(registerForm({ name: 'Al' }));
      expect(signUpEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
         error: 'Name must be at least 3 characeters long',
      });
   });
});
