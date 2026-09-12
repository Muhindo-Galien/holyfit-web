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
 * expose one — it fails inside its own iframe-less widget and the surrounding
 * React never hears about it. What a visitor cares about is whether there is a
 * field to type in, so that is what gets checked.
 */

/** Long enough for a slow phone on a bad connection, short enough to matter. */
const GRACE_MS = 6000;

export default function WaitlistForm() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const hasField = () => Boolean(node.querySelector('input'));

    /*
     * The timeout alone was not enough. It gave a verdict once, at six
     * seconds, and a form arriving at seven would then stay hidden behind a
     * notice saying it had not loaded — the failure state has to be able to
     * take itself back. The observer watches for a field appearing at any
     * point and clears the notice when one does.
     */
    const observer = new MutationObserver(() => {
      if (hasField()) {
        setFailed(false);
        observer.disconnect();
      }
    });
    observer.observe(node, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      if (!hasField()) setFailed(true);
    }, GRACE_MS);

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
