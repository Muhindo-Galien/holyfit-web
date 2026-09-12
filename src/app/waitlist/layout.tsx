import { ClerkProvider } from '@clerk/nextjs';

import type { ReactNode } from 'react';

/**
 * Clerk, scoped to this route and no further.
 *
 * `ClerkProvider` belongs in the root layout in almost every Next.js app, and
 * deliberately does not go there in this one. Mounting it at the root would
 * load Clerk's script and set its cookies on every page — including the privacy
 * policy that says, in as many words, that this site carries no third-party
 * script and no cookies beyond what serving the page requires.
 *
 * Those two sentences are the product's whole argument. Keeping them true is
 * worth a nested provider, so the marketing pages stay exactly as they were and
 * only the page that actually needs an identity service loads one. The
 * middleware matcher is scoped the same way, for the same reason.
 */
export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
