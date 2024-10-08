'use server';

import { signIn } from '@/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { hash } from 'bcryptjs';
import { redirect } from 'next/navigation';

const register = async (formData: FormData) => {
   const name = formData.get('name') as string;
   const email = formData.get('email') as string;
   const password = formData.get('password') as string;

   if (!name || !email || !password) throw new Error('Please fill all fields');

   await connectDB();

   const existingUser = await User.findOne({ email });

   if (existingUser) throw new Error('User already exists with given email.');

   const hashedPassword = await hash(password, 10);

   await User.create({ name, email, password: hashedPassword });
   redirect('/login');
};

const login = async (formData: FormData) => {
   const email = formData.get('email') as string;
   const password = formData.get('password') as string;

   try {
      await signIn('credentials', {
         redirect: false,
         callbackUrl: '/',
         email,
         password,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error: any) {
      console.error(error.message);
   }
   redirect('/');
};

export { register, login };
