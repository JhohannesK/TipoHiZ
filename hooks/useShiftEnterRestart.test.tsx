import { fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { feedbackStore } from '@/store/feedback';
import { useShiftEnterRestart } from './useShiftEnterRestart';

describe('useShiftEnterRestart', () => {
   const onRestart = vi.fn();
   let send: HTMLButtonElement;

   beforeEach(() => {
      onRestart.mockClear();
      feedbackStore.setState({ open: false, testActive: false });
      send = document.createElement('button');
      send.type = 'button';
      send.textContent = 'Send';
      document.body.append(send);
   });

   afterEach(() => {
      send.remove();
      feedbackStore.setState({ open: false, testActive: false });
   });

   it('should ignore shift+enter on a dialog button while feedback is open', () => {
      feedbackStore.setState({ open: true });
      renderHook(() => useShiftEnterRestart(onRestart));

      fireEvent.keyDown(send, { key: 'Enter', shiftKey: true });

      expect(onRestart).not.toHaveBeenCalled();
   });

   it('should restart on shift+enter from a button once feedback is closed', () => {
      renderHook(() => useShiftEnterRestart(onRestart));

      fireEvent.keyDown(send, { key: 'Enter', shiftKey: true });

      expect(onRestart).toHaveBeenCalledTimes(1);
   });

   it('should still ignore shift+enter in another text field when feedback is closed', () => {
      const notes = document.createElement('textarea');
      document.body.append(notes);
      renderHook(() => useShiftEnterRestart(onRestart));

      fireEvent.keyDown(notes, { key: 'Enter', shiftKey: true });

      expect(onRestart).not.toHaveBeenCalled();
      notes.remove();
   });
});
