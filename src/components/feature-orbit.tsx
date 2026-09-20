'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { Device } from '@/components/device';

/**
 * Every feature, as one orbit rather than a section each.
 *
 * They used to be full-height blocks, each with its own handset, scrolled past
 * in order. That reads as a list of specifications: by the third phone the
 * visitor is scrolling rather than looking. Here there is one phone, held, and
 * the app changes inside it as the ring turns — which is closer to what using
 * it is actually like, and takes a quarter of the page height to say.
 *
 * **The ring runs in priority order, and shows it.** Opal's site was the
 * reference for this pass: it gives four named features a full screen each and
 * simply does not mention the rest, which is a hierarchy stated so plainly it
 * needs no explaining. A ring cannot do that — every node is on screen at once
 * by construction — so the equivalent here is the order the nodes are placed
 * in and the weight each one is given. The argument for the order lives with
 * the data, in `page.tsx`; `tier` is what carries it into the markup.
 *
 * **The scroll is not hijacked.** The section is tall and its contents are
 * `sticky`; the page scrolls at exactly its normal rate and the composition
 * happens to stay put while it does. Nothing is animated *to* a scroll
 * position, so there is no fighting the wheel and no scroll-stealing.
 *
 * **Everything is in the DOM at all times.** Every title, body and screenshot
 * renders on the server and stays rendered — inactive panels are faded, not
 * unmounted. That matters twice over: a crawler sees the whole feature set
 * rather than one of it, and someone without JavaScript gets a legible page
 * instead of a single feature and seven ghosts.
 *
 * **The ring is also a tablist.** Scroll drives the active index, but each node
 * is a real button: reachable by keyboard, announced by a screen reader, and
 * clickable by anyone who would rather not scroll eight screens to reach the
 * eighth feature. Scroll is the flourish; the buttons are the interface.
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
  /**
   * How much of a headline this is.
   *
   * `core` is the practice itself — the routine and the sittings kept inside
   * it. `more` is the plumbing around them: the day assembled, the reminder,
   * the settings. Both are real features and both are shown; the tier only
   * decides how loudly the node announces itself, so a visitor can tell at a
   * glance which of the ring is the app and which is the apparatus.
   *
   * Priority is expressed by *promoting* the core rather than by dimming the
   * rest. Fading the supporting nodes would have been the obvious way round
   * and the wrong one: they are already `--text-secondary` on `--surface`, and
   * taking opacity off that is how a label stops clearing 4.5:1.
   */
  tier: 'core' | 'more';
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
      /* The heading is rendered by the page, immediately above this section.
         It has to sit outside the track: anything inside it is either stuck to
         the viewport with the stage or eats a share of the scrub, and the
         run-in would have made the first feature active while the visitor was
         still reading the title. `aria-labelledby` reaches across happily. */
      aria-labelledby="features-heading"
      className={live ? 'orbit-track relative' : 'relative'}
      /*
       * The count, not the height.
       *
       * The track has to grow with the list — a constant height meant every
       * feature added shortened the stretch of scroll its own segment got, and
       * at seven each was down to a third of a screen — but it also has to be
       * shorter on a phone, where four and a bit screens of scrubbing is a long
       * way to travel through one section. An inline height cannot answer a
       * media query, so the element carries the count and `.orbit-track` does
       * the arithmetic at each breakpoint.
       *
       * Only once live: before that the stack needs no track to scrub, and a
       * section of nothing this tall would be a very long blank.
       */
      style={live ? ({ '--orbit-count': features.length } as React.CSSProperties) : undefined}
    >
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
                    className={`orbit-node is-${feature.tier} ${index === active ? 'is-active' : ''}`}
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
                      // on, and the rest arrive long before their turn.
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
                  {/* The same pill as the node on the ring, in the same colour.
                      Two words of small caps did not connect the panel to the
                      node that opened it, and on a ring of eight the visitor
                      needs telling which one they are looking at. */}
                  <p className="orbit-eyebrow" style={{ '--pill-color': feature.color } as React.CSSProperties}>
                    <span className="orbit-eyebrow-dot" aria-hidden="true" />
                    {feature.eyebrow}
                  </p>
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
