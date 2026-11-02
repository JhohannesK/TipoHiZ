import { describe, expect, it } from 'vitest';
import { userIdFromSession } from './session-user';

describe('userIdFromSession', () => {
   it('should reject a missing session or user', () => {
      expect(userIdFromSession(null)).toBeNull();
      expect(userIdFromSession(undefined)).toBeNull();
      expect(userIdFromSession({})).toBeNull();
      expect(userIdFromSession({ user: null })).toBeNull();
      expect(userIdFromSession({ user: {} })).toBeNull();
   });

   it('should reject a blank or non-string id', () => {
      expect(userIdFromSession({ user: { id: '' } })).toBeNull();
      expect(userIdFromSession({ user: { id: '   ' } })).toBeNull();
      expect(userIdFromSession({ user: { id: null } })).toBeNull();
   });

   it('should keep a trimmed user id', () => {
      expect(userIdFromSession({ user: { id: 'user-1' } })).toBe('user-1');
      expect(userIdFromSession({ user: { id: '  user-1  ' } })).toBe('user-1');
   });
});
