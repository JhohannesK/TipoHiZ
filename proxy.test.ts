import { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { proxy } from './proxy';

vi.mock('better-auth/cookies', () => ({
   getSessionCookie: vi.fn(),
}));

const sessionCookie = vi.mocked(getSessionCookie);

function request(path: string): NextRequest {
   return new NextRequest(`http://localhost:3000${path}`);
}

describe('proxy', () => {
   afterEach(() => {
      vi.clearAllMocks();
   });

   it('should redirect login to home when a session cookie is present', () => {
      sessionCookie.mockReturnValue('session');
      const response = proxy(request('/login'));
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/');
   });

   it('should redirect register to home when a session cookie is present', () => {
      sessionCookie.mockReturnValue('session');
      const response = proxy(request('/register'));
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/');
   });

   it('should leave login and register alone without a session cookie', () => {
      sessionCookie.mockReturnValue(null);
      expect(proxy(request('/login')).status).toBe(200);
      expect(proxy(request('/register')).headers.get('location')).toBeNull();
   });

   it('should not bounce signed-in traffic off the rest of the app', () => {
      sessionCookie.mockReturnValue('session');
      const home = proxy(request('/'));
      const results = proxy(request('/results'));
      expect(home.status).toBe(200);
      expect(results.status).toBe(200);
      expect(home.headers.get('location')).toBeNull();
      expect(sessionCookie).not.toHaveBeenCalled();
   });
});
