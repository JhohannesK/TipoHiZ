import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useElapsed from './useElapsed';

type Frame = (timestamp: number) => void;

let now = 0;
let nextFrameId = 1;
let frames = new Map<number, Frame>();

function installAnimationFrames(): void {
   now = 0;
   nextFrameId = 1;
   frames = new Map();
   vi.stubGlobal('requestAnimationFrame', (callback: Frame) => {
      const id = nextFrameId;
      nextFrameId += 1;
      frames.set(id, callback);
      return id;
   });
   vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      frames.delete(id);
   });
}

function advance(ms: number): void {
   act(() => {
      now += ms;
      const pending = [...frames.values()];
      frames.clear();
      for (const frame of pending) {
         frame(now);
      }
   });
}

describe('useElapsed', () => {
   beforeEach(() => {
      installAnimationFrames();
   });

   afterEach(() => {
      vi.unstubAllGlobals();
   });

   it('should stay at zero until the test starts', () => {
      const { result } = renderHook(() => useElapsed());

      expect(result.current.elapsed).toBe(0);
      expect(result.current.running).toBe(false);

      advance(3000);

      expect(result.current.elapsed).toBe(0);
   });

   it('should count up in whole seconds after run', () => {
      const { result } = renderHook(() => useElapsed());

      act(() => {
         result.current.run();
      });
      advance(0);

      expect(result.current.running).toBe(true);
      expect(result.current.elapsed).toBe(0);

      advance(1000);

      expect(result.current.elapsed).toBe(1);

      advance(2500);

      expect(result.current.elapsed).toBe(3);
   });

   it('should return to zero and stop when reset', () => {
      const { result } = renderHook(() => useElapsed());

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(2000);

      act(() => {
         result.current.reset();
      });
      advance(3000);

      expect(result.current.elapsed).toBe(0);
      expect(result.current.running).toBe(false);
   });
});
