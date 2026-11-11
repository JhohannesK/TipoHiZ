import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ResultSync from './result-sync';

const sessionState = vi.hoisted(() => ({
   value: {
      data: null as { user?: { id: string } } | null,
      isPending: true,
   },
}));

const persist = vi.hoisted(() => ({
   setResultPersistenceMode: vi.fn(),
   migrateGuestResults: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/auth-client', () => ({
   authClient: {
      useSession: () => sessionState.value,
   },
}));

vi.mock('@/lib/stats/persist-client', () => ({
   setResultPersistenceMode: persist.setResultPersistenceMode,
   migrateGuestResults: persist.migrateGuestResults,
}));

describe('ResultSync', () => {
   beforeEach(() => {
      sessionState.value = { data: null, isPending: true };
      persist.setResultPersistenceMode.mockReset();
      persist.migrateGuestResults.mockReset();
      persist.migrateGuestResults.mockResolvedValue(true);
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   it('should wait while the session is pending', () => {
      render(<ResultSync />);

      expect(persist.setResultPersistenceMode).not.toHaveBeenCalled();
      expect(persist.migrateGuestResults).not.toHaveBeenCalled();
   });

   it('should switch to guest persistence without migrating when signed out', () => {
      sessionState.value = { data: null, isPending: false };

      render(<ResultSync />);

      expect(persist.setResultPersistenceMode).toHaveBeenCalledWith('guest');
      expect(persist.migrateGuestResults).not.toHaveBeenCalled();
   });

   it('should switch to account persistence and migrate guest rows on sign-in', () => {
      sessionState.value = {
         data: { user: { id: 'user-1' } },
         isPending: false,
      };

      render(<ResultSync />);

      expect(persist.setResultPersistenceMode).toHaveBeenCalledWith('account');
      expect(persist.migrateGuestResults).toHaveBeenCalledTimes(1);
   });

   it('should migrate once the pending session resolves to a user', () => {
      const { rerender } = render(<ResultSync />);
      expect(persist.migrateGuestResults).not.toHaveBeenCalled();

      sessionState.value = {
         data: { user: { id: 'user-1' } },
         isPending: false,
      };
      rerender(<ResultSync />);

      expect(persist.setResultPersistenceMode).toHaveBeenCalledWith('account');
      expect(persist.migrateGuestResults).toHaveBeenCalledTimes(1);
   });

   it('should return to guest persistence after sign-out', () => {
      sessionState.value = {
         data: { user: { id: 'user-1' } },
         isPending: false,
      };
      const { rerender } = render(<ResultSync />);
      persist.setResultPersistenceMode.mockClear();
      persist.migrateGuestResults.mockClear();

      sessionState.value = { data: { user: { id: '' } }, isPending: false };
      rerender(<ResultSync />);

      expect(persist.setResultPersistenceMode).toHaveBeenCalledWith('guest');
      expect(persist.migrateGuestResults).not.toHaveBeenCalled();
   });
});
