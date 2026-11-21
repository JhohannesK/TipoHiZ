import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OAuthButtons } from './oauth-buttons';

const { signInSocial } = vi.hoisted(() => ({
   signInSocial: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
   authClient: {
      signIn: { social: signInSocial },
   },
}));

describe('OAuthButtons', () => {
   it.each([
      ['Continue with Google', 'google'],
      ['Continue with GitHub', 'github'],
      ['Continue with X', 'twitter'],
   ] as const)(
      'should start %s with the login error callback',
      async (label, provider) => {
         const user = userEvent.setup();
         render(<OAuthButtons />);

         await user.click(screen.getByRole('button', { name: label }));

         expect(signInSocial).toHaveBeenCalledWith({
            provider,
            callbackURL: '/',
            errorCallbackURL: '/login',
         });
      }
   );
});
