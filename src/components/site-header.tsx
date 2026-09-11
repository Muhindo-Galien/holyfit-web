'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import InstallButton from '@/components/install-button';
import { site } from '@/config/site';

/**
 * Four links and the install button.
 *
 * **Transparent until you scroll.** It used to paint `bg-background/85` from the
 * first frame, which put an opaque band straight across the top of the hero's
 * orb field — two different colours meeting at a hard line before the visitor
 * had touched anything, which is the first thing the eye finds. Over the hero
 * the header now has no ground of its own and the wash runs behind it; the blur
 * and the rule arrive together once there is content underneath worth
 * separating from.
 *
 * No hamburger, and no menu state: at this size the links fit a narrow screen
 * once the two section anchors drop away, and a menu that exists to hide three
 * words is a component to maintain for nothing.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // A little way down rather than at 0, so the change happens after a
    // deliberate scroll instead of flickering on a trackpad's overscroll.
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      /*
       * `on-dark` only once scrolled, and that is the whole trick.
       *
       * At rest the header floats in the hero, which still follows the
       * reader's theme, so it must too. The moment it detaches it is over the
       * dark run that starts below the hero, and a white bar backed by
       * `bg-background/80` would be a light slab sitting on black. Adopting the
       * dark palette at the same instant the background appears means the two
       * always agree.
       */
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'on-dark border-b border-line/50 bg-background/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[1.0625rem] font-bold tracking-tight">
          {/* Downscaled hard — the source is 1024px square — so it is the one place
              on the page where a lossy default is most visible. */}
          <Image src="/icon.png" alt="" width={30} height={30} quality={95} className="rounded-lg" priority />
          <span>{site.name}</span>
        </Link>

        <nav className="flex items-center gap-6 text-[0.9375rem]">
          {/* Hidden on the narrowest screens rather than folded into a menu:
              both are anchors into a page the visitor can simply scroll. */}
          <Link href="/#routine" className="hidden text-muted transition hover:text-ink sm:block">
            How it works
          </Link>
          <Link href="/#privacy" className="hidden text-muted transition hover:text-ink sm:block">
            Privacy
          </Link>
          <Link href="/support" className="text-muted transition hover:text-ink">
            Support
          </Link>

          <div className="hidden sm:block">
            <InstallButton size="small" />
          </div>
        </nav>
      </div>
    </header>
  );
}
