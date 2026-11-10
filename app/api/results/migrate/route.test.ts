// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerSession } from '@/lib/auth/session';
import { saveResultsForUser } from '@/lib/stats/repository';
import { POST } from './route';

vi.mock('@/lib/auth/session', () => ({
   getServerSession: vi.fn(),
}));

vi.mock('@/lib/stats/repository', () => ({
   saveResultsForUser: vi.fn(),
}));

const getSession = vi.mocked(getServerSession);
const saveResults = vi.mocked(saveResultsForUser);

const submission = {
   id: 'result-1234',
   createdAt: '2026-10-13T00:00:00.000Z',
   mode: 'default',
   category: 'time',
   language: 'english',
   durationSeconds: 15,
   wordCount: 1,
   words: ['ab'],
   log: [['a', 'a', 'correct', 0, 0]],
};

function jsonRequest(body: unknown): Request {
   return new Request('http://localhost/api/results/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
   });
}

describe('POST /api/results/migrate', () => {
   beforeEach(() => {
      getSession.mockReset();
      saveResults.mockReset();
   });

   it('should reject an unauthenticated migrate', async () => {
      getSession.mockResolvedValue(null);

      const response = await POST(jsonRequest({ results: [submission] }));

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(saveResults).not.toHaveBeenCalled();
   });

   it('should reject a batch that fails the migrate schema', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);

      const response = await POST(jsonRequest({ results: [{ id: 'x' }] }));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid results' });
      expect(saveResults).not.toHaveBeenCalled();
   });

   it('should persist a valid guest batch for the session user', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      saveResults.mockResolvedValue(2);

      const second = { ...submission, id: 'result-5678' };
      const response = await POST(
         jsonRequest({ results: [submission, second] })
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ saved: 2 });
      expect(saveResults).toHaveBeenCalledTimes(1);
      expect(saveResults.mock.calls[0]?.[0]).toBe('user-1');
      expect(saveResults.mock.calls[0]?.[1]).toHaveLength(2);
   });

   it('should return 500 when persistence throws', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      saveResults.mockRejectedValue(new Error('mongo down'));

      const response = await POST(jsonRequest({ results: [submission] }));

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
         error: 'Failed to migrate results',
      });
   });
});
