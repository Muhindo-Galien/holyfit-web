import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import SiteFooter from '@/components/site-footer';
import StructuredData, { siteGraph } from '@/components/structured-data';
import SiteHeader from '@/components/site-header';
import { site } from '@/config/site';

import './globals.css';

/*
 * The app's face, self-hosted by `next/font` rather than linked from Google.
 *
 * That is a privacy decision as much as a performance one: a stylesheet fetched
 * from fonts.googleapis.com sends every visitor's IP to Google, which a page
 * whose whole claim is "we do not track you" cannot then make with a straight
 * face. `next/font` downloads the files at build time and serves them from our
 * own origin, so no third party sees the request at all.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`
  },
  description: site.description,
  applicationName: site.name,
  /*
   * Self-canonical, per route.
   *
   * `'./'` and not `'/'`: a literal `/` in a root layout points every page at
   * the homepage, which would tell Google the privacy policy and the terms are
   * the same document as the landing page. The relative form resolves against
   * `metadataBase` per route segment, so each page canonicalises to itself.
   *
   * Worth having because the site answers on two origins — the apex 308s to
   * `www` — and a canonical URL is what settles which one is the real address
   * if anything ever links to the wrong one.
   */
  alternates: { canonical: './' },
  /*
   * Ordered by intent, not by volume: the terms someone types when they are
   * trying to *build* something come first, and the content terms they type
   * when they already know what they want come after.
   *
   * Worth knowing what this tag is and is not. Google has ignored `keywords`
   * since 2009, so this is not what will rank the page — the title, the
   * description and the visible copy are. It still reaches Bing and a handful
   * of smaller indexes, and it costs nothing to state the positioning
   * correctly, which is the reason to keep it rather than delete it.
   */
  keywords: [
    'Christian lifestyle routine',
    'daily Christian routine',
    'Christian habit tracker',
    'spiritual discipline app',
    'Bible reading routine',
    'daily devotional routine',
    'prayer routine',
    'quiet time routine',
    'Bible reading plan',
    'prayer journal',
    'Christian reflection journal',
    'faith habit building'
  ],
  authors: [{ name: site.operator }],
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} · ${site.tagline}`,
    description: site.description
  },
  icons: { icon: '/icon.png', apple: '/icon.png' },
  /*
   * Apple's reviewers reach the privacy policy and support page from the App
   * Store listing, and both must be indexable and reachable without an account.
   * Nothing here is gated, so nothing here is disallowed.
   */
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    /* `Colors.dark.background`. Was #121019, which stopped matching the page
       the moment the dark ground became pure black — the browser chrome and the
       document would have sat a shade apart. */
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        <StructuredData data={siteGraph} />

        {/* Ahead of the header in the DOM, so the first Tab press on a long
            legal page offers the way past the navigation. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
