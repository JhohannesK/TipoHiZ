import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const GUEST_ONLY_PATHS = new Set(['/login', '/register']);

/**
 * Typing stays available without an account. A session cookie only
 * redirects people away from the login and register pages. The cookie
 * check is optimistic; login and register still confirm the session
 * on the server.
 */
export function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl;
   if (!GUEST_ONLY_PATHS.has(pathname)) {
      return NextResponse.next();
   }

   const sessionCookie = getSessionCookie(request);
   if (sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/login', '/register'],
};
