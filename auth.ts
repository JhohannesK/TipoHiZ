import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prisma),
   session: {
      strategy: 'jwt',
   },
   providers: [
      Credentials({
         name: 'credentials',
         credentials: {
            email: { label: 'email', type: 'email' },
            password: { label: 'password', type: 'password' },
         },
         authorize: async (credentials) => {
            const email = credentials.email as string | undefined;
            const password = credentials.password as string | undefined;

            if (!email || !password)
               throw new CredentialsSignin(
                  'Please provide both email and password.'
               );

            const user = await prisma.user.findFirst({
               where: {
                  email,
               },
            });

            if (!user) throw new Error('Invalid credentials.');

            if (!user.password) throw new Error('Invalid password');

            const isMatch = compare(password, user.password);

            if (!isMatch) throw new Error('Incorrect Password.');

            const userData = {
               name: user.name,
               email: user.email,
               id: user.id,
            };

            return userData;
         },
      }),
   ],

   pages: {
      signIn: '/login',
   },
});
