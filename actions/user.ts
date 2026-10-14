'use server';

import { headers } from 'next/headers';
import { getAuth } from '@/auth';
import {
   INVALID_CREDENTIALS_MESSAGE,
   mapBetterAuthError,
   resolveRegisterAuthFailure,
} from '@/lib/auth/error-messages';
import { loginSchema, registerSchema } from '@/lib/validation/auth.schema';
import { ZodError } from 'zod';

export type ActionResponse = {
   error?: string;
   success?: boolean;
};

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
         return { error: error.issues[0].message };
      }

      return resolveRegisterAuthFailure(error);
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
         return {
            error: error.issues[0]?.message ?? INVALID_CREDENTIALS_MESSAGE,
         };
      }

      const mapped = mapBetterAuthError(error);
      if (mapped) return { error: mapped };

      return { error: 'Something went wrong. Please try again.' };
   }
};

export { register, login };
