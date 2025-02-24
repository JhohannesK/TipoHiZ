'use client';
import { ActionResponse } from '@/actions/user';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface AuthFormProps {
   mode: 'login' | 'register';
   action: (formData: FormData) => Promise<ActionResponse>;
}

const AuthForm = ({ mode, action }: AuthFormProps) => {
   const [loading, setLoading] = React.useState(false);
   const router = useRouter();

   async function onSubmit(formData: FormData) {
      try {
         setLoading(true);
         const response = await action(formData);

         if (response.error) {
            toast.error(response.error);
            return;
         }

         if (response.success) {
            toast('Success!');
            router.push(mode === 'login' ? '/' : '/login');
         }
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
         toast.error('Someting went wrong. Please try again.');
      } finally {
         setLoading(false);
      }
   }

   return (
      <Card className="w-[350px] sm:w-[400px]">
         <CardHeader>
            <CardTitle>
               {mode === 'login' ? 'Login' : 'Create Account'}
            </CardTitle>
            <CardDescription>
               {mode === 'login'
                  ? 'Enter your credentials to login'
                  : 'Enter your details to create an account'}
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form action={onSubmit} className="flex flex-col gap-3">
               {mode === 'register' && (
                  <div>
                     <Label htmlFor="name">Name</Label>
                     <Input id="name" name="name" required />
                  </div>
               )}
               <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" required />
               </div>
               <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     name="password"
                     type="password"
                     required
                  />
               </div>
               <Button
                  type="submit"
                  className="w-full border-accent bg-correct_char/30"
                  disabled={loading}
               >
                  {loading ? (
                     <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin">
                           Please wait...
                        </Loader2>
                     </>
                  ) : mode === 'login' ? (
                     'Login'
                  ) : (
                     'Register'
                  )}
               </Button>
            </form>
         </CardContent>
         <CardFooter className="flex justify-center flex-col gap-2">
            <p className="text-sm text-muted-foreground">
               {mode === 'login' ? (
                  <>
                     Don&apos;t have an account?
                     <Link
                        href="/register"
                        className="ml-3 text-correct_char hover:underline"
                     >
                        Sign up
                     </Link>
                  </>
               ) : (
                  <>
                     Already have an account?{' '}
                     <Link
                        href="/login"
                        className="text-primary hover:underline"
                     >
                        Sign in
                     </Link>
                  </>
               )}
            </p>
            <Link
               href={'/'}
               className="flex text-sm items-center hover:text-wrong_char transition-all duration-300"
            >
               Continue without signing in <ArrowRight />
            </Link>
         </CardFooter>
      </Card>
   );
};

export default AuthForm;
