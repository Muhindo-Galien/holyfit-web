import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Clerk's middleware, on the two routes that need it and nowhere else.
 *
 * The usual matcher for this SDK covers the whole site. That is wrong here: the
 * marketing pages and both legal documents carry no Clerk provider, need no
 * auth context, and are claimed on the privacy page to load no third-party
 * script. Running the middleware across them would add a hop to every request
 * for no benefit and quietly undermine the claim.
 *
 * Keep this matcher in step with where `ClerkProvider` is mounted —
 * `app/waitlist/layout.tsx` and `app/admin/layout.tsx`. They are one decision
 * in two files: `auth()` inside `/admin` returns nothing at all unless this
 * middleware ran for the request, so a page added to one list and not the other
 * fails as "signed out" for somebody who is signed in.
 *
 * `/admin/:path*` as well as `/admin`, because the editors live underneath it.
 */
export default clerkMiddleware();

export const config = {
  matcher: ['/waitlist', '/admin', '/admin/:path*']
};
