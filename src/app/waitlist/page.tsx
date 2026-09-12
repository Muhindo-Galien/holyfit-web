import type { Metadata } from 'next';
import Link from 'next/link';

import OrbField from '@/components/orb-field';
import WaitlistForm from '@/components/waitlist-form';
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

      {/* Clerk renders its own card; `WaitlistForm` wraps it so the page has
          somewhere to send people when it does not arrive. */}
      <div className="mt-10 w-full max-w-md">
        <WaitlistForm />
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
