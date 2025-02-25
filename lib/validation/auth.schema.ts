import { z } from 'zod';

export const loginSchema = z.object({
   email: z.string().email('Invalid email address'),
   password: z.string().min(8),
});

export const registerSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characeters long'),
   email: z.string().email('Invalid email address'),
   password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
         /^A-Za-z0-9/,
         'Password must contain at least one special character'
      ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
