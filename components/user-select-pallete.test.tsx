import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetStores } from '../test/utils';
import UserSelectPallete from './user-select-pallete';

describe('UserSelectPallete', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should render each option group with a key', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<UserSelectPallete reset={() => {}} />);

      expect(
         screen.getAllByRole('button', { name: '30' }).length
      ).toBeGreaterThan(0);
      const keyWarnings = error.mock.calls.filter((call) =>
         call.some((arg) => String(arg).includes('unique "key" prop'))
      );
      expect(keyWarnings).toEqual([]);
   });
});
