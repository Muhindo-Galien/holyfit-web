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
 * **The two are locked out of phase.** Both advance one word per cycle at the
 * same rate, starting a fixed distance apart in the list, so the gap between
 * them never changes and they can never land on the same word. Only the start
 * delay differs, which staggers them visually without letting them drift into
 * each other.
 */

const FRUIT = [
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

/** Coprime with nine, so the pair walks the whole list without ever meeting. */
const OFFSET = 4;

const TYPE_MS = 70;
const DELETE_MS = 40;
const HOLD_MS = 1600;
const BETWEEN_MS = 250;

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

export default function ArchFruit({ angles }: { angles: [number, number] }) {
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

  const left = useTypewriter(0, 0, animate);
  const right = useTypewriter(OFFSET, 900, animate);

  return (
    <>
      {[left, right].map((word, i) => (
        <span
          key={i}
          className="hero-arch-label"
          style={{ '--label-angle': `${angles[i]}deg` } as React.CSSProperties}
          aria-hidden="true"
        >
          {word}
          <span className="hero-arch-caret" />
        </span>
      ))}

      {/*
       * The list itself, for anything that cannot watch it arrive. A screen
       * reader gets the nine in one breath instead of a stream of half-typed
       * fragments, and it is what sits in the HTML for a crawler.
       */}
      <span className="sr-only">
        The fruit of the Spirit: {FRUIT.join(', ')}. Galatians 5:22–23.
      </span>
    </>
  );
}
