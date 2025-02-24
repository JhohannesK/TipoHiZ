import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Twitter from 'next-auth/providers/twitter';

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prisma),
   session: {
      strategy: 'jwt',
   },
   providers: [
      Google({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      GitHub({
         clientId: process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      Twitter({
         clientId: process.env.TWITTER_CLIENT_ID,
         clientSecret: process.env.TWITTER_CLIENT_SECRET,
      }),
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

            const isMatch = await compare(password, user.password);

            if (!isMatch) throw new Error('Invalid credentials.');

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
      error: '/login',
   },
});
