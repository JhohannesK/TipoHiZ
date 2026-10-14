import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetStores } from '../test/utils';
import { resetTest } from './reset';

describe('resetTest', () => {
   beforeEach(() => {
      resetStores();
   });

   afterEach(() => {
      document.body.replaceChildren();
   });

   it('should finish the reset when the start view is missing', async () => {
      const reset = vi.fn();

      await expect(resetTest('default', reset)).resolves.toBeUndefined();

      expect(reset).toHaveBeenCalledTimes(1);
   });

   it('should scroll the start view into view when the element exists', async () => {
      const startView = document.createElement('div');
      startView.className = 'startView';
      const scrollIntoView = vi.fn();
      startView.scrollIntoView = scrollIntoView;
      document.body.appendChild(startView);

      await resetTest('default', vi.fn());

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
   });
});
