import { describe, expect, it } from 'vitest';
import { abortFeedbackRequest, beginFeedbackRequest } from './request';

type AbortAt = 'wait' | 'fetch' | 'success-timeout';

function runSend(abortAt: AbortAt | null): {
   posted: boolean;
   appliedStatus: boolean;
   autoClosed: boolean;
} {
   const ref = { current: 0 };
   const send = beginFeedbackRequest(ref);

   if (abortAt === 'wait') abortFeedbackRequest(ref);
   if (!send.isLive()) {
      return { posted: false, appliedStatus: false, autoClosed: false };
   }

   if (abortAt === 'fetch') abortFeedbackRequest(ref);
   if (!send.isLive()) {
      return { posted: true, appliedStatus: false, autoClosed: false };
   }

   if (abortAt === 'success-timeout') abortFeedbackRequest(ref);
   if (!send.isLive()) {
      return { posted: true, appliedStatus: true, autoClosed: false };
   }

   return { posted: true, appliedStatus: true, autoClosed: true };
}

describe('beginFeedbackRequest', () => {
   it('should stay live across wait, fetch, and success-timeout when the dialog stays open', () => {
      expect(runSend(null)).toEqual({
         posted: true,
         appliedStatus: true,
         autoClosed: true,
      });
   });
});

describe('abortFeedbackRequest', () => {
   it('should drop a send aborted during the min-fill wait so it does not POST', () => {
      expect(runSend('wait')).toEqual({
         posted: false,
         appliedStatus: false,
         autoClosed: false,
      });
   });

   it('should drop a send aborted while fetch is in flight so success or error is not applied', () => {
      expect(runSend('fetch')).toEqual({
         posted: true,
         appliedStatus: false,
         autoClosed: false,
      });
   });

   it('should not auto-close after success if the dialog was closed during the thanks timeout', () => {
      expect(runSend('success-timeout')).toEqual({
         posted: true,
         appliedStatus: true,
         autoClosed: false,
      });
   });

   it('should not apply an in-flight send after a later send starts', () => {
      const ref = { current: 0 };
      const first = beginFeedbackRequest(ref);
      abortFeedbackRequest(ref);
      const second = beginFeedbackRequest(ref);

      expect(first.isLive()).toBe(false);
      expect(second.isLive()).toBe(true);
   });

   it('should keep a reopened dialog from inheriting a previous send timeout', () => {
      const ref = { current: 0 };
      const first = beginFeedbackRequest(ref);
      abortFeedbackRequest(ref);

      expect(first.isLive()).toBe(false);

      const second = beginFeedbackRequest(ref);
      abortFeedbackRequest(ref);
      expect(second.isLive()).toBe(false);
      expect(first.isLive()).toBe(false);
   });

   it('should still own a send started after a close with no in-flight request', () => {
      const ref = { current: 0 };
      abortFeedbackRequest(ref);
      const send = beginFeedbackRequest(ref);

      expect(send.isLive()).toBe(true);
      expect(send.id).toBe(2);
   });
});
