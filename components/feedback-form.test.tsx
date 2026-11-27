import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MIN_FILL_MS } from '@/lib/feedback/schema';
import { feedbackStore } from '@/store/feedback';
import { resetStores } from '@/test/utils';
import FeedbackForm from './feedback-form';

vi.mock('next/navigation', () => ({
   usePathname: () => '/',
}));

vi.mock('next-themes', () => ({
   useTheme: () => ({ theme: 'light-orange' }),
}));

vi.mock('@/lib/auth-client', () => ({
   authClient: {
      useSession: () => ({ data: null, isPending: false }),
   },
}));

function installDomShims(): void {
   Element.prototype.hasPointerCapture ??= () => false;
   Element.prototype.setPointerCapture ??= () => undefined;
   Element.prototype.releasePointerCapture ??= () => undefined;
}

function deferredFetch(): {
   fetch: ReturnType<typeof vi.fn>;
   resolve: (response: Response) => void;
} {
   let resolve!: (response: Response) => void;
   const fetch = vi.fn(
      () =>
         new Promise<Response>((next) => {
            resolve = next;
         })
   );
   return { fetch, resolve: (response) => resolve(response) };
}

describe('FeedbackForm send abort', () => {
   let now = 0;

   beforeEach(() => {
      resetStores();
      feedbackStore.setState({ open: false, testActive: false });
      installDomShims();
      now = 1_000;
      vi.spyOn(performance, 'now').mockImplementation(() => now);
   });

   afterEach(() => {
      feedbackStore.setState({ open: false, testActive: false });
      vi.unstubAllGlobals();
   });

   async function openFilledForm() {
      const user = userEvent.setup();
      render(<FeedbackForm />);
      await user.click(screen.getByRole('button', { name: 'Feedback' }));
      await user.type(
         await screen.findByLabelText(/what's on your mind/i),
         'caret jumps after restart'
      );
      now += MIN_FILL_MS;
      return user;
   }

   it('should ignore a fetch that finishes after the dialog is closed', async () => {
      const pending = deferredFetch();
      vi.stubGlobal('fetch', pending.fetch);
      const user = await openFilledForm();

      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(
         await screen.findByRole('button', { name: 'Sending…' })
      ).toBeDisabled();
      expect(pending.fetch).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      pending.resolve(
         new Response(JSON.stringify({ ok: true }), { status: 200 })
      );

      await waitFor(() => {
         expect(
            screen.queryByRole('button', { name: 'Sending…' })
         ).not.toBeInTheDocument();
      });
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(feedbackStore.getState().open).toBe(false);
   });

   it('should show thanks when fetch succeeds while the dialog stays open', async () => {
      const pending = deferredFetch();
      vi.stubGlobal('fetch', pending.fetch);
      const user = await openFilledForm();

      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(pending.fetch).toHaveBeenCalledTimes(1);

      pending.resolve(
         new Response(JSON.stringify({ ok: true }), { status: 200 })
      );

      expect(await screen.findByRole('status')).toHaveTextContent(
         'Thanks, sent.'
      );
      expect(feedbackStore.getState().open).toBe(true);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(feedbackStore.getState().open).toBe(false);
   });
});
