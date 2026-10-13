'use server';

import { headers } from 'next/headers';
import { APIError } from 'better-auth/api';
import { getAuth } from '@/auth';
import { loginSchema, registerSchema } from '@/lib/validation/auth.schema';
import { ZodError } from 'zod';

export type ActionResponse = {
   error?: string;
   success?: boolean;
};

function authErrorCode(error: APIError): string | undefined {
   const body = error.body;
   if (body && typeof body === 'object' && 'code' in body) {
      const code = body.code;
      return typeof code === 'string' ? code : undefined;
   }
   return undefined;
}

const register = async (formData: FormData): Promise<ActionResponse> => {
   try {
      const rawData = Object.fromEntries(formData.entries());
      const validatedData = registerSchema.parse(rawData);

      await getAuth().api.signUpEmail({
         body: {
            name: validatedData.name,
            email: validatedData.email,
            password: validatedData.password,
         },
         headers: await headers(),
      });

      return { success: true };
   } catch (error) {
      if (error instanceof ZodError) {
         return { error: error.errors[0].message };
      }

      if (error instanceof APIError) {
         const code = authErrorCode(error);
         if (
            code === 'USER_ALREADY_EXISTS' ||
            code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
         ) {
            return { error: 'User already exists with this email' };
         }
      }

      return { error: 'An unexpected error occured' };
   }
};

const login = async (formData: FormData): Promise<ActionResponse> => {
   try {
      const rawData = Object.fromEntries(formData.entries());
      const validatedData = loginSchema.parse(rawData);

      await getAuth().api.signInEmail({
         body: {
            email: validatedData.email,
            password: validatedData.password,
         },
         headers: await headers(),
      });

      return { success: true };
   } catch (error) {
      if (error instanceof ZodError) {
         return { error: 'Authentication failed' };
      }

      if (error instanceof APIError) {
         const code = authErrorCode(error);
         if (code === 'INVALID_EMAIL_OR_PASSWORD') {
            return { error: 'Invalid credentials' };
         }
      }

      return { error: 'An unexpected error occured' };
   }
};

export { register, login };
