// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerSession } from '@/lib/auth/session';
import { listResultsForUser, saveResultForUser } from '@/lib/stats/repository';
import { GET, POST } from './route';

vi.mock('@/lib/auth/session', () => ({
   getServerSession: vi.fn(),
}));

vi.mock('@/lib/stats/repository', () => ({
   listResultsForUser: vi.fn(),
   saveResultForUser: vi.fn(),
}));

const getSession = vi.mocked(getServerSession);
const listResults = vi.mocked(listResultsForUser);
const saveResult = vi.mocked(saveResultForUser);

const submission = {
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
      ['x', 'b', 'incorrect', 40, 0],
   ],
};

function jsonRequest(body: unknown): Request {
   return new Request('http://localhost/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
   });
}

describe('GET /api/results', () => {
   beforeEach(() => {
      getSession.mockReset();
      listResults.mockReset();
      saveResult.mockReset();
   });

   it('should reject an unauthenticated list', async () => {
      getSession.mockResolvedValue(null);

      const response = await GET();

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(listResults).not.toHaveBeenCalled();
   });

   it('should list results for the session user', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      listResults.mockResolvedValue([{ id: 'result-1234' }] as never);

      const response = await GET();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
         results: [{ id: 'result-1234' }],
      });
      expect(listResults).toHaveBeenCalledWith('user-1');
   });

   it('should return 500 when listing throws', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      listResults.mockRejectedValue(new Error('mongo down'));

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
         error: 'Failed to list results',
      });
   });
});

describe('POST /api/results', () => {
   beforeEach(() => {
      getSession.mockReset();
      listResults.mockReset();
      saveResult.mockReset();
   });

   it('should reject an unauthenticated save', async () => {
      getSession.mockResolvedValue(null);

      const response = await POST(jsonRequest({ result: submission }));

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(saveResult).not.toHaveBeenCalled();
   });

   it('should reject a body that fails the result schema', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);

      const response = await POST(jsonRequest({ id: 'x' }));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid result' });
      expect(saveResult).not.toHaveBeenCalled();
   });

   it('should unwrap a { result } payload and persist it', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      saveResult.mockResolvedValue({ id: 'result-1234' } as never);

      const response = await POST(jsonRequest({ result: submission }));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ result: { id: 'result-1234' } });
      expect(saveResult).toHaveBeenCalledTimes(1);
      expect(saveResult.mock.calls[0]?.[0]).toBe('user-1');
      expect(saveResult.mock.calls[0]?.[1]).toMatchObject({
         id: 'result-1234',
         log: submission.log,
      });
   });

   it('should accept a bare submission at the top level', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      saveResult.mockResolvedValue({ id: 'result-1234' } as never);

      const response = await POST(jsonRequest(submission));

      expect(response.status).toBe(200);
      expect(saveResult).toHaveBeenCalledTimes(1);
      expect(saveResult.mock.calls[0]?.[1]).toMatchObject({
         id: 'result-1234',
      });
   });

   it('should return 500 when the body is not JSON', async () => {
      getSession.mockResolvedValue({ user: { id: 'user-1' } } as never);
      const request = new Request('http://localhost/api/results', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: '{',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Failed to save result' });
      expect(saveResult).not.toHaveBeenCalled();
   });
});
