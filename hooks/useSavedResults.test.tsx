import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
   clearGuestResults,
   rememberLastResult,
   saveGuestResult,
} from '@/lib/stats/storage';
import type { SavedTestResult } from '@/lib/stats/types';
import { useSavedResults } from './useSavedResults';

const sessionState = vi.hoisted(() => ({
   value: {
      data: null as { user?: { id: string } } | null,
      isPending: false,
   },
}));

vi.mock('@/lib/auth-client', () => ({
   authClient: {
      useSession: () => sessionState.value,
   },
}));

function result(id: string, createdAt: string): SavedTestResult {
   return {
      id,
      createdAt,
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words: ['hi'],
      log: [],
      stats: {
         wpm: 40,
         rawWpm: 44,
         accuracy: 100,
         consistency: 80,
         typedEntries: 2,
         errors: 0,
         correct: 2,
         incorrect: 0,
         extra: 0,
         missed: 0,
         samples: [],
         perKey: [],
      },
   };
}

const ACCOUNT_A = result('acct-a', '2026-11-10T10:00:00.000Z');
const ACCOUNT_B = result('acct-b', '2026-11-10T11:00:00.000Z');
const GUEST = result('guest-1', '2026-11-10T10:01:00.000Z');
const LAST = result('last-1', '2026-11-10T10:02:00.000Z');

function jsonOk(results: SavedTestResult[]) {
   return {
      ok: true,
      json: async () => ({ results }),
   };
}

describe('useSavedResults', () => {
   beforeEach(() => {
      sessionState.value = { data: null, isPending: false };
      localStorage.clear();
      sessionStorage.clear();
      clearGuestResults();
   });

   afterEach(() => {
      vi.unstubAllGlobals();
      vi.clearAllMocks();
   });

   it('should merge guest history and last without fetching when signed out', () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      saveGuestResult(GUEST);
      rememberLastResult(LAST);

      const { result: hook } = renderHook(() => useSavedResults());

      expect(hook.current.map((row) => row.id)).toEqual(['last-1', 'guest-1']);
      expect(fetchMock).not.toHaveBeenCalled();
   });

   it('should show account rows after a signed-in fetch succeeds', async () => {
      sessionState.value = {
         data: { user: { id: 'user-a' } },
         isPending: false,
      };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonOk([ACCOUNT_A])));

      const { result: hook } = renderHook(() => useSavedResults());

      await waitFor(() => {
         expect(hook.current.map((row) => row.id)).toEqual(['acct-a']);
      });
      expect(fetch).toHaveBeenCalledWith('/api/results');
   });

   it('should keep local guest rows when the signed-in fetch fails', async () => {
      sessionState.value = {
         data: { user: { id: 'user-a' } },
         isPending: false,
      };
      saveGuestResult(GUEST);
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

      const { result: hook } = renderHook(() => useSavedResults());

      await waitFor(() => {
         expect(hook.current.map((row) => row.id)).toEqual(['guest-1']);
      });
   });

   it('should drop a stale fetch after the session user changes', async () => {
      sessionState.value = {
         data: { user: { id: 'user-a' } },
         isPending: false,
      };
      let finishFirst: ((value: unknown) => void) | undefined;
      const fetchMock = vi
         .fn()
         .mockImplementationOnce(
            () =>
               new Promise((resolve) => {
                  finishFirst = resolve;
               })
         )
         .mockResolvedValueOnce(jsonOk([ACCOUNT_B]));
      vi.stubGlobal('fetch', fetchMock);

      const { result: hook, rerender } = renderHook(() => useSavedResults());

      await waitFor(() => {
         expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      sessionState.value = {
         data: { user: { id: 'user-b' } },
         isPending: false,
      };
      rerender();

      await waitFor(() => {
         expect(hook.current.map((row) => row.id)).toEqual(['acct-b']);
      });

      await act(async () => {
         finishFirst?.(jsonOk([ACCOUNT_A]));
      });

      expect(hook.current.map((row) => row.id)).toEqual(['acct-b']);
      expect(hook.current.some((row) => row.id === 'acct-a')).toBe(false);
   });

   it('should hide leftover account rows after sign-out', async () => {
      sessionState.value = {
         data: { user: { id: 'user-a' } },
         isPending: false,
      };
      saveGuestResult(GUEST);
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonOk([ACCOUNT_A])));

      const { result: hook, rerender } = renderHook(() => useSavedResults());

      await waitFor(() => {
         expect(hook.current.map((row) => row.id)).toContain('acct-a');
      });

      sessionState.value = { data: null, isPending: false };
      rerender();

      expect(hook.current.map((row) => row.id)).toEqual(['guest-1']);
   });
});
