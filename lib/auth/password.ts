import { compare } from 'bcryptjs';
import { verifyPassword as verifyScryptPassword } from 'better-auth/crypto';

const BCRYPT_HASH = /^\$2[aby]\$/;

export function isBcryptHash(hash: string): boolean {
   return BCRYPT_HASH.test(hash);
}

/**
 * Existing credential users were hashed with bcryptjs. New Better Auth
 * signups keep the default scrypt hash, so verification accepts both.
 */
export async function verifyStoredPassword({
   hash,
   password,
}: {
   hash: string;
   password: string;
}): Promise<boolean> {
   if (isBcryptHash(hash)) {
      return compare(password, hash);
   }

   return verifyScryptPassword({ hash, password });
}
