'use client';

import { useSyncExternalStore } from 'react';

/**
 * Flips the site between light and dark.
 *
 * Built to behave like the app's own `ThemeToggle`, down to the details that
 * are easy to get backwards:
 *
 *  - **The glyph shows the destination, not the current state** — a moon while
 *    the page is light. An icon button with no label is read as "what happens
 *    if I press this", and a sun on a light screen answers a question nobody
 *    asked.
 *  - **Pressing it ends "follow the system".** Until then there is no stored
 *    preference at all and the OS decides; afterwards the choice outranks it,
 *    which is what `data-theme` on `<html>` means.
 *
 * The choice lives in `localStorage` under the same key the app uses, and is
 * applied by a small script in `<head>` before the first paint — see
 * `layout.tsx`. Without that the page would render in the system scheme and
 * then snap to the stored one, which is the flash this exists to avoid.
 *
 * It only changes the hero, the header and the legal pages. Everything below
 * the hero is `.on-dark` and stays dark by design, so the control is honest
 * about what it does rather than promising to repaint the whole page.
 */

export const THEME_KEY = 'holyfit.theme';

type Theme = 'light' | 'dark';

/*
 * A tiny store over two external sources: the attribute on `<html>` and the
 * operating system's preference.
 *
 * `useSyncExternalStore` rather than an effect that calls `setState`, which is
 * the obvious shape and the wrong one — reading the DOM on mount and setting
 * state from it costs an extra render every time and is what React's
 * `set-state-in-effect` rule is pointing at. The two snapshot functions are
 * also exactly the server/client distinction this component needs.
 */
const listeners = new Set<() => void>();

const announce = () => listeners.forEach(notify => notify());

function subscribe(notify: () => void) {
  listeners.add(notify);
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  // Only matters while nothing has been chosen here; `getSnapshot` prefers the
  // attribute, so an explicit choice simply outlives the OS changing under it.
  query.addEventListener('change', announce);
  return () => {
    listeners.delete(notify);
    query.removeEventListener('change', announce);
  };
}

function getSnapshot(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * The server has no reader and no scheme to read. `null` renders no glyph at
 * all, which beats guessing and correcting it in front of them.
 */
function getServerSnapshot(): Theme | null {
  return null;
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  const flip = () => {
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing, or storage disabled. The theme still changes for this
      // page; it simply will not be remembered, which is the lesser failure.
    }
    // The attribute is the source of truth; tell the store to read it again.
    announce();
  };

  return (
    <button
      type="button"
      onClick={flip}
      // Hidden from assistive tech until it knows which way it points, so a
      // screen reader is never told "switch to dark" by a page already dark.
      aria-hidden={theme === null}
      aria-label={theme === null ? undefined : `Switch to ${next} theme`}
      title={theme === null ? undefined : `Switch to ${next} theme`}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted transition hover:text-ink"
    >
      {theme === null ? null : theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* Feather's `sun` and `moon`, the same two the app draws. */

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
