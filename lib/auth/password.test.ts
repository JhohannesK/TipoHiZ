// @vitest-environment node
import { hash } from 'bcryptjs';
import { hashPassword } from 'better-auth/crypto';
import { describe, expect, it } from 'vitest';
import { isBcryptHash, verifyStoredPassword } from './password';

describe('verifyStoredPassword', () => {
   it.each(['$2a$', '$2b$', '$2y$'])(
      'should accept a %s bcrypt hash and reject the wrong password',
      async (prefix) => {
         const hashed = (await hash('correct horse', 4)).replace(
            /^\$2[aby]\$/,
            prefix
         );

         expect(isBcryptHash(hashed)).toBe(true);
         await expect(
            verifyStoredPassword({ hash: hashed, password: 'correct horse' })
         ).resolves.toBe(true);
         await expect(
            verifyStoredPassword({ hash: hashed, password: 'wrong password' })
         ).resolves.toBe(false);
      }
   );

   it('should fall back to scrypt verification for new Better Auth hashes', async () => {
      const hashed = await hashPassword('new-signup-password');

      expect(isBcryptHash(hashed)).toBe(false);
      await expect(
         verifyStoredPassword({
            hash: hashed,
            password: 'new-signup-password',
         })
      ).resolves.toBe(true);
      await expect(
         verifyStoredPassword({ hash: hashed, password: 'wrong password' })
      ).resolves.toBe(false);
   });
});
