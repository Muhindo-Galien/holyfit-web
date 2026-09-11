'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { Device } from '@/components/device';

/**
 * The four features, as one orbit rather than four sections.
 *
 * They used to be four full-height blocks, each with its own handset, scrolled
 * past in order. That reads as a list of specifications: by the third phone the
 * visitor is scrolling rather than looking. Here there is one phone, held, and
 * the app changes inside it as the ring turns — which is closer to what using
 * it is actually like, and takes a quarter of the page height to say.
 *
 * **The scroll is not hijacked.** The section is tall and its contents are
 * `sticky`; the page scrolls at exactly its normal rate and the composition
 * happens to stay put while it does. Nothing is animated *to* a scroll
 * position, so there is no fighting the wheel and no scroll-stealing.
 *
 * **Everything is in the DOM at all times.** All four titles, bodies and
 * screenshots render on the server and stay rendered — inactive panels are
 * faded, not unmounted. That matters twice over: a crawler sees four features
 * rather than one, and someone without JavaScript gets a legible page instead
 * of a single feature and three ghosts.
 *
 * **The ring is also a tablist.** Scroll drives the active index, but each node
 * is a real button: reachable by keyboard, announced by a screen reader, and
 * clickable by anyone who would rather not scroll four screens to see the
 * fourth feature. Scroll is the flourish; the buttons are the interface.
 */

export type OrbitFeature = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  /** Which brand orb this feature answers to, from the app's `ORBS`. */
  color: string;
};

/** Degrees from twelve o'clock, clockwise, for a node at `index`. */
const angleFor = (index: number, total: number) => (index * 360) / total;

/** The store never changes; only which snapshot answers does. */
const subscribeToNothing = () => () => {};

export default function FeatureOrbit({ features }: { features: OrbitFeature[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  /**
   * True once the client has taken over. Until then the markup renders in its
   * server shape — a plain stack — so the first paint is never a broken orbit,
   * and a visitor whose JavaScript never arrives keeps that stack.
   *
   * `useSyncExternalStore` rather than a `useEffect` that sets state: the two
   * snapshot functions are exactly the server/client distinction being asked
   * about, and it avoids the extra render an effect-then-setState would cost
   * on every mount.
   */
  const live = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  /*
   * Read scroll on a frame, never on the event.
   *
   * The listener fires far more often than the screen refreshes, and
   * `getBoundingClientRect` forces layout, so doing it per event is how a
   * sticky section starts to feel heavy. One read per frame at most.
   */
  useEffect(() => {
    if (!live) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;

      const { top, height } = el.getBoundingClientRect();
      const travel = height - window.innerHeight;
      if (travel <= 0) return;

      const progress = Math.min(1, Math.max(0, -top / travel));
      // The last feature gets the tail of the track rather than a sliver of it.
      const next = Math.min(features.length - 1, Math.floor(progress * features.length));
      setActive(current => (current === next ? current : next));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [live, features.length]);

  /** Clicking a node scrolls to the stretch of track that owns it. */
  const goTo = useCallback(
    (index: number) => {
      const el = sectionRef.current;
      if (!el) {
        setActive(index);
        return;
      }
      const travel = el.offsetHeight - window.innerHeight;
      // Aim at the middle of the segment, so the node stays active on arrival.
      const target = el.offsetTop + travel * ((index + 0.5) / features.length);
      window.scrollTo({ top: target, behavior: 'smooth' });
      setActive(index);
    },
    [features.length]
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-labelledby="features-heading"
      className="relative"
      /*
       * The track grows with the list rather than being a fixed 340vh.
       *
       * A constant height meant every feature added shortened the stretch of
       * scroll its own segment got: at seven, each was down to a third of a
       * screen and they flicked past. 55vh apiece is brisk without being a
       * flicker, and the 40 on top is the run-in before the first one and the
       * run-out after the last.
       *
       * Only once live — before that the stack needs no track to scrub, and a
       * section of nothing this tall would be a very long blank.
       */
      style={live ? { height: `${features.length * 55 + 40}vh` } : undefined}
    >
      <h2 id="features-heading" className="sr-only">
        What HolyFit does
      </h2>

      <div className={live ? 'sticky top-0 flex min-h-screen items-center py-16' : 'py-16'}>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          {/* ------------------------------------------------------ The stage */}
          <div className="order-1 lg:order-2">
            <div className="orbit-stage">
              {/*
                * The wash behind the phone, rotated to sit behind the active
                * node. It is the one thing that actually turns, which is what
                * makes the progression read as circular rather than as a
                * carousel that happens to be round.
                */}
              <div
                className="orbit-glow"
                style={{
                  '--glow-color': features[active].color,
                  '--glow-angle': `${angleFor(active, features.length)}deg`
                } as React.CSSProperties}
                aria-hidden="true"
              />

              {/* The track the nodes sit on. */}
              <div className="orbit-ring" aria-hidden="true" />

              {/* --------------------------------------------------- The nodes */}
              <div className="orbit-nodes" role="tablist" aria-label="Features">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    type="button"
                    role="tab"
                    id={`orbit-tab-${feature.id}`}
                    aria-selected={index === active}
                    aria-controls={`orbit-panel-${feature.id}`}
                    tabIndex={index === active ? 0 : -1}
                    onClick={() => goTo(index)}
                    className={`orbit-node ${index === active ? 'is-active' : ''}`}
                    style={{
                      '--node-angle': `${angleFor(index, features.length)}deg`,
                      '--node-color': feature.color
                    } as React.CSSProperties}
                  >
                    <span className="orbit-node-dot" aria-hidden="true" />
                    <span className="orbit-node-label">{feature.eyebrow}</span>
                  </button>
                ))}
              </div>

              {/* --------------------------------------------------- The phone */}
              <div className="orbit-phone">
                <Device>
                  {features.map((feature, index) => (
                    <Image
                      key={feature.id}
                      src={feature.src}
                      alt={feature.alt}
                      fill
                      sizes="(max-width: 640px) 190px, 300px"
                      quality={95}
                      // Only the first is eager: it is what the section opens
                      // on, and the other three arrive long before their turn.
                      priority={index === 0}
                      className={`orbit-screen object-cover ${index === active ? 'is-active' : ''}`}
                    />
                  ))}
                </Device>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- The words */}
          {/* Every panel stays mounted and stacked; only opacity changes. The
              grid cell is sized by the tallest of them, so nothing reflows as
              the active one changes. */}
          <div className="order-2 lg:order-1">
            <div className="orbit-panels">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  role="tabpanel"
                  id={`orbit-panel-${feature.id}`}
                  aria-labelledby={`orbit-tab-${feature.id}`}
                  className={`orbit-panel ${index === active ? 'is-active' : ''}`}
                >
                  <p className="eyebrow text-muted">{feature.eyebrow}</p>
                  <h3 className="section-title mt-4 text-balance">{feature.title}</h3>
                  <p className="lede mt-5 text-pretty text-muted">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
