'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Fades a section up as it first comes into view.
 *
 * The whole of the motion, and deliberately so little of it: the page is asking
 * someone to read, and anything that slides, counts up or parallaxes is
 * competing with the sentence it is decorating. One 18px lift, once, on first
 * sight.
 *
 * **It fails visible.** The resting CSS state is opaque, and the hidden state is
 * scoped to `.js` — a class this component puts on `<html>` at mount. Without
 * JavaScript, or before hydration, the content is simply there. The alternative
 * default, hiding first and revealing later, turns any failure of this component
 * into a blank page, which is a bad trade for a fade.
 *
 * `once`: the observer disconnects after the first intersection. Re-animating on
 * the way back up is a page that will not settle.
 */
export default function Reveal({
  children,
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('js');

    const node = ref.current;
    if (!node) return;

    // Anything already on screen at mount is shown immediately rather than
    // waiting for a scroll that may never come — the hero, most of all.
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          observer.disconnect();
        }
      },
      // A little before the edge, so the movement finishes as the section
      // arrives rather than starting once it is already being read.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
