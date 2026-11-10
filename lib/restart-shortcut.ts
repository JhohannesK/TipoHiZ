const NON_TEXT_INPUT_TYPES = new Set([
   'button',
   'checkbox',
   'color',
   'file',
   'hidden',
   'image',
   'radio',
   'range',
   'reset',
   'submit',
]);

type ShortcutEvent = {
   key: string;
   shiftKey: boolean;
   ctrlKey: boolean;
   altKey: boolean;
   metaKey: boolean;
   repeat?: boolean;
};

export function isShiftEnter(event: ShortcutEvent): boolean {
   return (
      event.key === 'Enter' &&
      event.shiftKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      !event.repeat
   );
}

function isTextEntry(element: HTMLElement): boolean {
   if (element.dataset.typingField !== undefined) return false;

   if (element instanceof HTMLTextAreaElement) return true;
   if (element instanceof HTMLSelectElement) return true;

   if (element instanceof HTMLInputElement) {
      return !NON_TEXT_INPUT_TYPES.has(element.type);
   }

   if (element.getAttribute('role') === 'textbox') return true;

   const editable = element.getAttribute('contenteditable');
   return editable !== null && editable !== 'false';
}

export function isTypingInOtherField(target: EventTarget | null): boolean {
   if (!(target instanceof Element)) return false;

   const field = target.closest(
      'input, textarea, select, [contenteditable], [role="textbox"]'
   );

   if (!(field instanceof HTMLElement)) return false;

   return isTextEntry(field);
}
