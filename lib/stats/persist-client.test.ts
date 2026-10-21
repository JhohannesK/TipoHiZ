import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userConfigStore, wordStore } from '../../store';
import { setKeystrokeClock } from './clock';
import {
   persistFinishedTest,
   resultPersistenceMode,
   setResultPersistenceMode,
} from './persist-client';
import { appendKeystroke } from './record';
import { loadGuestResults } from './storage';
import { initialWordState, resetStores } from '../../test/utils';

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

   it('should persist a words test with keystroke elapsed time, not the timed limit', () => {
      userConfigStore.setState({
         category: 'words',
         wordCount: 10,
         time: 30,
      });

      const saved = persistFinishedTest();

      expect(saved?.category).toBe('words');
      expect(saved?.durationSeconds).toBeCloseTo(0.1);
      expect(saved?.durationSeconds).not.toBe(30);
      expect(loadGuestResults()[0]?.durationSeconds).toBeCloseTo(0.1);
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
