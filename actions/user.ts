'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/validation/auth.schema';
import { hash } from 'bcryptjs';
import { ZodError } from 'zod';

export type ActionResponse = {
   error?: string;
   success?: boolean;
};

const register = async (formData: FormData): Promise<ActionResponse> => {
   try {
      const rawData = Object.fromEntries(formData.entries());
      const validatedData = registerSchema.parse(rawData);

      const existingUser = await prisma.user.findFirst({
         where: {
            email: validatedData.email,
         },
      });

      if (existingUser) {
         return { error: 'User already exists with this email' };
      }

      const hashedPassword = await hash(validatedData.password, 10);

      await prisma.user.create({
         data: {
            email: validatedData.email,
            name: validatedData.name,
            password: hashedPassword,
         },
      });

      return { success: true };
   } catch (error) {
      if (error instanceof ZodError) {
         return { error: error.errors[0].message };
      }

      return { error: 'An unexpected error occured' };
   }
};

const login = async (formData: FormData): Promise<ActionResponse> => {
   try {
      const rawData = Object.fromEntries(formData.entries());
      const validatedData = loginSchema.parse(rawData);

      const result = await signIn('credentials', {
         redirect: false,
         email: validatedData.email,
         password: validatedData.password,
      });

      if (!result.ok) {
         return { error: 'Invalid credentials' };
      }

      return { success: true };
   } catch (error) {
      if (error instanceof ZodError) {
         return { error: 'Authentication failed' };
      }
      return { error: 'An unexpected error occured' };
   }
};

export { register, login };
