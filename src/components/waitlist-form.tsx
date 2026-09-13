'use client';

import { Waitlist } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

import { site } from '@/config/site';

/**
 * Clerk's waitlist form, with somewhere to go when it does not arrive.
 *
 * The form is third-party JavaScript talking to a third-party API, which gives
 * it more ways to fail than the rest of this site put together: a blocked
 * script, an ad blocker taking exception to an unfamiliar host, a Clerk outage,
 * or the one that actually happened here — production keys refusing every
 * origin except the registered domain, which is every localhost and every
 * preview URL. In all of those Clerk renders nothing and logs to a console the
 * visitor will never open.
 *
 * A page that asks for an address and then shows a blank rectangle is worse
 * than one that never asked. So: if no input has appeared after a few seconds,
 * the component says so and offers the address that has always worked.
 *
 * Watching the DOM rather than listening for an error, because Clerk does not
 * expose one — it fails inside its own widget and the surrounding React never
 * hears about it.
 *
 * **It watches for Clerk rendering anything, not for an input.** Looking for a
 * field was the obvious check and was wrong in the one case that matters most:
 * a successful join replaces the form with a confirmation, which has no input.
 * Anyone who submitted inside the grace period — or who had joined before and
 * came back, since Clerk renders them straight into that confirmation — was
 * told the form had failed to load while looking at proof that it had not.
 *
 * Every element Clerk renders carries a `cl-` class; that is the same contract
 * the `appearance.elements` map is built on, so it is as stable as the styling
 * already relies on.
 */

/** Long enough for a slow phone on a bad connection, short enough to matter. */
const GRACE_MS = 6000;

export default function WaitlistForm() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    /* Anything Clerk has put on the page, in any of its states. */
    const clerkIsHere = () => Boolean(node.querySelector('[class*="cl-"]'));

    /*
     * Latched, so the verdict can only ever go one way.
     *
     * Once Clerk has rendered, it has loaded, and nothing it does afterwards —
     * swapping the form for a confirmation, most of all — should be readable as
     * a failure to arrive.
     */
    let arrived = false;

    const timer = setTimeout(() => {
      if (!arrived && !clerkIsHere()) setFailed(true);
    }, GRACE_MS);

    // References `observer` below, which is initialised before anything can
    // call this — the observer's own callback, or the check after it.
    const settle = () => {
      arrived = true;
      setFailed(false);
      observer.disconnect();
      clearTimeout(timer);
    };

    /*
     * The timeout alone was not enough either: it gave its verdict once, so a
     * form arriving at seven seconds would have stayed hidden behind a notice
     * saying it never came.
     */
    const observer = new MutationObserver(() => {
      if (clerkIsHere()) settle();
    });
    observer.observe(node, { childList: true, subtree: true });

    // Covers the case where Clerk was already on the page before this ran.
    if (clerkIsHere()) settle();

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={host} className="w-full">
      {/* Hidden rather than unmounted once we have given up on it: unmounting
          would tear out the node the observer is watching, and with it any
          chance of the form arriving late and putting the notice away. */}
      <div className={failed ? 'hidden' : undefined}>
        <Waitlist
          /*
           * Clerk mounts on the client, so without this the card's space is empty
           * until its script arrives — and empty space under a paragraph saying
           * "leave an address" reads as a form that failed rather than one still
           * loading.
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

      {failed ? (
        <p className="mt-4 rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted">
          The form did not load — it may be blocked, or briefly down. Email{' '}
          <a href={`mailto:${site.supportEmail}?subject=Waitlist`} className="text-accent underline underline-offset-4">
            {site.supportEmail}
          </a>{' '}
          and you will be added by hand, which reaches the same list.
        </p>
      ) : null}
    </div>
  );
}
