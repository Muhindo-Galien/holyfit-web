import type { CSSProperties } from 'react';

/**
 * The app's orb field, drifting.
 *
 * `ORBS` from `holyfit-app/src/components/GenericComponents/ambientBackground`
 * — the same six, same hues, same fractional centres, radii and opacities.
 *
 * **Why this is six elements and not one background-image.** It used to be the
 * latter: six `radial-gradient`s stacked in a single `background-image` on
 * `.orb-field`. That is the cheaper way to paint a static field and the wrong
 * way to animate one, because the only things you can animate on it are
 * `background-position` and the image itself, and both repaint the whole layer
 * every frame. Split into one element per orb, the motion is `transform` only,
 * which the compositor handles without touching paint.
 *
 * The motion is deliberately almost too slow to notice. These are out-of-focus
 * washes behind a page about sitting still; anything you can actually watch
 * would be a different app's backdrop. Each orb gets its own duration and a
 * negative delay, so no two are in phase and the field never visibly loops.
 *
 * Nothing here is interactive or informative, so the whole layer is
 * `aria-hidden` and inert.
 */

type Orb = {
  id: string;
  color: string;
  /** Centre, as a percentage of the field's width / height. */
  x: number;
  y: number;
  /** Radius, as a percentage of the axis it lies on. */
  size: number;
  opacity: number;
  /** Seconds. Deliberately coprime-ish so the field never resynchronises. */
  duration: number;
  /** Negative delay, so every orb starts mid-drift rather than all at rest. */
  delay: number;
  drift: 'a' | 'b' | 'c';
};

const ORBS: Orb[] = [
  { id: 'lime', color: '#7bd44b', x: 50, y: 22, size: 42, opacity: 0.85, duration: 29, delay: 0, drift: 'a' },
  { id: 'amber', color: '#f0a05a', x: 86, y: 44, size: 30, opacity: 0.7, duration: 37, delay: 6, drift: 'b' },
  { id: 'magenta', color: '#e36fd2', x: 24, y: 56, size: 26, opacity: 0.7, duration: 31, delay: 13, drift: 'c' },
  { id: 'indigo', color: '#5b72ef', x: 12, y: 73, size: 28, opacity: 0.6, duration: 43, delay: 3, drift: 'b' },
  { id: 'jade', color: '#3fbf7f', x: 74, y: 80, size: 30, opacity: 0.6, duration: 34, delay: 19, drift: 'a' },
  { id: 'blush', color: '#f2a0c0', x: 90, y: 9, size: 22, opacity: 0.55, duration: 41, delay: 9, drift: 'c' }
];

export default function OrbField() {
  return (
    <div className="orb-layer" aria-hidden="true">
      {ORBS.map(orb => (
        <div
          key={orb.id}
          className={`orb orb--drift-${orb.drift}`}
          style={
            {
              '--orb-x': `${orb.x}%`,
              '--orb-y': `${orb.y}%`,
              '--orb-size': `${orb.size}%`,
              '--orb-color': orb.color,
              '--orb-opacity': orb.opacity,
              animationDuration: `${orb.duration}s`,
              animationDelay: `-${orb.delay}s`
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
