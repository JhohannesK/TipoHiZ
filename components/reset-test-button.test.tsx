import { fireEvent, render, screen } from '@testing-library/react';
import { track } from '@vercel/analytics';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetTest } from '@/lib/reset';
import { abandonTest } from '@/lib/usage-events';
import ResetTestButton from './reset-test-button';

vi.mock('@vercel/analytics', () => ({
   track: vi.fn(),
}));

vi.mock('@/lib/reset', () => ({
   resetTest: vi.fn(),
}));

describe('ResetTestButton', () => {
   const reset = vi.fn();

   beforeEach(() => {
      abandonTest();
      reset.mockClear();
   });

   it('should track a button restart', () => {
      render(<ResetTestButton reset={reset} />);

      fireEvent.click(screen.getByRole('button', { name: /restart test/i }));

      expect(track).toHaveBeenCalledWith('test_restarted', { how: 'button' });
      expect(resetTest).toHaveBeenCalledTimes(1);
      expect(reset).toHaveBeenCalledTimes(1);
   });

   it('should track a tab then enter shortcut restart', () => {
      render(<ResetTestButton reset={reset} />);

      fireEvent.keyDown(document, { key: 'Tab' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expect(track).toHaveBeenCalledTimes(1);
      expect(track).toHaveBeenCalledWith('test_restarted', { how: 'shortcut' });
      expect(reset).toHaveBeenCalledTimes(1);
   });

   it('should not track enter without a preceding tab', () => {
      render(<ResetTestButton reset={reset} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expect(track).not.toHaveBeenCalled();
      expect(reset).not.toHaveBeenCalled();
   });
});
