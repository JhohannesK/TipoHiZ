import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userConfigStore, wordStore } from '@/store';
import { resetStores } from '@/test/utils';
import ResultsPage from './page';

const { push } = vi.hoisted(() => ({
   push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
   useRouter: () => ({
      push,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
   }),
}));

vi.mock('next/link', () => ({
   default: ({
      children,
      href,
      onClick,
   }: {
      children: React.ReactNode;
      href: string;
      onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
   }) => (
      <a
         href={href}
         onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
         }}
      >
         {children}
      </a>
   ),
}));

describe('results restart shortcut', () => {
   beforeEach(() => {
      resetStores();
      push.mockClear();
      userConfigStore.setState({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
      wordStore.setState({
         typedEntries: 40,
         errorCount: 4,
      });
   });

   it('should retake on shift+enter without changing the saved mode or duration', async () => {
      const user = userEvent.setup();
      const beforeRestart = localStorage.getItem('userConfig');
      render(<ResultsPage />);

      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(push).toHaveBeenCalledWith('/');
      expect(wordStore.getState().typedEntries).toBe(0);
      expect(userConfigStore.getState()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
      expect(localStorage.getItem('userConfig')).toBe(beforeRestart);
   });

   it('should ignore shift+enter when another input is focused', async () => {
      const user = userEvent.setup();
      render(
         <>
            <ResultsPage />
            <input aria-label="notes" />
         </>
      );

      await user.click(screen.getByRole('textbox', { name: 'notes' }));
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(push).not.toHaveBeenCalled();
      expect(wordStore.getState().typedEntries).toBe(40);
      expect(userConfigStore.getState().time).toBe(15);
   });

   it('should leave tab then enter alone on the results page', async () => {
      const user = userEvent.setup();
      render(<ResultsPage />);

      await user.keyboard('{Tab}{Enter}');

      expect(push).not.toHaveBeenCalled();
      expect(userConfigStore.getState()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
   });
});
