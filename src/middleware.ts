import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Clerk's middleware, on the waitlist route and nowhere else.
 *
 * The usual matcher for this SDK covers the whole site. That is wrong here: the
 * marketing pages and both legal documents carry no Clerk provider, need no
 * auth context, and are claimed on the privacy page to load no third-party
 * script. Running the middleware across them would add a hop to every request
 * for no benefit and quietly undermine the claim.
 *
 * Keep this matcher in step with where `ClerkProvider` is mounted — currently
 * `app/waitlist/layout.tsx`. If a second route ever needs Clerk, both have to
 * change together.
 */
export default clerkMiddleware();

export const config = {
  matcher: ['/waitlist']
};
