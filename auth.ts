import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from './lib/db';
import { User } from './models/User';
import { compare } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
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

            await connectDB();

            const user = await User.findOne({ email }).select('+password');

            if (!user) throw new Error('Invalid credentials.');

            if (!user.password) throw new Error('Invalid password');

            const isMatch = compare(password, user.password);

            if (!isMatch) throw new Error('Incorrect Password.');

            const userData = {
               name: user.name,
               email: user.email,
               id: user._id,
            };

            return userData;
         },
      }),
   ],

   pages: {
      signIn: '/login',
   },
});
