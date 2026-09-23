'use client';

import { useEffect, useRef, useState } from 'react';

import { Device } from '@/components/device';

/**
 * The demo, looping silently — and stoppable.
 *
 * Muted, `playsInline` and `loop` are all three load-bearing rather than
 * stylistic: iOS refuses to autoplay anything with sound, and without
 * `playsInline` Safari on iPhone takes the video fullscreen the moment it
 * starts — which would hijack the page on the visitor's first scroll.
 *
 * **It still autoplays for everyone.** It used to hold the poster frame and
 * offer a play button to anyone whose system asks for reduced motion. That is
 * the conventional reading of the setting, and it is overridden here
 * deliberately: the loop is the only place on the page the app is shown
 * *running*, and a visitor who lands on a still of it has been shown a
 * screenshot they already have four of further down. Autoplay is the product
 * demo, not decoration.
 *
 * What it no longer does is autoplay *without recourse*. A loop longer than
 * five seconds that the visitor cannot stop is the thing WCAG 2.2.2 is about,
 * and the argument above — that the running app is the point — is an argument
 * for starting it, not for refusing to let anyone stop it. Someone reading the
 * sentence beside a phone that keeps moving has no way out of it short of
 * scrolling the page, and that is a page handling its visitor rather than
 * serving them.
 *
 * So the control sits *below the handset*, not on it. Still no `controls`, for
 * the same reason there were none before: the native bar renders **inside** the
 * screen, and a scrub bar across the bottom of it is the one thing that stops a
 * mockup reading as a phone. One button, outside the frame, in the page's own
 * type — the mockup survives and the visitor is in charge of it.
 *
 * This is why the file exists at all. `device.tsx` renders on the server and
 * has no reason not to; a `<video>` somebody can pause needs a ref and a
 * listener, so it moved here rather than dragging the screenshots client-side
 * with it.
 */
export default function DeviceVideo({
  src,
  poster,
  label
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  /*
   * The button reads the element, rather than the element obeying the button.
   *
   * `autoPlay` is a request, not a guarantee — a browser on a metered
   * connection, or with data saver on, or one that has decided this tab is not
   * allowed to start media, will refuse it. A button holding its own idea of
   * what the video is doing would then say "Pause" over a still frame. Playing
   * and pausing are announced by the element itself, so the label is a report
   * rather than a guess.
   */
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const sync = () => setPlaying(!video.paused);
    sync();

    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    return () => {
      video.removeEventListener('play', sync);
      video.removeEventListener('pause', sync);
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;

    if (video.paused) {
      // A refused `play()` rejects. Nothing here needs to know: the element
      // stays paused and `sync` keeps the button honest about it.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Device>
        <video
          ref={ref}
          className="h-full w-full object-cover"
          poster={poster}
          aria-label={label}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
        </video>
      </Device>

      {/* Quiet on purpose. It is a way out of the motion, not a second call to
          action competing with the one above the handset. */}
      <button
        type="button"
        onClick={toggle}
        className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-elevated px-4 py-1.5 text-sm font-semibold text-muted transition hover:text-ink"
      >
        <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
          {playing ? (
            <>
              <rect x="0" y="0" width="3.5" height="12" rx="1" />
              <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
            </>
          ) : (
            <path d="M0 1.1a1 1 0 0 1 1.5-.87l8 4.9a1 1 0 0 1 0 1.74l-8 4.9A1 1 0 0 1 0 10.9z" />
          )}
        </svg>
        {playing ? 'Pause the demo' : 'Play the demo'}
      </button>
    </div>
  );
}
