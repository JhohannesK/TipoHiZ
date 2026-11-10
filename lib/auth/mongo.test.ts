import { describe, expect, it } from 'vitest';
import { mongoTransactionsEnabled } from './mongo';

describe('mongoTransactionsEnabled', () => {
   it('should enable transactions for mongodb+srv URIs', () => {
      expect(
         mongoTransactionsEnabled(
            'mongodb+srv://user:pass@cluster0.mongodb.net/tipohiz'
         )
      ).toBe(true);
   });

   it('should enable transactions when replicaSet is in the query string', () => {
      expect(
         mongoTransactionsEnabled(
            'mongodb://localhost:27017/tipohiz?replicaSet=rs0'
         )
      ).toBe(true);
      expect(
         mongoTransactionsEnabled(
            'mongodb://localhost:27017/tipohiz?authSource=admin&replicaSet=rs0'
         )
      ).toBe(true);
   });

   it('should stay off for a standalone localhost URI', () => {
      expect(
         mongoTransactionsEnabled('mongodb://localhost:27017/tipohiz')
      ).toBe(false);
      expect(
         mongoTransactionsEnabled(
            'mongodb://localhost:27017/tipohiz?directConnection=true'
         )
      ).toBe(false);
   });

   it('should not treat replicaSet as a substring of another param', () => {
      expect(
         mongoTransactionsEnabled(
            'mongodb://localhost:27017/tipohiz?notreplicaSet=rs0'
         )
      ).toBe(false);
   });
});
