import { afterEach, describe, expect, it, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { INVALID_CREDENTIALS_MESSAGE } from './error-messages';
import {
   firstSearchParam,
   loginErrorFromSearchParams,
   redirectHomeIfAuthenticated,
} from './guest-page';

vi.mock('next/navigation', () => ({
   redirect: vi.fn((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`);
   }),
}));

const redirectMock = vi.mocked(redirect);

describe('redirectHomeIfAuthenticated', () => {
   afterEach(() => {
      vi.clearAllMocks();
   });

   it('should send a confirmed session home even without a user id', () => {
      expect(() => redirectHomeIfAuthenticated({ user: {} })).toThrow(
         'NEXT_REDIRECT:/'
      );
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith('/');
   });

   it.each([null, undefined])(
      'should leave the guest page alone when the session is %s',
      (session) => {
         expect(() => redirectHomeIfAuthenticated(session)).not.toThrow();
         expect(redirectMock).not.toHaveBeenCalled();
      }
   );
});

describe('firstSearchParam', () => {
   it('should keep a single string value', () => {
      expect(firstSearchParam('USER_NOT_FOUND')).toBe('USER_NOT_FOUND');
   });

   it('should use the first value when the query key is repeated', () => {
      expect(firstSearchParam(['USER_NOT_FOUND', 'access_denied'])).toBe(
         'USER_NOT_FOUND'
      );
   });

   it('should treat a missing or empty list as undefined', () => {
      expect(firstSearchParam(undefined)).toBeUndefined();
      expect(firstSearchParam([])).toBeUndefined();
   });
});

describe('loginErrorFromSearchParams', () => {
   it('should map the first OAuth code and ignore later ones', () => {
      expect(
         loginErrorFromSearchParams(['USER_NOT_FOUND', 'access_denied'])
      ).toBe(INVALID_CREDENTIALS_MESSAGE);
      expect(
         loginErrorFromSearchParams(['USER_NOT_FOUND', 'access_denied'])
      ).not.toBe('Sign-in was cancelled.');
   });

   it('should hide a missing-account code behind the generic credentials message', () => {
      expect(loginErrorFromSearchParams('USER_NOT_FOUND')).toBe(
         INVALID_CREDENTIALS_MESSAGE
      );
      expect(INVALID_CREDENTIALS_MESSAGE.toLowerCase()).not.toContain(
         'not found'
      );
   });

   it('should skip empty error params instead of showing a generic failure', () => {
      expect(loginErrorFromSearchParams(undefined)).toBeUndefined();
      expect(loginErrorFromSearchParams('')).toBeUndefined();
      expect(loginErrorFromSearchParams([''])).toBeUndefined();
   });
});
