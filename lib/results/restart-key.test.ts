import { describe, expect, it } from 'vitest';
import { tabRestarts } from './restart-key';

const idle = {
   key: 'Tab',
   shiftKey: false,
   altKey: false,
   metaKey: false,
   ctrlKey: false,
   targetInteractive: false,
};

describe('tabRestarts', () => {
   it('should restart when tab is pressed outside a control', () => {
      expect(tabRestarts(idle)).toBe(true);
   });

   it('should ignore tab on a link, button, or summary', () => {
      expect(tabRestarts({ ...idle, targetInteractive: true })).toBe(false);
   });

   it.each(['Shift', 'Enter', 'a', ' '])('should ignore %s', (key) => {
      expect(tabRestarts({ ...idle, key })).toBe(false);
   });

   it('should ignore modified tab chords', () => {
      expect(tabRestarts({ ...idle, shiftKey: true })).toBe(false);
      expect(tabRestarts({ ...idle, ctrlKey: true })).toBe(false);
      expect(tabRestarts({ ...idle, metaKey: true })).toBe(false);
      expect(tabRestarts({ ...idle, altKey: true })).toBe(false);
   });
});
