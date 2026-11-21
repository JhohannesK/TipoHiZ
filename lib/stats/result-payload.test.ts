import { describe, expect, it } from 'vitest';
import { resultPayloadFromBody } from './result-payload';

const SUBMISSION = {
   id: 'result-1234',
   createdAt: '2026-11-02T10:00:00.000Z',
};

describe('resultPayloadFromBody', () => {
   it('should unwrap a result envelope', () => {
      expect(resultPayloadFromBody({ result: SUBMISSION })).toEqual(SUBMISSION);
   });

   it('should keep a bare submission', () => {
      expect(resultPayloadFromBody(SUBMISSION)).toEqual(SUBMISSION);
   });

   it('should not unwrap arrays or a missing envelope', () => {
      expect(resultPayloadFromBody([SUBMISSION])).toEqual([SUBMISSION]);
      expect(resultPayloadFromBody(null)).toBeNull();
      expect(resultPayloadFromBody({ result: null })).toBeNull();
   });
});
