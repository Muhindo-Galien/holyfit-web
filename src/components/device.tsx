import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * The app, in a handset.
 *
 * This used to draw the app's screens in CSS from its design tokens, which was
 * the right answer while there was nothing to photograph and the wrong one the
 * moment there was: a real capture shows real content — a real plan, a real
 * prayer, the actual density of the thing — and no reconstruction competes with
 * that. The frame survived the change because a bare screenshot on a page reads
 * as an attachment rather than as a product.
 *
 * The screen carries the captures' own 1206×2622 ratio rather than a height in
 * pixels — see `.device-screen` in `globals.css` — so an image fills it exactly
 * with nothing letterboxed or cropped.
 */

export function Device({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`device ${className}`}>
      <div className="device-frame">
        <div className="device-screen">
          {/* The cut-out. iOS screenshots do not capture it — the app's own
              background is what sits behind the island — so drawing it here is
              what makes a capture read as a running phone. */}
          <div className="device-island" />
          {children}
        </div>
      </div>
    </div>
  );
}

/** One screenshot, framed. */
export function DeviceShot({
  src,
  alt,
  priority = false
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Device>
      <Image
        src={src}
        alt={alt}
        width={1206}
        height={2622}
        priority={priority}
        // The screen, not the handset. 300 and 260 are the frame's outer widths;
        // the bezel spends 10 of them a side, 8 when narrow, so the box an image
        // actually fills is 280 and 244. Declaring that keeps the browser off
        // the 1206px original, which is most of a megabyte per screenshot, and
        // `next.config.ts` stocks the ladder with 244/280, 488/560 and 732/840
        // so what it fetches instead lands one image pixel on one device pixel
        // rather than being resampled down by a fraction.
        sizes="(max-width: 420px) 244px, 280px"
        // These are screenshots of a UI, not photographs. At the default 75 the
        // encoder spends its budget on the large flat fields and starves the
        // small type, which is the whole subject.
        quality={95}
        className="h-full w-full object-cover"
      />
    </Device>
  );
}
