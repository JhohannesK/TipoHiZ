import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { wordStore } from '../../store';
import { initialWordState, resetStores } from '../../test/utils';
import { resultFromSubmission } from './aggregate';
import { setKeystrokeClock } from './clock';
import {
   migrateGuestResults,
   persistFinishedTest,
   resultPersistenceMode,
   setResultPersistenceMode,
} from './persist-client';
import { appendKeystroke } from './record';
import {
   clearGuestResults,
   loadGuestResults,
   saveGuestResult,
} from './storage';

describe('persistFinishedTest', () => {
   beforeEach(() => {
      resetStores();
      setResultPersistenceMode('guest');
      let now = 0;
      setKeystrokeClock(() => {
         const current = now;
         now += 100;
         return current;
      });
      wordStore.setState({
         ...initialWordState,
         wordList: ['ab'],
         activeWord: 'ab',
      });
      appendKeystroke({
         key: 'a',
         expected: 'a',
         kind: 'correct',
         wordIndex: 0,
      });
      appendKeystroke({
         key: 'b',
         expected: 'b',
         kind: 'correct',
         wordIndex: 0,
      });
   });

   afterEach(() => {
      setResultPersistenceMode('guest');
      vi.unstubAllGlobals();
   });

   it('should store a guest result in local storage', () => {
      const saved = persistFinishedTest();

      expect(saved?.stats.typedEntries).toBe(2);
      expect(saved?.log).toHaveLength(2);
      expect(loadGuestResults().map((item) => item.id)).toEqual([saved?.id]);
      expect(resultPersistenceMode()).toBe('guest');
   });

   it('should skip an empty log', () => {
      wordStore.setState({ keystrokeLog: [] });

      expect(persistFinishedTest()).toBeNull();
      expect(loadGuestResults()).toEqual([]);
   });

   it('should post a signed-in result and keep it local when the post fails', async () => {
      setResultPersistenceMode('account');
      const fetchMock = vi.fn().mockResolvedValue({ ok: false });
      vi.stubGlobal('fetch', fetchMock);

      const saved = persistFinishedTest();
      await vi.waitFor(() => {
         expect(loadGuestResults()).toHaveLength(1);
      });

      expect(fetchMock).toHaveBeenCalledWith(
         '/api/results',
         expect.objectContaining({ method: 'POST' })
      );
      expect(loadGuestResults()[0]?.id).toBe(saved?.id);
   });

   it('should not copy an account result into guest storage when the post succeeds', async () => {
      setResultPersistenceMode('account');
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      persistFinishedTest();
      await vi.waitFor(() => {
         expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      expect(loadGuestResults()).toEqual([]);
   });
});

describe('migrateGuestResults', () => {
   beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
      setResultPersistenceMode('guest');
   });

   afterEach(() => {
      setResultPersistenceMode('guest');
      vi.unstubAllGlobals();
   });

   it('should no-op when there is nothing to migrate', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      await expect(migrateGuestResults()).resolves.toBe(true);
      expect(fetchMock).not.toHaveBeenCalled();
   });

   it('should post guest results and clear them when migrate succeeds', async () => {
      const guest = resultFromSubmission({
         id: 'result-1234',
         createdAt: '2026-10-13T00:00:00.000Z',
         mode: 'default',
         category: 'time',
         language: 'english',
         durationSeconds: 15,
         wordCount: 1,
         words: ['ab'],
         log: [
            ['a', 'a', 'correct', 0, 0],
            ['b', 'b', 'correct', 80, 0],
         ],
      });
      saveGuestResult(guest);
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      await expect(migrateGuestResults()).resolves.toBe(true);

      expect(fetchMock).toHaveBeenCalledWith(
         '/api/results/migrate',
         expect.objectContaining({ method: 'POST' })
      );
      const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)) as {
         results: { id: string }[];
      };
      expect(body.results.map((item) => item.id)).toEqual(['result-1234']);
      expect(loadGuestResults()).toEqual([]);
   });

   it('should leave guest storage intact when migrate fails', async () => {
      const guest = resultFromSubmission({
         id: 'result-5678',
         createdAt: '2026-10-13T00:00:00.000Z',
         mode: 'default',
         category: 'time',
         language: 'english',
         durationSeconds: 15,
         wordCount: 1,
         words: ['ab'],
         log: [['a', 'a', 'correct', 0, 0]],
      });
      saveGuestResult(guest);
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

      await expect(migrateGuestResults()).resolves.toBe(false);
      expect(loadGuestResults().map((item) => item.id)).toEqual([
         'result-5678',
      ]);
   });

   it('should treat a network throw as migrate failure without clearing', async () => {
      const guest = resultFromSubmission({
         id: 'result-9012',
         createdAt: '2026-10-13T00:00:00.000Z',
         mode: 'default',
         category: 'time',
         language: 'english',
         durationSeconds: 15,
         wordCount: 1,
         words: ['ab'],
         log: [['a', 'a', 'correct', 0, 0]],
      });
      saveGuestResult(guest);
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

      await expect(migrateGuestResults()).resolves.toBe(false);
      expect(loadGuestResults().map((item) => item.id)).toEqual([
         'result-9012',
      ]);
      clearGuestResults();
   });
});
