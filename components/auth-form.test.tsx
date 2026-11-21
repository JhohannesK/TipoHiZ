import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthForm from './auth-form';

const { push, refresh, signInSocial } = vi.hoisted(() => ({
   push: vi.fn(),
   refresh: vi.fn(),
   signInSocial: vi.fn(),
}));

vi.mock('next/navigation', () => ({
   useRouter: () => ({
      push,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh,
   }),
}));

vi.mock('next/link', () => ({
   default: ({
      children,
      href,
   }: {
      children: React.ReactNode;
      href: string;
   }) => <a href={href}>{children}</a>,
}));

vi.mock('sonner', () => ({
   toast: Object.assign(vi.fn(), { error: vi.fn() }),
}));

vi.mock('@/lib/auth-client', () => ({
   authClient: {
      signIn: { social: signInSocial },
   },
}));

describe('AuthForm', () => {
   beforeEach(() => {
      push.mockClear();
      refresh.mockClear();
      signInSocial.mockClear();
      vi.mocked(toast).mockClear();
      vi.mocked(toast.error).mockClear();
   });

   it('should keep email, clear password, and stay put when login fails', async () => {
      const user = userEvent.setup();
      const action = vi.fn().mockResolvedValue({
         error: 'Invalid email or password',
      });

      render(<AuthForm mode="login" action={action} />);

      await user.type(screen.getByLabelText('Email Address'), 'a@b.co');
      await user.type(screen.getByLabelText('Password'), 'secret-pass');
      await user.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => {
         expect(action).toHaveBeenCalledTimes(1);
      });
      expect(screen.getByLabelText('Email Address')).toHaveValue('a@b.co');
      expect(screen.getByLabelText('Password')).toHaveValue('');
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
      expect(push).not.toHaveBeenCalled();
      expect(refresh).not.toHaveBeenCalled();
   });

   it('should send a successful login to home', async () => {
      const user = userEvent.setup();
      const action = vi.fn().mockResolvedValue({ success: true });

      render(<AuthForm mode="login" action={action} />);

      await user.type(screen.getByLabelText('Email Address'), 'a@b.co');
      await user.type(screen.getByLabelText('Password'), 'secret-pass');
      await user.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => {
         expect(push).toHaveBeenCalledWith('/');
      });
      expect(refresh).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith('Success!');
   });

   it('should send a successful register to login without creating a session', async () => {
      const user = userEvent.setup();
      const action = vi.fn().mockResolvedValue({ success: true });

      render(<AuthForm mode="register" action={action} />);

      await user.type(screen.getByLabelText('Name'), 'Ada');
      await user.type(screen.getByLabelText('Email Address'), 'ada@b.co');
      await user.type(screen.getByLabelText('Password'), 'Secret1!');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
         expect(push).toHaveBeenCalledWith('/login');
      });
      expect(push).not.toHaveBeenCalledWith('/');
      expect(refresh).toHaveBeenCalled();
   });

   it('should keep name and email when register fails', async () => {
      const user = userEvent.setup();
      const action = vi.fn().mockResolvedValue({
         error: 'Password must be at least 8 characters long',
      });

      render(<AuthForm mode="register" action={action} />);

      await user.type(screen.getByLabelText('Name'), 'Ada');
      await user.type(screen.getByLabelText('Email Address'), 'ada@b.co');
      await user.type(screen.getByLabelText('Password'), 'short');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
         expect(toast.error).toHaveBeenCalledWith(
            'Password must be at least 8 characters long'
         );
      });
      expect(screen.getByLabelText('Name')).toHaveValue('Ada');
      expect(screen.getByLabelText('Email Address')).toHaveValue('ada@b.co');
      expect(screen.getByLabelText('Password')).toHaveValue('');
      expect(push).not.toHaveBeenCalled();
   });

   it('should keep name and email when the action throws', async () => {
      const user = userEvent.setup();
      const action = vi.fn().mockRejectedValue(new Error('network'));

      render(<AuthForm mode="register" action={action} />);

      await user.type(screen.getByLabelText('Name'), 'Ada');
      await user.type(screen.getByLabelText('Email Address'), 'ada@b.co');
      await user.type(screen.getByLabelText('Password'), 'Secret1!');
      await user.click(screen.getByRole('button', { name: 'Register' }));

      await waitFor(() => {
         expect(toast.error).toHaveBeenCalledWith(
            'Something went wrong. Please try again.'
         );
      });
      expect(screen.getByLabelText('Name')).toHaveValue('Ada');
      expect(screen.getByLabelText('Email Address')).toHaveValue('ada@b.co');
      expect(screen.getByLabelText('Password')).toHaveValue('');
      expect(push).not.toHaveBeenCalled();
   });
});
