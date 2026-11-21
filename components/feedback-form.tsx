'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import {
   MESSAGE_MAX_LENGTH,
   MESSAGE_MIN_LENGTH,
   MIN_FILL_MS,
   optionalEmailOk,
} from '@/lib/feedback/schema';
import { feedbackStore } from '@/store/feedback';
import { userConfigStore } from '@/store';
import { Button } from './ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type SendStatus = 'idle' | 'sending' | 'success' | 'error';

function modeLabel(): string {
   const { category, time, wordCount } = userConfigStore.getState();
   if (category === 'words') return `words ${wordCount}`;
   return `time ${time}`;
}

function clip(value: string): string {
   return value.slice(0, 300);
}

function statusCopy(statusCode: number): string {
   if (statusCode === 429) {
      return "You've sent a few already. Try again in a minute.";
   }
   if (statusCode === 503) return 'Feedback is unavailable right now.';
   return "Couldn't send. Try again.";
}

export default function FeedbackForm() {
   const pathname = usePathname();
   const { theme } = useTheme();
   const session = authClient.useSession();
   const testActive = feedbackStore((state) => state.testActive);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const requestId = useRef(0);
   const [open, setOpen] = useState(false);
   const [openedAt, setOpenedAt] = useState(0);
   const [message, setMessage] = useState('');
   const [email, setEmail] = useState('');
   const [emailDirty, setEmailDirty] = useState(false);
   const [website, setWebsite] = useState('');
   const [status, setStatus] = useState<SendStatus>('idle');
   const [error, setError] = useState('');

   const sessionEmail = session.data?.user?.email ?? '';
   const trimmed = message.trim();
   const emailOk = optionalEmailOk(email);
   const canSend =
      trimmed.length >= MESSAGE_MIN_LENGTH &&
      emailOk &&
      status !== 'sending' &&
      status !== 'success';
   const showCount = message.length >= MESSAGE_MAX_LENGTH - 100;

   function onOpenChange(next: boolean) {
      feedbackStore.setState({ open: next });
      setOpen(next);
      if (next) {
         setOpenedAt(Date.now());
         setStatus('idle');
         setError('');
         if (!emailDirty) {
            setEmail((current) => current.trim() || sessionEmail);
         }
         return;
      }
      requestId.current += 1;
   }

   async function send() {
      if (!canSend) return;

      const id = requestId.current + 1;
      requestId.current = id;
      setStatus('sending');
      setError('');

      const wait = MIN_FILL_MS - (Date.now() - openedAt);
      if (wait > 0) {
         await new Promise((resolve) => {
            window.setTimeout(resolve, wait);
         });
      }

      if (requestId.current !== id) return;

      try {
         const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               message,
               email: email.trim(),
               website,
               openedAt,
               context: {
                  page: clip(pathname || '/'),
                  theme: clip(theme || ''),
                  mode: clip(modeLabel()),
                  userAgent: clip(
                     typeof navigator === 'undefined' ? '' : navigator.userAgent
                  ),
               },
            }),
         });

         if (requestId.current !== id) return;

         if (!response.ok) {
            setStatus('error');
            setError(statusCopy(response.status));
            return;
         }

         setStatus('success');
         window.setTimeout(() => {
            if (requestId.current !== id) return;
            onOpenChange(false);
            setStatus('idle');
         }, 2000);
      } catch {
         if (requestId.current !== id) return;
         setStatus('error');
         setError("Couldn't send. Try again.");
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild>
            <button
               ref={triggerRef}
               type="button"
               aria-hidden={testActive}
               tabIndex={testActive ? -1 : 0}
               className={`text-input transition-opacity duration-[250ms] ${
                  testActive ? 'pointer-events-none opacity-0' : 'opacity-100'
               }`}
            >
               Feedback
            </button>
         </DialogTrigger>
         <DialogContent
            data-feedback-dialog="true"
            className="max-w-md border-input bg-background text-input"
            onCloseAutoFocus={(event) => {
               event.preventDefault();
               triggerRef.current?.focus();
            }}
         >
            <DialogHeader>
               <DialogTitle>Feedback</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
               <div className="grid gap-1.5">
                  <Label htmlFor="feedback-message">
                     What&apos;s on your mind?
                  </Label>
                  <textarea
                     id="feedback-message"
                     required
                     maxLength={MESSAGE_MAX_LENGTH}
                     value={message}
                     onChange={(event) => setMessage(event.target.value)}
                     className="flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-input shadow-sm placeholder:text-input/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {showCount ? (
                     <p className="text-xs text-input/80">
                        {message.length}/{MESSAGE_MAX_LENGTH}
                     </p>
                  ) : null}
                  {trimmed.length < MESSAGE_MIN_LENGTH ? (
                     <p className="text-xs text-input/80">
                        At least 10 characters
                     </p>
                  ) : null}
               </div>
               <div className="grid gap-1.5">
                  <Label htmlFor="feedback-email">
                     Email (optional, only if you want a reply)
                  </Label>
                  <Input
                     id="feedback-email"
                     type="email"
                     autoComplete="email"
                     className="border-input bg-background text-input placeholder:text-input/50"
                     value={email}
                     onChange={(event) => {
                        setEmailDirty(true);
                        setEmail(event.target.value);
                     }}
                  />
                  {!emailOk ? (
                     <p className="text-xs text-input/80">
                        Enter a valid email
                     </p>
                  ) : null}
               </div>
               <div aria-hidden="true" className="absolute left-[-10000px]">
                  <label htmlFor="feedback-website">Website</label>
                  <input
                     id="feedback-website"
                     name="website"
                     type="text"
                     tabIndex={-1}
                     autoComplete="off"
                     value={website}
                     onChange={(event) => setWebsite(event.target.value)}
                  />
               </div>
               <DialogDescription className="text-input/80">
                  We&apos;ll include: page, theme, browser
               </DialogDescription>
               {status === 'success' ? (
                  <p className="text-sm text-input" role="status">
                     Thanks, sent.
                  </p>
               ) : null}
               {status === 'error' ? (
                  <p className="text-sm text-wrong_char" role="alert">
                     {error}
                  </p>
               ) : null}
            </div>
            <DialogFooter>
               <Button
                  type="button"
                  variant="outline"
                  className="border-input bg-background text-input hover:bg-accent/20 hover:text-input"
                  onClick={() => onOpenChange(false)}
               >
                  Cancel
               </Button>
               <Button
                  type="button"
                  disabled={!canSend}
                  className="bg-input text-background transition-none hover:bg-input disabled:border disabled:border-input disabled:bg-background disabled:text-input disabled:opacity-100"
                  onClick={() => void send()}
               >
                  {status === 'sending' ? 'Sending…' : 'Send'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
