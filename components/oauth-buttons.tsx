'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { BsGoogle } from 'react-icons/bs';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

const providers = [
   { id: 'google', label: 'Continue with Google', icon: BsGoogle },
   { id: 'github', label: 'Continue with GitHub', icon: FaGithub },
   { id: 'twitter', label: 'Continue with X', icon: FaXTwitter },
] as const;

export function OAuthButtons() {
   return (
      <div className="grid grid-cols-1 gap-3">
         {providers.map((provider) => {
            const Icon = provider.icon;
            return (
               <Button
                  key={provider.id}
                  variant="outline"
                  onClick={() =>
                     authClient.signIn.social({
                        provider: provider.id,
                        callbackURL: '/',
                        errorCallbackURL: '/login',
                     })
                  }
                  className="w-full"
               >
                  <Icon className="mr-2 h-5 w-5" />
                  {provider.label}
               </Button>
            );
         })}

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
