import { describe, expect, it } from 'vitest';
import { isRestartBlockedTarget, tabRestarts } from './restart-key';

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

describe('isRestartBlockedTarget', () => {
   it.each(['a', 'button', 'input', 'select', 'textarea', 'summary'])(
      'should block tab-restart from a %s',
      (tag) => {
         expect(isRestartBlockedTarget(document.createElement(tag))).toBe(true);
      }
   );

   it('should block tab-restart from nested content inside a footer link or Feedback button', () => {
      const link = document.createElement('a');
      const linkLabel = document.createElement('span');
      link.append(linkLabel);

      const button = document.createElement('button');
      const buttonLabel = document.createElement('span');
      button.append(buttonLabel);

      expect(isRestartBlockedTarget(linkLabel)).toBe(true);
      expect(isRestartBlockedTarget(buttonLabel)).toBe(true);
   });

   it.each(['listbox', 'option'])(
      'should block tab-restart from a %s role',
      (role) => {
         const node = document.createElement('div');
         node.setAttribute('role', role);

         expect(isRestartBlockedTarget(node)).toBe(true);
      }
   );

   it('should allow tab-restart from non-interactive results chrome', () => {
      const heading = document.createElement('h1');
      const wrapper = document.createElement('div');

      expect(isRestartBlockedTarget(heading)).toBe(false);
      expect(isRestartBlockedTarget(wrapper)).toBe(false);
      expect(isRestartBlockedTarget(null)).toBe(false);
      expect(isRestartBlockedTarget(window)).toBe(false);
   });
});
