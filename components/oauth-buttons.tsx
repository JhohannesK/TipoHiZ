import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { BsGoogle } from 'react-icons/bs';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

export function OAuthButtons() {
   return (
      <div className="grid grid-cols-1 gap-3">
         <Button
            variant="outline"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full"
         >
            <BsGoogle />
            Continue with Google
         </Button>

         <Button
            variant="outline"
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full"
         >
            <FaGithub className="mr-2 h-5 w-5" />
            Continue with GitHub
         </Button>

         <Button
            variant="outline"
            onClick={() => signIn('twitter', { callbackUrl: '/' })}
            className="w-full"
         >
            <FaXTwitter className="mr-2 h-5 w-5" />
            Continue with X
         </Button>

         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
               </span>
            </div>
         </div>
      </div>
   );
}
