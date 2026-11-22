import { afterEach, describe, expect, it } from 'vitest';
import { feedbackStore } from '@/store/feedback';
import { typingShortcutsBlocked } from './shortcuts';

describe('typingShortcutsBlocked', () => {
   afterEach(() => {
      feedbackStore.setState({ open: false, testActive: false });
   });

   it('should block all typing shortcuts while the feedback dialog is open', () => {
      feedbackStore.setState({ open: true });

      expect(typingShortcutsBlocked(null)).toBe(true);
      expect(typingShortcutsBlocked(document.createElement('textarea'))).toBe(
         true
      );
   });

   it('should block shortcuts from inside the dialog even when store.open is false', () => {
      const dialog = document.createElement('div');
      dialog.dataset.feedbackDialog = 'true';
      const field = document.createElement('textarea');
      dialog.append(field);

      expect(typingShortcutsBlocked(field)).toBe(true);
      expect(typingShortcutsBlocked(dialog)).toBe(true);
   });

   it('should allow shortcuts on the typing field when the dialog is closed', () => {
      const field = document.createElement('textarea');
      field.dataset.typingField = 'true';

      expect(typingShortcutsBlocked(field)).toBe(false);
      expect(typingShortcutsBlocked(null)).toBe(false);
   });
});
