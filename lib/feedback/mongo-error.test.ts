import { describe, expect, it } from 'vitest';
import { mongoErrorLabel } from './mongo-error';

describe('mongoErrorLabel', () => {
   it('should keep name and code and drop message text', () => {
      const labelled = mongoErrorLabel(
         Object.assign(new Error('auth failed for resend-key-secret'), {
            name: 'MongoServerError',
            code: 13297,
            errmsg: 'auth failed for resend-key-secret',
         })
      );

      expect(labelled).toEqual({ name: 'MongoServerError', code: 13297 });
      expect(JSON.stringify(labelled)).not.toContain('resend-key-secret');
   });

   it.each([null, 'boom', 13297])(
      'should fall back to Error when the value is %j',
      (value) => {
         expect(mongoErrorLabel(value)).toEqual({
            name: 'Error',
            code: undefined,
         });
      }
   );
});
