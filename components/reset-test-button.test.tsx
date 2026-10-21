import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { track } from '@vercel/analytics';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useTimer from '@/hooks/useTimer';
import { resetTest } from '@/lib/reset';
import { abandonTest } from '@/lib/usage-events';
import { userConfigStore } from '@/store';
import { setCategory, setType } from '@/store/actions/ConfigActions';
import { setDefaultTime } from '@/store/actions/TimeActions';
import { resetStores } from '@/test/utils';
import ResetTestButton from './reset-test-button';

vi.mock('next/navigation', () => ({
   useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
   }),
}));

vi.mock('@vercel/analytics', () => ({
   track: vi.fn(),
}));

vi.mock('@/lib/reset', () => ({
   resetTest: vi.fn(),
}));

function Harness() {
   const time = userConfigStore((state) => state.time);
   const { timer, reset } = useTimer(1, time);

   return (
      <>
         <p>{timer}</p>
         <ResetTestButton reset={reset} />
      </>
   );
}

function savedConfig(): {
   time?: number;
   category?: string;
   type?: string;
} {
   const parsed = JSON.parse(localStorage.getItem('userConfig') ?? '{}') as {
      state?: { time?: number; category?: string; type?: string };
   };

   return parsed.state ?? {};
}

describe('ResetTestButton', () => {
   beforeEach(() => {
      resetStores();
      abandonTest();
      userConfigStore.setState({
         time: 60,
         category: 'time',
         type: 'default',
      });
   });

   function chooseFifteenSecondWordsTest(): string | null {
      act(() => {
         setDefaultTime(15);
         setCategory('words');
         setType('punctuation');
      });

      return localStorage.getItem('userConfig');
   }

   it('should keep the chosen mode and duration when shift+enter restarts', async () => {
      const user = userEvent.setup();
      render(<Harness />);
      expect(screen.getByText('60')).toBeInTheDocument();

      const beforeRestart = chooseFifteenSecondWordsTest();
      expect(screen.getByText('60')).toBeInTheDocument();

      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.queryByText('60')).not.toBeInTheDocument();
      expect(userConfigStore.getState()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
      expect(savedConfig()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
      expect(localStorage.getItem('userConfig')).toBe(beforeRestart);
      expect(resetTest).toHaveBeenCalledWith(
         'punctuation',
         expect.any(Function)
      );
      expect(track).toHaveBeenCalledWith('test_restarted', { how: 'shortcut' });
   });

   it('should keep the chosen duration when tab then enter restarts', async () => {
      const user = userEvent.setup();
      render(<Harness />);

      const beforeRestart = chooseFifteenSecondWordsTest();

      await user.keyboard('{Tab}{Enter}');

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(userConfigStore.getState()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
      expect(localStorage.getItem('userConfig')).toBe(beforeRestart);
      expect(resetTest).toHaveBeenCalledWith(
         'punctuation',
         expect.any(Function)
      );
      expect(track).toHaveBeenCalledWith('test_restarted', { how: 'shortcut' });
   });

   it('should keep the saved config when the restart button is clicked', async () => {
      const user = userEvent.setup();
      render(<Harness />);
      const beforeRestart = chooseFifteenSecondWordsTest();

      await user.click(screen.getByRole('button', { name: /restart test/i }));

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(localStorage.getItem('userConfig')).toBe(beforeRestart);
      expect(savedConfig()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
      expect(track).toHaveBeenCalledWith('test_restarted', { how: 'button' });
   });

   it('should ignore shift+enter when another input is focused', async () => {
      const user = userEvent.setup();
      render(
         <>
            <Harness />
            <input aria-label="notes" />
         </>
      );
      chooseFifteenSecondWordsTest();

      await user.click(screen.getByRole('textbox', { name: 'notes' }));
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(resetTest).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(savedConfig()).toMatchObject({
         time: 15,
         category: 'words',
         type: 'punctuation',
      });
   });

   it('should restart when shift+enter is pressed in the typing field', async () => {
      const user = userEvent.setup();
      render(
         <>
            <Harness />
            <textarea aria-label="typing" data-typing-field="true" />
         </>
      );
      chooseFifteenSecondWordsTest();

      await user.click(screen.getByRole('textbox', { name: 'typing' }));
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(resetTest).toHaveBeenCalledWith(
         'punctuation',
         expect.any(Function)
      );
      expect(track).toHaveBeenCalledWith('test_restarted', { how: 'shortcut' });
   });

   it('should ignore enter when tab was not pressed first', async () => {
      const user = userEvent.setup();
      render(<Harness />);

      await user.keyboard('{Enter}');
      await user.keyboard('{Control>}{Shift>}{Enter}{/Shift}{/Control}');

      expect(resetTest).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
      expect(screen.getByText('60')).toBeInTheDocument();
   });
});

describe('ResetTestButton usage events', () => {
   const reset = vi.fn();

   beforeEach(() => {
      resetStores();
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
      expect(track).toHaveBeenCalledWith('test_restarted', {
         how: 'shortcut',
      });
      expect(reset).toHaveBeenCalledTimes(1);
   });

   it('should track shift+enter as a shortcut restart', () => {
      render(<ResetTestButton reset={reset} />);

      fireEvent.keyDown(document, {
         key: 'Enter',
         shiftKey: true,
      });

      expect(track).toHaveBeenCalledTimes(1);
      expect(track).toHaveBeenCalledWith('test_restarted', {
         how: 'shortcut',
      });
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
