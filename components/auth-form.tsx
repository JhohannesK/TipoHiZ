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
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { OAuthButtons } from './oauth-buttons';
import { SvgRender } from './SvgRender';

interface AuthFormProps {
   mode: 'login' | 'register';
   action: (formData: FormData) => Promise<ActionResponse>;
   error?: string;
}

const AuthForm = ({ mode, action, error }: AuthFormProps) => {
   const [loading, setLoading] = React.useState(false);
   const [name, setName] = React.useState('');
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [showPassword, setShowPassword] = React.useState(false);
   const router = useRouter();

   async function onSubmit(formData: FormData) {
      const nextName = String(formData.get('name') ?? '');
      const nextEmail = String(formData.get('email') ?? '');

      try {
         setLoading(true);
         const response = await action(formData);

         if (response.error) {
            // React 19 resets uncontrolled fields after a form action.
            // Keep name/email; clear password only.
            if (mode === 'register') setName(nextName);
            setEmail(nextEmail);
            setPassword('');
            toast.error(response.error);
            return;
         }

         if (response.success) {
            toast('Success!');
            router.push(mode === 'login' ? '/' : '/login');
            router.refresh();
         }
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
         if (mode === 'register') setName(nextName);
         setEmail(nextEmail);
         setPassword('');
         toast.error('Something went wrong. Please try again.');
      } finally {
         setLoading(false);
      }
   }

   return (
      <Card className="w-[350px] sm:w-[400px]">
         <CardHeader>
            <CardTitle className="flex flex-col items-center gap-3">
               <div className="flex items-center justify-center gap-x-2">
                  <SvgRender />
                  <p className="text-xl font-bold select-none text-input hover:animate-shake">
                     TipoHiz.__
                  </p>
               </div>
               <p className="font-bold">
                  {mode === 'login' ? 'Login' : 'Create Account'}
               </p>
            </CardTitle>
            <CardDescription className="text-center">
               {mode === 'login'
                  ? 'Enter your credentials to login'
                  : 'Enter your details to create an account'}
            </CardDescription>
         </CardHeader>
         <CardContent>
            {error ? (
               <p role="alert" className="mb-3 text-sm text-wrong_char">
                  {error}
               </p>
            ) : null}
            <OAuthButtons />
            <form action={onSubmit} className="flex flex-col gap-3">
               {mode === 'register' && (
                  <div>
                     <Label htmlFor="name">Name</Label>
                     <Input
                        id="name"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                     />
                  </div>
               )}
               <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                     id="email"
                     name="email"
                     type="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     autoComplete="email"
                  />
               </div>
               <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                     <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={
                           mode === 'login'
                              ? 'current-password'
                              : 'new-password'
                        }
                        className="pr-10"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                        aria-label={
                           showPassword ? 'Hide password' : 'Show password'
                        }
                        tabIndex={0}
                     >
                        {showPassword ? (
                           <EyeOff className="h-4 w-4" aria-hidden />
                        ) : (
                           <Eye className="h-4 w-4" aria-hidden />
                        )}
                     </button>
                  </div>
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
