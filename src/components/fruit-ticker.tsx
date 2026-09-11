'use client';

import { useEffect, useState } from 'react';

/**
 * Two words on the hero arch, typing their way through the fruit of the Spirit.
 *
 * Galatians 5:22–23, in the order the passage gives them. Nine will not fit on
 * an arc a phone can hold — laid out at once they run off a 390px screen — so
 * two positions cycle through all nine instead, which shows the whole list in
 * the space that holds two words.
 *
 * **Written here rather than pulled from a package.** A typing effect is a
 * string slice on a timer; the smallest library that does it is a dependency,
 * a bundle entry and a hydration surface for about forty lines of logic. This
 * site ships no runtime dependencies beyond React and Next, and one decorative
 * flourish is a poor reason to start.
 *
 * The slot is a fixed width with the word centred in it, so a nine-letter fruit
 * and a three-letter one do not shift the line around them as they swap.
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
] as const;

/* About a second a word, which is what was asked for: long enough to read a
   short one, short enough that "Faithfulness" does not outstay it. */
const TYPE_MS = 45;
const DELETE_MS = 25;
const HOLD_MS = 1000;
const BETWEEN_MS = 160;

function useTypewriter(startIndex: number, startDelay: number, enabled: boolean) {
  // Explicitly `string`: `FRUIT` is `as const`, so inference would narrow this
  // to the nine literals and reject every partially typed slice of them.
  const [word, setWord] = useState<string>(FRUIT[startIndex % FRUIT.length]);

  useEffect(() => {
    if (!enabled) return;

    let index = startIndex;
    let chars = FRUIT[index % FRUIT.length].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const full = FRUIT[index % FRUIT.length];

      if (deleting) {
        chars -= 1;
        if (chars <= 0) {
          deleting = false;
          index += 1;
          setWord('');
          timer = setTimeout(tick, BETWEEN_MS);
          return;
        }
        setWord(full.slice(0, chars));
        timer = setTimeout(tick, DELETE_MS);
        return;
      }

      chars += 1;
      const next = FRUIT[index % FRUIT.length];
      setWord(next.slice(0, chars));
      if (chars >= next.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_MS);
        return;
      }
      timer = setTimeout(tick, TYPE_MS);
    };

    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [startIndex, startDelay, enabled]);

  return word;
}

export default function FruitTicker({ angle }: { angle: number }) {
  /*
   * Typing is character-by-character motion in the reader's peripheral vision,
   * which is squarely what the setting is for. Under `reduce` the two words are
   * simply printed and left alone.
   */
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAnimate(!query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const word = useTypewriter(0, 500, animate);

  return (
    <>
      <span
        className="hero-arch-label hero-arch-ticker"
        style={{ '--label-angle': `${angle}deg` } as React.CSSProperties}
        aria-hidden="true"
      >
        {word}
        <span className="hero-fruit-caret" />
      </span>

      {/*
       * The list itself, for anything that cannot watch it arrive. A screen
       * reader gets the nine in one breath instead of a stream of half-typed
       * fragments, and it is what sits in the HTML for a crawler.
       */}
      <span className="sr-only">The fruit of the Spirit: {FRUIT.slice(1).join(', ')}. Galatians 5:22–23.</span>
    </>
  );
}
