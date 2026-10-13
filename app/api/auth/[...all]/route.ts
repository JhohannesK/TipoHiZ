import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/auth';

function handlers() {
   return toNextJsHandler(getAuth());
}

export function GET(request: Request) {
   return handlers().GET(request);
}

export function POST(request: Request) {
   return handlers().POST(request);
}
