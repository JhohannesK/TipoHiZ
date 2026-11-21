import { feedbackStore } from '@/store/feedback';

export function typingShortcutsBlocked(target: EventTarget | null): boolean {
   if (feedbackStore.getState().open) return true;

   if (!(target instanceof Element)) return false;

   return Boolean(target.closest('[data-feedback-dialog]'));
}
