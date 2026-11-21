// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { INVALID_CREDENTIALS_MESSAGE } from '@/lib/auth/error-messages';
import AuthForm from '@/components/auth-form';
import Login from './page';

vi.mock('@/lib/auth/session', () => ({
   getServerSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
   redirect: vi.fn((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`);
   }),
}));

const getSession = vi.mocked(getServerSession);
const redirectMock = vi.mocked(redirect);

function authFormFrom(tree: unknown) {
   const el = tree as { props: { children: unknown } };
   const child = el.props.children as {
      type: unknown;
      props: { mode: string; error?: string };
   };
   expect(child.type).toBe(AuthForm);
   return child.props;
}

describe('login page', () => {
   beforeEach(() => {
      getSession.mockReset();
      redirectMock.mockClear();
   });

   it('should redirect home when the server session is confirmed', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);

      await expect(
         Login({ searchParams: Promise.resolve({}) })
      ).rejects.toThrow('NEXT_REDIRECT:/');
      expect(redirectMock).toHaveBeenCalledWith('/');
   });

   it('should render login when there is no session', async () => {
      getSession.mockResolvedValue(null);

      const tree = await Login({ searchParams: Promise.resolve({}) });
      const form = authFormFrom(tree);

      expect(redirectMock).not.toHaveBeenCalled();
      expect(form.mode).toBe('login');
      expect(form.error).toBeUndefined();
   });

   it('should map the first OAuth error code onto the form', async () => {
      getSession.mockResolvedValue(null);

      const tree = await Login({
         searchParams: Promise.resolve({
            error: ['USER_NOT_FOUND', 'access_denied'],
         }),
      });
      const form = authFormFrom(tree);

      expect(form.error).toBe(INVALID_CREDENTIALS_MESSAGE);
      expect(form.error).not.toBe('Sign-in was cancelled.');
   });
});
