'use client';

import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';

/**
 * The word at the top of the hero arch: the fruit the app actually offers.
 *
 * It opens on "Fruit of the Spirit", names the two a reader can take up, and
 * returns to the phrase. The phrase is what makes the loop legible — a single
 * word appearing over a handset is just a word.
 *
 * **Two, not nine, and that is a product fact rather than a space constraint.**
 * This cycled all nine of Galatians 5:22–23 and was wrong to: the app serves
 * its catalogue from the backend and offers kindness and self-control today.
 * `types/fruit.ts` says so in as many words — "Two are offered today, kindness
 * and self-control... Nothing in this app may say otherwise" — and a marketing
 * page listing all nine promises seven that do not exist. When the catalogue
 * grows, this list grows with it; adding a fruit is a backend deploy, so the
 * two can drift apart quietly and this is the place that shows it.
 *
 * They are also not the first two of the nine — kindness is fifth and
 * self-control is last — which is why the phrase leads rather than the list.
 */

/** The anchor, then what the catalogue serves. Index 0 is what the loop returns to. */
const FRUIT = ['Fruit of the Spirit', 'Self-control', 'Kindness'];

/* About a second a word, which is what was asked for: long enough to read a
   short one, short enough that "Self-control" does not outstay it. */
const TYPE_MS = 45;
const DELETE_MS = 25;
const HOLD_MS = 1000;

export default function FruitTicker({ angle }: { angle: number }) {
  /*
   * Under `reduce` the list still runs; only the typing stops.
   *
   * This used to print the phrase once and leave it, which meant a reader with
   * Reduce Motion switched on never saw a single fruit — nine of the ten
   * strings were unreachable, and the component silently became a label. That
   * was the wrong line to draw. The motion the setting objects to is the
   * character-by-character rattle and the blinking caret, not the fact that a
   * word changes; so `reduce` gets whole words swapped on a slow timer, and
   * everything else stays.
   *
   * `animate` starts false so the server and the first client render agree on
   * the static phrase. Anything else is a hydration mismatch.
   */
  const [animate, setAnimate] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAnimate(!query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (animate) return;
    // Slow enough to read and to not register as flicker. The typewriter path
    // spends roughly this long per word too, so the two feel like one design.
    const timer = setInterval(() => setIndex(i => (i + 1) % FRUIT.length), 2800);
    return () => clearInterval(timer);
  }, [animate]);

  return (
    <>
      <span
        className="hero-arch-label hero-arch-ticker"
        style={{ '--label-angle': `${angle}deg` } as React.CSSProperties}
        aria-hidden="true"
      >
        {/* The dot an active orbit node wears, at full strength. */}
        <span className="hero-arch-dot" />
        {animate ? (
          <Typewriter
            options={{
              loop: true,
              delay: TYPE_MS,
              deleteSpeed: DELETE_MS,
              skipAddStyles: true,
              wrapperClassName: 'hero-arch-ticker-text',
              cursorClassName: 'hero-arch-caret'
            }}
            /*
             * Built with the fluent API rather than passed as `strings`,
             * because the hold between words is the one timing that matters
             * here and there is no option for it — `pauseFor` is a method on
             * the instance, not a field on `options`. Queuing each word with
             * its own pause is the only way to ask for about a second.
             */
            onInit={typewriter => {
              FRUIT.forEach(word => {
                typewriter.typeString(word).pauseFor(HOLD_MS).deleteAll(DELETE_MS);
              });
              typewriter.start();
            }}
          />
        ) : (
          <span className="hero-arch-ticker-text">{FRUIT[index]}</span>
        )}
      </span>

      {/*
       * The list itself, and the only copy of it in the server HTML. A screen
       * reader gets the nine in one breath instead of a stream of half-typed
       * fragments, and it is what a crawler reads.
       */}
      <span className="sr-only">
        Take up a fruit of the Spirit: {FRUIT.slice(1).join(' or ').toLowerCase()}. From Galatians 5:22–23.
      </span>
    </>
  );
}
