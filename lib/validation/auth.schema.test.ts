import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './auth.schema';

const validRegister = {
   name: 'Ada',
   email: 'ada@example.com',
   password: 'Str0ng!pass',
};

describe('registerSchema', () => {
   it('should accept a minimal valid payload', () => {
      expect(registerSchema.parse(validRegister)).toEqual(validRegister);
   });

   it('should reject a short name', () => {
      const parsed = registerSchema.safeParse({
         ...validRegister,
         name: 'Ad',
      });
      expect(parsed.success).toBe(false);
      if (parsed.success) return;
      expect(parsed.error.issues[0]?.message).toBe(
         'Name must be at least 3 characeters long'
      );
   });

   it('should reject an invalid email', () => {
      const parsed = registerSchema.safeParse({
         ...validRegister,
         email: 'not-an-email',
      });
      expect(parsed.success).toBe(false);
      if (parsed.success) return;
      expect(parsed.error.issues[0]?.message).toBe('Invalid email address');
   });

   it('should reject a password shorter than 8 characters', () => {
      const parsed = registerSchema.safeParse({
         ...validRegister,
         password: 'Ab1!',
      });
      expect(parsed.success).toBe(false);
      if (parsed.success) return;
      expect(parsed.error.issues[0]?.message).toBe(
         'Password must be at least 8 characters long'
      );
   });

   it.each([
      [
         'no uppercase',
         'str0ng!pass',
         'Password must contain at least one uppercase letter',
      ],
      [
         'no lowercase',
         'STR0NG!PASS',
         'Password must contain at least one lowercase letter',
      ],
      ['no number', 'Strong!pass', 'Password must contain at least one number'],
      [
         'no special character',
         'Str0ngPass',
         'Password must contain at least one special character',
      ],
   ] as const)(
      'should reject a password with %s',
      (_label, password, message) => {
         const parsed = registerSchema.safeParse({
            ...validRegister,
            password,
         });
         expect(parsed.success).toBe(false);
         if (parsed.success) return;
         expect(parsed.error.issues.map((issue) => issue.message)).toContain(
            message
         );
      }
   );
});

describe('loginSchema', () => {
   it('should accept email plus a password of at least 8 characters', () => {
      expect(
         loginSchema.parse({
            email: 'ada@example.com',
            password: 'password',
         })
      ).toEqual({
         email: 'ada@example.com',
         password: 'password',
      });
   });

   it('should reject an invalid email', () => {
      const parsed = loginSchema.safeParse({
         email: 'ada',
         password: 'password',
      });
      expect(parsed.success).toBe(false);
      if (parsed.success) return;
      expect(parsed.error.issues[0]?.message).toBe('Invalid email address');
   });

   it('should reject a short password even when the email is valid', () => {
      const parsed = loginSchema.safeParse({
         email: 'ada@example.com',
         password: 'short',
      });
      expect(parsed.success).toBe(false);
      if (parsed.success) return;
      expect(parsed.error.issues[0]?.message).toBe(
         'Password must be at least 8 characters long'
      );
   });
});
