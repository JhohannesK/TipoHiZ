export interface RestartKeyInput {
   key: string;
   shiftKey: boolean;
   altKey: boolean;
   metaKey: boolean;
   ctrlKey: boolean;
   targetInteractive: boolean;
}

export function tabRestarts(input: RestartKeyInput): boolean {
   if (input.targetInteractive) return false;
   if (input.shiftKey || input.altKey || input.metaKey || input.ctrlKey) {
      return false;
   }
   return input.key === 'Tab';
}

export function isRestartBlockedTarget(target: EventTarget | null): boolean {
   if (!(target instanceof Element)) return false;
   return Boolean(
      target.closest(
         'a, button, input, select, textarea, summary, [role="listbox"], [role="option"]'
      )
   );
}
