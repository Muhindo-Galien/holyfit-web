/**
 * Everything about holyfit that is a fact rather than a layout.
 *
 * One file because these strings appear in a dozen places across the marketing
 * page, both legal documents and the metadata Apple and Google read — and a
 * contact address that is right in the footer and stale in the privacy policy
 * is worse than one that is wrong in both, because nobody goes looking for the
 * second copy.
 */

/**
 * A value that has not been decided yet.
 *
 * Marked rather than guessed. Anything still carrying this renders a visible
 * notice on the page it appears on (see `PendingNotice`), because a governing-law
 * clause reading "the laws of [JURISDICTION]" is the kind of thing that ships
 * quietly and is discovered by a reviewer.
 */
export const PENDING_PREFIX = '[';

export function isPending(value: string): boolean {
  return value.startsWith(PENDING_PREFIX);
}

export const site = {
  /*
   * Lower case, always.
   *
   * The app writes it that way everywhere — 25 times to one, `app.json` says
   * `"name": "holyfit"`, and its own copy reads "holyfit is in testing". The
   * logo tile sets the wordmark in lower case too, which is why the site's
   * header had it both ways at once: a tile reading `holyfit` beside a span
   * reading `HolyFit`, half an inch apart.
   *
   * It starts sentences in lower case as a result. That is the brand's own
   * convention, not a typo, and the app does the same.
   */
  name: 'holyfit',

  /** One line, used in metadata and as the hero subtitle. */
  tagline: 'A daily rhythm of Bible study, reflection and prayer.',

  /*
   * Metadata only — the search-result snippet, the OG card and the Twitter
   * card. Not rendered anywhere on the page, so it is written for a stranger
   * reading one line in a list of ten results, not for someone already here.
   *
   * It leads with the category on purpose. The old line described the app
   * accurately and never once said what it was *for*: "a quiet companion for a
   * daily practice" could be a meditation timer, a habit tracker or a diary.
   * Someone searching for a way to build a Christian routine had nothing to
   * match on. Kept under 160 characters so Google does not truncate it.
   */
  description:
    'Build a daily Christian routine: Bible reading, prayer and reflection, at hours you choose. No feed, no streak-shaming, no ads, no tracking.',

  /*
   * The canonical origin, and it must be whichever host the domain actually
   * serves rather than redirects.
   *
   * That has now been both. It was the apex, which 308'd to `www`, so this was
   * changed to `www`; the Vercel primary-domain setting was then flipped and
   * `www` began 307'ing back to the apex, which made every canonical tag on
   * the site point at a redirect. This is the apex again because that is what
   * answers 200 today.
   *
   * Before changing it, check, do not assume:
   *
   *   curl -sI https://useholyfit.com/ | head -1
   *   curl -sI https://www.useholyfit.com/ | head -1
   *
   * The one that answers 200 goes here. Everything derived from this constant
   * — `metadataBase`, the canonical link on every page, all four sitemap
   * entries, the sitemap line in robots.txt, og:url and the absolute OG image
   * URL — is wrong the moment it names the redirecting host.
   */
  url: 'https://useholyfit.com',

  /**
   * The name the service is published under.
   *
   * This was the operator's own legal name, which is the conventional thing to
   * put in a copyright line and a terms signature. It is deliberately not that
   * any more: the site should not publish the name of the individual behind it.
   *
   * Read the caveat before changing anything downstream of this. A privacy
   * policy is normally expected to identify the controller by name — GDPR
   * Art. 13(1)(a) — and an App Store listing carries a seller name of its own
   * regardless of what this file says. The brand name satisfies the sentences
   * on these pages; whether it satisfies a regulator is a question for a
   * lawyer, not for this constant. `supportEmail` and `privacyEmail` remain the
   * working contact route either way, which is the part a reader actually uses.
   */
  operator: 'holyfit',

  /**
   * Addresses on the public pages.
   *
   * Deliberately not a personal inbox: these end up on a page that scrapers
   * read, and a support address can be forwarded, filtered and handed over
   * later without republishing a legal document. Both must exist before the
   * App Store listing points at them.
   */
  supportEmail: 'support@useholyfit.com',
  privacyEmail: 'privacy@useholyfit.com',

  /**
   * Where the governing-law clause points.
   *
   * Set from the operator's own location, which is what makes a clause like
   * this enforceable in practice — naming a jurisdiction you have no connection
   * to gives you a forum you could not actually use. Consumers keep their local
   * protections regardless; see the clause itself.
   *
   * **Confirm this before submission.** It was inferred from the development
   * machine's timezone (America/Phoenix), which is evidence but not a fact
   * about where you live or would register.
   */
  governingLaw: 'the State of Arizona, United States',

  /**
   * The dates on the legal documents. Both change when the documents do; the
   * effective date is what a reviewer and a regulator look at first.
   */
  effectiveDate: '8 September 2026',
  /*
   * One date per document, because they change independently.
   *
   * This was a single `lastUpdated` shared by both, which is fine right up
   * until one of them changes: the waitlist disclosure went into the privacy
   * policy on 12 September and the shared value still read the 8th, so the
   * document had been materially changed and said it had not. Bumping the
   * shared value would have fixed that by making the terms claim a revision
   * they never had.
   *
   * Update the one you edited. A legal document's own date is the only thing on
   * the page a reader can use to tell whether they have seen this version
   * before.
   */
  updated: {
    privacy: '12 September 2026',
    terms: '8 September 2026'
  },

  /**
   * Where "Get holyfit" leads.
   *
   * TestFlight while the app is in testing — it is the only place it can be
   * installed from — and an App Store URL the day there is one. Empty means the
   * public link has not been switched on in App Store Connect yet, and the
   * buttons say so instead of leading nowhere. Keep this in step with
   * `INVITE_URL` in the app's `src/lib/invite.ts`.
   */
  installUrl: '',

  /**
   * Whether the waitlist is open.
   *
   * A switch rather than a deploy: Clerk's access mode can be flipped in their
   * dashboard, and this is what keeps the site's button in step with it. Turn
   * it off and the page falls back to saying the app is not out yet, which is
   * better than a form that collects addresses nobody is reading.
   *
   * It has no effect once `installUrl` is set — at that point there is a store
   * to send people to and a waitlist is a detour.
   */
  waitlistEnabled: true,

  /** Shown beside the install button so nobody is surprised by TestFlight. */
  installNote: 'holyfit is in testing. The link opens TestFlight. Install that first, then holyfit from inside it.'
} as const;

/** The minimum age stated in both documents and matched by the App Store rating. */
export const MINIMUM_AGE = 13;

/**
 * Everyone who processes reader data on our behalf, and exactly what they see.
 *
 * Written out rather than summarised as "trusted partners", which tells a reader
 * nothing and a regulator less. This is the list the privacy policy renders.
 */
export const subprocessors = [
  {
    name: 'Clerk',
    role: 'Accounts, sign-in, and the waitlist',
    handles:
      'Your email address, name, username and profile picture, and the session that keeps you signed in. If you joined the waitlist before the app opened, the address you gave — and nothing else — until the invitation is sent or you ask for it to be removed.',
    location: 'United States',
    policy: 'https://clerk.com/legal/privacy'
  },
  {
    name: 'Supabase',
    role: 'Database',
    handles:
      'Everything you create in the app: plans, passages, notes, prayers, journal entries, your routine and which sittings you kept.',
    location: 'Region selected at project creation',
    policy: 'https://supabase.com/privacy'
  },
  {
    name: 'Railway',
    role: 'Hosting for the holyfit API',
    handles: 'Requests between the app and the database, and short-lived server logs of those requests.',
    location: 'United States',
    policy: 'https://railway.app/legal/privacy'
  },
  {
    name: 'Apple',
    role: 'App distribution',
    handles:
      'Your download and, during testing, your TestFlight participation. Governed by Apple’s own privacy policy, not ours.',
    location: 'United States',
    policy: 'https://www.apple.com/legal/privacy/'
  }
] as const;
