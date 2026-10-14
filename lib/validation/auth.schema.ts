import { z } from 'zod';

export const loginSchema = z.object({
   email: z.email({ error: 'Invalid email address' }),
   password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' }),
});

export const registerSchema = z.object({
   name: z
      .string()
      .min(3, { error: 'Name must be at least 3 characeters long' }),
   email: z.email({ error: 'Invalid email address' }),
   password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
         error: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
         error: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
         error: 'Password must contain at least one special character',
      }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
