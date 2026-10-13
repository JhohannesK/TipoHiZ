import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useTimer from './useTimer';

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

describe('useTimer', () => {
   beforeEach(() => {
      installAnimationFrames();
      push.mockClear();
   });

   afterEach(() => {
      vi.unstubAllGlobals();
   });

   it('should start at the upper bound and stay idle until run', () => {
      const { result } = renderHook(() => useTimer(1, 15));

      expect(result.current.timer).toBe(15);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isExited).toBe(false);

      advance(5000);

      expect(result.current.timer).toBe(15);
      expect(push).not.toHaveBeenCalled();
   });

   it('should count down once per elapsed second after run', () => {
      const { result } = renderHook(() => useTimer(1, 15));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(1000);

      expect(result.current.isRunning).toBe(true);
      expect(result.current.timer).toBe(14);

      advance(2000);

      expect(result.current.timer).toBe(12);
   });

   it('should stop decreasing after pause', () => {
      const { result } = renderHook(() => useTimer(1, 15));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(1000);

      act(() => {
         result.current.pause();
      });
      advance(4000);

      expect(result.current.isRunning).toBe(false);
      expect(result.current.timer).toBe(14);
   });

   it('should restore the initial countdown and stop on reset', () => {
      const { result } = renderHook(() => useTimer(1, 15));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(3000);

      act(() => {
         result.current.reset();
      });
      advance(5000);

      expect(result.current.timer).toBe(15);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isExited).toBe(false);
   });

   it('should use the latest upper bound when reset runs after a rerender', () => {
      const { result, rerender } = renderHook(
         ({ upperBound }) => useTimer(1, upperBound),
         { initialProps: { upperBound: 60 } }
      );

      rerender({ upperBound: 15 });
      act(() => {
         result.current.reset();
      });

      expect(result.current.timer).toBe(15);
   });

   it('should navigate to results when the countdown reaches its lower bound', () => {
      const { result } = renderHook(() => useTimer(1, 3));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(2000);

      expect(result.current.timer).toBe(1);
      expect(result.current.isExited).toBe(true);
      expect(push).toHaveBeenCalledWith('/results');
   });

   it('should call the exit callback once before opening results', () => {
      const onExit = vi.fn();
      const { result } = renderHook(() => useTimer(1, 2, true, false, onExit));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(1000);

      expect(onExit).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith('/results');
   });

   it('should not call the exit callback when the timer is reset first', () => {
      const onExit = vi.fn();
      const { result } = renderHook(() => useTimer(1, 5, true, false, onExit));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(1000);
      act(() => {
         result.current.reset();
      });
      advance(5000);

      expect(onExit).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
   });

   it('should reach zero and navigate when the lower bound is zero', () => {
      const { result } = renderHook(() => useTimer(0, 2));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(2000);

      expect(result.current.timer).toBe(0);
      expect(result.current.isExited).toBe(true);
      expect(push).toHaveBeenCalledTimes(1);
   });

   it('should stay on the page when the exit callback is null', () => {
      const { result } = renderHook(() => useTimer(1, 2, true, false, null));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(1000);

      expect(result.current.timer).toBe(1);
      expect(result.current.isExited).toBe(false);
      expect(push).not.toHaveBeenCalled();
   });

   it('should count up to the upper bound and then navigate', () => {
      const { result } = renderHook(() => useTimer(0, 2, false));

      act(() => {
         result.current.run();
      });
      advance(0);
      advance(1000);

      expect(result.current.timer).toBe(1);

      advance(1000);

      expect(result.current.timer).toBe(2);
      expect(push).toHaveBeenCalledWith('/results');
   });

   it('should run immediately when runOnStart is set', () => {
      const { result } = renderHook(() => useTimer(1, 5, true, true));

      expect(result.current.isRunning).toBe(true);

      advance(0);
      advance(1000);

      expect(result.current.timer).toBe(4);
   });
});
