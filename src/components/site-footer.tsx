import Link from 'next/link';

import { site } from '@/config/site';

/**
 * Where the App Store listing's Privacy Policy and Support URLs are expected to
 * be reachable from, so they sit in the footer of every page rather than only
 * on the one that happens to mention them.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-bold tracking-tight">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{site.tagline}</p>
          </div>

          <nav className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-8">
            <Link href="/privacy" className="text-muted transition hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted transition hover:text-ink">
              Terms of Service
            </Link>
            <Link href="/support" className="text-muted transition hover:text-ink">
              Support
            </Link>
            <a href={`mailto:${site.supportEmail}`} className="text-muted transition hover:text-ink">
              {site.supportEmail}
            </a>
          </nav>
        </div>

        <p className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} {site.operator}. Not affiliated with any denomination, church or
          publisher. Scripture text is provided under licence and remains the property of its publishers.
        </p>
      </div>
    </footer>
  );
}
