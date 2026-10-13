import { describe, expect, it } from 'vitest';
import { isShiftEnter, isTypingInOtherField } from './restart-shortcut';

describe('restart shortcut', () => {
   it.each`
      shiftKey | ctrlKey  | altKey   | metaKey  | repeat   | expected
      ${true}  | ${false} | ${false} | ${false} | ${false} | ${true}
      ${false} | ${false} | ${false} | ${false} | ${false} | ${false}
      ${true}  | ${true}  | ${false} | ${false} | ${false} | ${false}
      ${true}  | ${false} | ${true}  | ${false} | ${false} | ${false}
      ${true}  | ${false} | ${false} | ${true}  | ${false} | ${false}
      ${true}  | ${false} | ${false} | ${false} | ${true}  | ${false}
   `(
      'should treat shift+enter as $expected when modifiers are shift=$shiftKey ctrl=$ctrlKey alt=$altKey meta=$metaKey repeat=$repeat',
      ({ shiftKey, ctrlKey, altKey, metaKey, repeat, expected }) => {
         expect(
            isShiftEnter({
               key: 'Enter',
               shiftKey,
               ctrlKey,
               altKey,
               metaKey,
               repeat,
            })
         ).toBe(expected);
      }
   );

   it('should ignore shift plus a letter', () => {
      expect(
         isShiftEnter({
            key: 'A',
            shiftKey: true,
            ctrlKey: false,
            altKey: false,
            metaKey: false,
         })
      ).toBe(false);
   });

   it('should ignore a focused button', () => {
      expect(isTypingInOtherField(document.createElement('button'))).toBe(
         false
      );
   });

   it('should ignore the typing field', () => {
      const field = document.createElement('textarea');
      field.dataset.typingField = 'true';

      expect(isTypingInOtherField(field)).toBe(false);
   });

   it('should ignore a checkbox', () => {
      const field = document.createElement('input');
      field.type = 'checkbox';

      expect(isTypingInOtherField(field)).toBe(false);
   });

   it.each(['text', 'email', 'search'])(
      'should detect typing in an %s input',
      (type) => {
         const field = document.createElement('input');
         field.type = type;

         expect(isTypingInOtherField(field)).toBe(true);
      }
   );

   it('should detect typing in a textarea, select, or contenteditable', () => {
      const textarea = document.createElement('textarea');
      const select = document.createElement('select');
      const editor = document.createElement('div');
      editor.setAttribute('contenteditable', 'true');
      const nested = document.createElement('span');
      editor.append(nested);

      expect(isTypingInOtherField(textarea)).toBe(true);
      expect(isTypingInOtherField(select)).toBe(true);
      expect(isTypingInOtherField(nested)).toBe(true);
   });

   it('should ignore a non-editable target', () => {
      expect(isTypingInOtherField(null)).toBe(false);
      expect(isTypingInOtherField(document.createElement('div'))).toBe(false);
   });
});
