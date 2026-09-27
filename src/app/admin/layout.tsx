import { ClerkProvider, SignIn, SignOutButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { adminSession } from '@/lib/admin-gate';

/**
 * The catalogue console: hidden, signed in, and not a page of this website.
 *
 * What "hidden" means here, precisely, because the phrase covers four different
 * decisions and only three of them are implemented the obvious way:
 *
 *   1. **Nothing links to it.** Not the header, not the footer, not the sitemap.
 *      The only way here is to type the address.
 *   2. **`noindex, nofollow`**, below. A crawler that finds the address anyway
 *      is told not to keep it.
 *   3. **It is not in `robots.txt`, on purpose.** Adding `Disallow: /admin`
 *      there is the reflex, and it is backwards: `robots.txt` is a public file
 *      that anybody can read, so disallowing a path *publishes its address* to
 *      everyone curious enough to look — and it is advice a hostile crawler
 *      ignores anyway. `noindex` is the instruction that actually binds, and it
 *      binds without announcing anything.
 *   4. **Hidden is not the protection.** Signing in is, and the row-level
 *      security behind the API is. Anyone may load this address; what they get
 *      without the administrator claim is a sentence saying so.
 *
 * `ClerkProvider` is mounted here rather than at the root for the reason
 * `waitlist/layout.tsx` gives at length: the privacy policy says this site
 * loads no third-party script, and that has to stay true of every page a
 * visitor can actually reach. The middleware matcher is scoped the same way,
 * and the two have to be edited together.
 */

export const metadata: Metadata = {
  title: 'Catalogue',
  robots: { index: false, follow: false }
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="on-dark min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-[calc(var(--header-h)+2.5rem)] sm:px-8">
        {children}
      </div>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await adminSession();

  return (
    <ClerkProvider>
      {session.state === 'admin' ? (
        <Shell>{children}</Shell>
      ) : (
        <Shell>
          {session.state === 'signed-out' ? (
            <div className="flex flex-col items-center">
              <h1 className="section-title">Catalogue</h1>
              <p className="lede mt-3 text-center text-muted">Sign in to continue.</p>
              {/* Hash routing, so this needs no catch-all route of its own and
                  cannot become a second sign-in page competing with the app's. */}
              <div className="mt-8">
                <SignIn routing="hash" />
              </div>
            </div>
          ) : (
            <div className="max-w-xl">
              <h1 className="section-title">Not an administrator</h1>
              {/*
                * Said plainly, including what would change it. The API answers
                * the same way and for the same reason: the catalogue is not a
                * secret, so pretending this address does not exist would only
                * make a misconfigured claim look like a broken deploy.
                */}
              <p className="lede mt-4 text-pretty text-muted">
                This account is signed in, but its session token does not carry the catalogue
                administrator claim. It is granted in Clerk, as <code>role: admin</code> in the
                account&rsquo;s <strong>public</strong> metadata — never unsafe metadata, which an
                account can write for itself. A token minted before the change will not have it, so
                sign out and back in afterwards.
              </p>
              <div className="mt-8">
                <SignOutButton>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center rounded-full border border-line bg-elevated px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-ink"
                  >
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}
        </Shell>
      )}
    </ClerkProvider>
  );
}
