'use client';

import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';

/**
 * The word at the top of the hero arch.
 *
 * It opens on "Fruit of the Spirit", types its way through the nine of them —
 * Galatians 5:22–23, in the order the passage gives them — and returns to the
 * phrase before starting again. The phrase is what makes the loop legible:
 * without it a single word appearing over a handset is just a word.
 *
 * It sits at the apex because that is the one place on the arc with nothing
 * either side of it. The four sittings occupy the flanks, and the springing
 * points are level with the phone.
 *
 * Typing is done by `typewriter-effect`, which replaced a hand-rolled hook
 * here. Two things about it are worth knowing, because neither is obvious from
 * the README:
 *
 *  - It renders nothing on the server. The component mounts empty and fills in
 *    on the client, so nothing it types is in the HTML. The `sr-only` list
 *    below is therefore not only an accessibility affordance — it is the only
 *    copy of this content a crawler or a reader without JavaScript will ever
 *    see, which is why it carries the whole list rather than a summary.
 *  - It injects its own stylesheet for the cursor unless told not to. Ours is
 *    styled with the rest of the arch, so `skipAddStyles` is on and the cursor
 *    class is ours.
 */

/** The anchor, then the list. Index 0 is what the loop returns to. */
const FRUIT = [
  'Fruit of the Spirit',
  'Love',
  'Joy',
  'Peace',
  'Patience',
  'Kindness',
  'Goodness',
  'Faithfulness',
  'Gentleness',
  'Self-control'
];

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
              delay: 45,
              deleteSpeed: 25,
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
                typewriter.typeString(word).pauseFor(1000).deleteAll(25);
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
      <span className="sr-only">The fruit of the Spirit: {FRUIT.slice(1).join(', ')}. Galatians 5:22–23.</span>
    </>
  );
}
