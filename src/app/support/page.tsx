import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Support',
  description: `How to get help with ${site.name}, report a problem, export your data or delete your account.`
};

/**
 * The App Store listing needs a Support URL as well as a Privacy Policy URL, and
 * a reviewer will open it. It is a real page rather than a mailto: link because
 * the two things people most often arrive wanting — get my data out, delete my
 * account — should be answerable without waiting for a reply.
 */
const topics = [
  {
    title: 'Something is broken',
    body: (
      <>
        <p>
          Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> and say what you were doing when it went
          wrong. If you can, include your device and iOS version. It narrows things down quickly.
        </p>
        <p>Please don’t send screenshots of your journal or prayers. We don’t need them, and we would rather not see them.</p>
      </>
    )
  },
  {
    title: 'I want a copy of my data',
    body: (
      <>
        <p>
          Email <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> from the address on your account and ask
          for an export. You will get everything you have written in a portable format, free of charge.
        </p>
      </>
    )
  },
  {
    title: 'I want my account deleted',
    body: (
      <>
        <p>
          Open the app and go to <strong>Profile → Delete account</strong>. It asks twice, and then removes the account
          and every plan, note, prayer and journal entry attached to it.
        </p>
        <p>
          If you can no longer get into the app, email{' '}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> from the address on your account and we will
          do it for you within 30 days.
        </p>
        <p>
          <strong>It cannot be undone.</strong> Ask for an export first if you want to keep your journal. We will send
          it before deleting anything.
        </p>
      </>
    )
  },
  {
    title: 'I’m not getting my reminders',
    body: (
      <>
        <p>
          Check that notifications are allowed for {site.name} in the iOS Settings app, and that Focus or Do Not Disturb
          is not covering the hours you chose. Reminders are scheduled by your phone, so they also need the app to have
          been opened at least once since you set or changed your routine.
        </p>
      </>
    )
  },
  {
    title: 'A passage won’t load',
    body: (
      <>
        <p>
          Passage text is fetched when you open it, so it needs a connection. If you have one and it still fails, the
          scripture provider may be having trouble. Try again shortly, and tell us if it persists.
        </p>
      </>
    )
  }
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="page-title">Support</h1>

      <p className="lede mt-6 text-muted">
        {site.name} is made by one person, so replies come from a human and sometimes take a day or two. Write to{' '}
        <a href={`mailto:${site.supportEmail}`} className="text-accent underline underline-offset-4">
          {site.supportEmail}
        </a>{' '}
        about anything at all.
      </p>

      <div className="mt-14 space-y-10">
        {topics.map(topic => (
          <section key={topic.title}>
            <h2 className="subsection-title">{topic.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-ink">
              {topic.body}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-line bg-surface p-8">
        <h2 className="subsection-title">The documents</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Our <Link href="/privacy" className="text-accent underline underline-offset-4">Privacy Policy</Link> lists
          every company that touches your data and exactly what each one sees. Our{' '}
          <Link href="/terms" className="text-accent underline underline-offset-4">Terms of Service</Link> set out the
          agreement between us.
        </p>
      </div>
    </div>
  );
}
