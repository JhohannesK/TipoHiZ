// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth-form';
import RegisterPage from './page';

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
      props: { mode: string };
   };
   expect(child.type).toBe(AuthForm);
   return child.props;
}

describe('register page', () => {
   beforeEach(() => {
      getSession.mockReset();
      redirectMock.mockClear();
   });

   it('should redirect home when the server session is confirmed', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);

      await expect(RegisterPage()).rejects.toThrow('NEXT_REDIRECT:/');
      expect(redirectMock).toHaveBeenCalledWith('/');
   });

   it('should render register when there is no session', async () => {
      getSession.mockResolvedValue(null);

      const tree = await RegisterPage();
      const form = authFormFrom(tree);

      expect(redirectMock).not.toHaveBeenCalled();
      expect(form.mode).toBe('register');
   });
});
