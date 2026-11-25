export function homeFeedbackTestActive(input: {
   wordsMode: boolean;
   wordsRunning: boolean;
   timedRunning: boolean;
}): boolean {
   return input.wordsMode ? input.wordsRunning : input.timedRunning;
}

export function feedbackTriggerProps(testActive: boolean): {
   ariaHidden: boolean;
   tabIndex: number;
   inert: boolean;
} {
   if (testActive) {
      return { ariaHidden: true, tabIndex: -1, inert: true };
   }

   return { ariaHidden: false, tabIndex: 0, inert: false };
}

export function seedFeedbackEmail(input: {
   current: string;
   sessionEmail: string;
   dirty: boolean;
}): string {
   if (input.dirty) return input.current;
   return input.current.trim() || input.sessionEmail;
}
