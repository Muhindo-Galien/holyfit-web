import Link from 'next/link';

import { site } from '@/config/site';

/**
 * The one thing the page is asking for.
 *
 * It refuses to be a link when there is nowhere to link to. The public
 * TestFlight address does not exist until it is switched on in App Store
 * Connect, and a button that opens a dead page costs more trust than a button
 * that admits the app is not out yet — the visitor finds out either way, and
 * only one version of it is honest.
 */
export default function InstallButton({ size = 'large' }: { size?: 'large' | 'small' }) {
  const classes =
    size === 'large'
      ? 'px-8 py-4 text-base'
      : 'px-6 py-3 text-sm';

  if (!site.installUrl) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full border border-line bg-elevated font-semibold text-muted ${classes}`}
      >
        Coming soon to the App Store
      </span>
    );
  }

  return (
    <Link
      href={site.installUrl}
      className={`inline-flex items-center justify-center rounded-full bg-ink font-semibold text-background transition hover:opacity-85 ${classes}`}
    >
      Get {site.name}
    </Link>
  );
}
