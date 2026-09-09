/**
 * Everything about HolyFit that is a fact rather than a layout.
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
  name: 'HolyFit',

  /** One line, used in metadata and as the hero subtitle. */
  tagline: 'A daily rhythm of study, reflection and prayer.',

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
  operator: 'HolyFit',

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
  lastUpdated: '8 September 2026',

  /**
   * Where "Get HolyFit" leads.
   *
   * TestFlight while the app is in testing — it is the only place it can be
   * installed from — and an App Store URL the day there is one. Empty means the
   * public link has not been switched on in App Store Connect yet, and the
   * buttons say so instead of leading nowhere. Keep this in step with
   * `INVITE_URL` in the app's `src/lib/invite.ts`.
   */
  installUrl: '',

  /** Shown beside the install button so nobody is surprised by TestFlight. */
  installNote: 'HolyFit is in testing. The link opens TestFlight. Install that first, then HolyFit from inside it.'
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
    role: 'Accounts and sign-in',
    handles: 'Your email address, name, username and profile picture, and the session that keeps you signed in.',
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
    role: 'Hosting for the HolyFit API',
    handles: 'Requests between the app and the database, and short-lived server logs of those requests.',
    location: 'United States',
    policy: 'https://railway.app/legal/privacy'
  },
  {
    name: 'API.Bible',
    role: 'Scripture text',
    handles:
      'The passage reference being read, for example "1 John 2:1". Never your identity: the request is made by our server with our key, not by your device.',
    location: 'United States',
    policy: 'https://scripture.api.bible/privacy'
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
