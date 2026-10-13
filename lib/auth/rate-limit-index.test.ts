import { afterEach, describe, expect, it, vi } from 'vitest';
import {
   ensureRateLimitKeyIndex,
   resetRateLimitKeyIndexForTests,
} from './rate-limit-index';

describe('ensureRateLimitKeyIndex', () => {
   afterEach(() => {
      resetRateLimitKeyIndexForTests();
      vi.restoreAllMocks();
   });

   it('should create the index once when the first attempt succeeds', async () => {
      const createIndex = vi.fn(async () => undefined);

      ensureRateLimitKeyIndex('mongodb://example', createIndex);
      ensureRateLimitKeyIndex('mongodb://example', createIndex);

      await vi.waitFor(() => {
         expect(createIndex).toHaveBeenCalledTimes(1);
      });

      ensureRateLimitKeyIndex('mongodb://example', createIndex);
      expect(createIndex).toHaveBeenCalledTimes(1);
      expect(createIndex).toHaveBeenCalledWith('mongodb://example');
   });

   it('should retry after a failed attempt', async () => {
      const errorLog = vi
         .spyOn(console, 'error')
         .mockImplementation(() => undefined);
      const createIndex = vi
         .fn()
         .mockRejectedValueOnce(new Error('mongo down'))
         .mockResolvedValueOnce(undefined);

      ensureRateLimitKeyIndex('mongodb://example', createIndex);

      await vi.waitFor(() => {
         expect(createIndex).toHaveBeenCalledTimes(1);
         expect(errorLog).toHaveBeenCalled();
      });

      ensureRateLimitKeyIndex('mongodb://example', createIndex);

      await vi.waitFor(() => {
         expect(createIndex).toHaveBeenCalledTimes(2);
      });
   });
});
