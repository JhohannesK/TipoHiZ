import { describe, expect, it } from 'vitest';
import {
   feedbackTriggerProps,
   homeFeedbackTestActive,
   seedFeedbackEmail,
} from './dialog';

describe('homeFeedbackTestActive', () => {
   it('should follow the words clock in words mode, even if the timed countdown is still running', () => {
      expect(
         homeFeedbackTestActive({
            wordsMode: true,
            wordsRunning: true,
            timedRunning: false,
         })
      ).toBe(true);
      expect(
         homeFeedbackTestActive({
            wordsMode: true,
            wordsRunning: false,
            timedRunning: true,
         })
      ).toBe(false);
   });

   it('should follow the timed clock in time mode, even if words elapsed is still running', () => {
      expect(
         homeFeedbackTestActive({
            wordsMode: false,
            wordsRunning: false,
            timedRunning: true,
         })
      ).toBe(true);
      expect(
         homeFeedbackTestActive({
            wordsMode: false,
            wordsRunning: true,
            timedRunning: false,
         })
      ).toBe(false);
   });

   it('should stay inactive when the active clock is stopped', () => {
      expect(
         homeFeedbackTestActive({
            wordsMode: true,
            wordsRunning: false,
            timedRunning: false,
         })
      ).toBe(false);
      expect(
         homeFeedbackTestActive({
            wordsMode: false,
            wordsRunning: false,
            timedRunning: false,
         })
      ).toBe(false);
   });
});

describe('feedbackTriggerProps', () => {
   it('should take the Feedback trigger out of tab order while a test is running', () => {
      expect(feedbackTriggerProps(true)).toEqual({
         ariaHidden: true,
         tabIndex: -1,
         inert: true,
      });
   });

   it('should restore the trigger after the test stops', () => {
      expect(feedbackTriggerProps(false)).toEqual({
         ariaHidden: false,
         tabIndex: 0,
         inert: false,
      });
   });
});

describe('seedFeedbackEmail', () => {
   it('should fill a blank field from the session when the user has not edited it', () => {
      expect(
         seedFeedbackEmail({
            current: '',
            sessionEmail: 'person@example.com',
            dirty: false,
         })
      ).toBe('person@example.com');
      expect(
         seedFeedbackEmail({
            current: '   ',
            sessionEmail: 'person@example.com',
            dirty: false,
         })
      ).toBe('person@example.com');
   });

   it('should keep a typed address and trim it when the field is not dirty', () => {
      expect(
         seedFeedbackEmail({
            current: '  other@example.com  ',
            sessionEmail: 'person@example.com',
            dirty: false,
         })
      ).toBe('other@example.com');
   });

   it('should not refill from the session after the user clears a dirty field', () => {
      expect(
         seedFeedbackEmail({
            current: '',
            sessionEmail: 'person@example.com',
            dirty: true,
         })
      ).toBe('');
      expect(
         seedFeedbackEmail({
            current: '   ',
            sessionEmail: 'person@example.com',
            dirty: true,
         })
      ).toBe('   ');
   });
});
