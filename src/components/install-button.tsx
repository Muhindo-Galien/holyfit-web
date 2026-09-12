import Link from 'next/link';

import { site } from '@/config/site';

/**
 * The one thing the page is asking for.
 *
 * Three states, in the order the product will pass through them.
 *
 * It used to have two, and the first of them asked for nothing: with no store
 * link the button became the words "Coming soon to the App Store" and sat
 * there. That is honest, and it wastes every visitor who arrived ready to act —
 * they are told to come back later by a page that has no way of telling them
 * when. The waitlist is the missing middle: the app is still not out, and now
 * there is something to do about it.
 *
 * It still refuses to be a link when there is nowhere to link to. If the
 * waitlist is switched off *and* there is no store URL, it falls back to the
 * old sign, because a button opening a dead page costs more trust than a button
 * admitting the app is not out yet.
 */
export default function InstallButton({ size = 'large' }: { size?: 'large' | 'small' }) {
  /*
   * Sized against the page, not against itself.
   *
   * The large one was `px-8 py-4 text-base` — 181x56 with 16px type, on a site
   * whose body copy is 15px. It read as a button borrowed from a louder
   * design. Both are now a step down, and both keep `min-h-11` so the tap area
   * stays at 44px whatever the padding is doing.
   */
  const classes =
    size === 'large'
      ? 'min-h-11 px-7 py-3.5 text-[0.9375rem]'
      : 'min-h-11 px-5 py-2.5 text-sm';
  const solid = `inline-flex items-center justify-center rounded-full bg-ink font-semibold text-background transition hover:opacity-85 ${classes}`;

  // Shipped: send people to the store.
  if (site.installUrl) {
    return (
      <Link href={site.installUrl} className={solid}>
        Get {site.name}
      </Link>
    );
  }

  // Not shipped, but taking names.
  if (site.waitlistEnabled) {
    return (
      <Link href="/waitlist" className={solid}>
        Join the waitlist
      </Link>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-line bg-elevated font-semibold text-muted ${classes}`}
    >
      Coming soon to the App Store
    </span>
  );
}
