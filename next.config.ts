import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /*
   * Pin the workspace root to this directory.
   *
   * Without it Turbopack walks up looking for a lockfile, finds one two levels
   * above in `self-projects/`, and infers a root that spans every unrelated
   * project on the machine — including, on one pass, the home directory. That
   * changes what gets traced into the build output, so it is worth being
   * explicit rather than warned about on every build.
   */
  turbopack: { root: path.resolve(process.cwd()) },

  images: {
    /*
     * The captures in `public/visuals` are screenshots of a UI: 11pt labels,
     * hairline dividers, one-pixel strokes. That is the worst case for a lossy
     * encoder, and the default 75 was visibly smearing the type inside the
     * handset. Next 16 requires every quality an `Image` may ask for to be
     * listed here, so 95 has to be declared before `quality={95}` means
     * anything: the optimiser answers an unlisted value with a 400 and the
     * `<img>` simply fails to load, which is a louder failure than it sounds
     * — the srcset falls back and the frame paints its own background.
     *
     * 75 stays in the list because it is the component default; dropping it
     * would coerce every image that does not pass `quality` up to 95.
     */
    qualities: [75, 95],

    /*
     * Exact-multiple widths for the handset.
     *
     * `DeviceShot` renders into a box of a fixed 280px, or 244px below the
     * 420px breakpoint — it never reflows. Those are the frame's 300 and 260
     * minus the bezel it spends on each side, which is the measurement to take:
     * an image fills the screen, not the handset around it. So the widths a
     * browser actually needs are those two times the display's pixel ratio, and
     * none of them existed: the stock ladder jumps 384 → 640, leaving a 2×
     * screen to resample a 640px file down to 560 device pixels. Fractional
     * resampling is what turns a sharp screenshot soft, and no amount of
     * quality fixes it, because the damage happens in the browser after
     * decoding.
     *
     * With 244/280 (1×), 488/560 (2×) and 732/840 (3×) present, every common
     * display gets a file that maps one image pixel to one device pixel.
     *
     * The split between the two lists is Next's: `imageSizes` is only
     * consulted for images that declare `sizes`, and must stay below the
     * smallest `deviceSizes` entry — so the 1× and 2× widths live in one and
     * the 3× widths in the other.
     */
    imageSizes: [32, 48, 64, 96, 128, 244, 256, 280, 384, 488, 560],
    deviceSizes: [640, 732, 750, 828, 840, 1080, 1200, 1920, 2048, 3840]
  }
};

export default nextConfig;
