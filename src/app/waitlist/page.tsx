import { Waitlist } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Link from 'next/link';

import OrbField from '@/components/orb-field';
import { site } from '@/config/site';

/**
 * Join the waitlist.
 *
 * The app is not on the App Store yet, and until it is the page had nothing to
 * ask for — the button said "Coming soon" and did nothing, which is honest and
 * wastes every visitor who arrived ready to act.
 *
 * The form is Clerk's `<Waitlist />` rather than a hand-rolled input because
 * the app already uses Clerk for accounts: an address collected here becomes an
 * invitation from the same system that will issue the account, instead of a row
 * in a spreadsheet somebody has to reconcile later.
 *
 * `noindex` on purpose. It is a form, not a page anyone should arrive at from a
 * search result, and it would compete with the home page for the brand query.
 */
export const metadata: Metadata = {
  title: 'Join the waitlist',
  description: `Be told when ${site.name} opens. One email when it does, and nothing else.`,
  robots: { index: false, follow: true }
};

export default function WaitlistPage() {
  return (
    <section className="orb-field relative -mt-[4.25rem] flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-[7rem] sm:px-8">
      <OrbField />

      <div className="w-full max-w-md text-center">
        <h1 className="section-title text-balance">Be told when it opens</h1>
        <p className="lede mt-4 text-pretty text-muted">
          {site.name} is in testing on iOS. Leave an address and you will get one email when it opens, sent by the same
          system that will issue your account.
        </p>
      </div>

      {/* Clerk renders its own card. The appearance object below is what keeps
          it from arriving as a component from a different website. */}
      <div className="mt-10 w-full max-w-md">
        <Waitlist
          /*
           * Clerk mounts on the client, so without this the card's space is
           * empty until its script arrives — and empty space above a paragraph
           * that says "leave an address" reads as a form that failed rather
           * than one still loading.
           */
          fallback={
            <div className="flex h-44 w-full items-center justify-center rounded-2xl border border-line bg-surface text-sm text-muted">
              Loading the form…
            </div>
          }
          appearance={{
            // Names are Clerk v7's. `colorText` / `colorTextSecondary` /
            // `colorInputBackground` are the older spellings and no longer
            // type-check — the compiler is the only place that says so.
            variables: {
              colorPrimary: '#5b72ef',
              colorBackground: 'var(--surface)',
              colorForeground: 'var(--text)',
              colorMutedForeground: 'var(--text-secondary)',
              colorInput: 'var(--background)',
              colorInputForeground: 'var(--text)',
              colorNeutral: 'var(--text)',
              borderRadius: '0.9rem',
              fontFamily: 'var(--font-jakarta), ui-sans-serif, system-ui, sans-serif'
            },
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full shadow-none',
              card: 'shadow-none border border-line',
              // Clerk's own branding line, which this page does not need.
              footer: 'hidden'
            }
          }}
        />
      </div>

      <p className="mt-8 max-w-md text-center text-sm text-muted">
        Your address is stored by Clerk and used for that one email. Nothing else. See the{' '}
        <Link href="/privacy" className="text-accent underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    </section>
  );
}
