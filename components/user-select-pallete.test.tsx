import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetTest } from '@/lib/reset';
import { userConfigStore } from '@/store';
import { resetStores } from '@/test/utils';
import UserSelectPallete from './user-select-pallete';

vi.mock('@/lib/reset', () => ({
   resetTest: vi.fn(),
}));

function byName(name: string): { name: RegExp } {
   return { name: new RegExp(`^${name}$`) };
}

function clickChoice(name: string): void {
   const button = screen.getAllByRole('button', byName(name))[0];
   if (!button) throw new Error(`missing ${name}`);
   fireEvent.click(button);
}

describe('UserSelectPallete', () => {
   const reset = vi.fn();

   beforeEach(() => {
      resetStores();
      reset.mockClear();
      vi.mocked(resetTest).mockClear();
   });

   it('should render each option group with a key', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<UserSelectPallete reset={reset} />);

      expect(
         screen.getAllByRole('button', { name: '30' }).length
      ).toBeGreaterThan(0);
      const keyWarnings = error.mock.calls.filter((call) =>
         call.some((arg) => String(arg).includes('unique "key" prop'))
      );
      expect(keyWarnings).toEqual([]);
      error.mockRestore();
   });

   it('should offer time limits until words mode is chosen', () => {
      render(<UserSelectPallete reset={reset} />);

      expect(
         screen.getAllByRole('button', byName('30')).length
      ).toBeGreaterThan(0);
      expect(
         screen.queryByRole('button', byName('25'))
      ).not.toBeInTheDocument();
   });

   it('should offer word counts and remember the choice', () => {
      render(<UserSelectPallete reset={reset} />);

      clickChoice('words');

      expect(userConfigStore.getState().category).toBe('words');
      for (const count of ['10', '25', '50', '100']) {
         expect(
            screen.getAllByRole('button', byName(count)).length
         ).toBeGreaterThan(0);
      }
      expect(
         screen.queryByRole('button', byName('15'))
      ).not.toBeInTheDocument();
      expect(
         screen
            .getAllByRole('button', byName('10'))
            .some((button) => button.classList.contains('selected'))
      ).toBe(true);

      clickChoice('50');

      expect(userConfigStore.getState().wordCount).toBe(50);
      expect(userConfigStore.getState().category).toBe('words');
      expect(vi.mocked(resetTest)).toHaveBeenCalled();
      const saved = JSON.parse(localStorage.getItem('userConfig') ?? '{}') as {
         state?: { category?: string; wordCount?: number };
      };
      expect(saved.state).toMatchObject({ category: 'words', wordCount: 50 });
   });
});
