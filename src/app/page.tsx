import Image from 'next/image';
import Link from 'next/link';

import { DeviceVideo } from '@/components/device';
import InstallButton from '@/components/install-button';
import ArchFruit from '@/components/arch-fruit';
import FeatureOrbit, { type OrbitFeature } from '@/components/feature-orbit';
import OrbField from '@/components/orb-field';
import Reveal from '@/components/reveal';
import StructuredData, { homeGraph } from '@/components/structured-data';
import { site } from '@/config/site';

/**
 * The whole marketing site, on one page.
 *
 * Rebuilt around the app itself. The first version was well-set type and
 * nothing else, which reads as a document rather than a product — every app in
 * this category is carried by pictures of the thing, and a page that describes
 * an interface without showing one asks the visitor to take it on faith.
 *
 * What it does **not** borrow from those pages is their social proof. Glorify
 * opens with twenty million downloads and a 4.9 average; HolyFit has no users
 * yet, and numbers or testimonials invented to fill that space would be a lie
 * told on the same page as a privacy policy. So the page claims nothing it
 * cannot show, and the space where a competitor puts its numbers is simply
 * left empty.
 */

/**
 * The four features, as data for `FeatureOrbit`.
 *
 * `screen` used to be a rendered `<DeviceShot>` per feature, because each one
 * had a handset of its own. There is one handset now and the pictures are
 * swapped inside it, so what the orbit needs is the image, not an element
 * wrapping it. The colour is which of the app's `ORBS` each feature answers
 * to, and it is what the wash behind the phone turns to.
 */
const features: OrbitFeature[] = [
  {
    id: 'routine',
    eyebrow: 'The routine',
    title: 'It starts with one answer',
    body: 'How many times a day do you want to sit down, and when? Up to two sittings each of reading, prayer and reflection, at hours you pick. Everything else in the app follows from that: what today looks like, what it reminds you of, what it counts.',
    src: '/visuals/routine.PNG',
    alt: 'Setting a routine in HolyFit: reading, prayer and reflection, each at an hour you choose.',
    color: '#5b72ef'
  },
  {
    id: 'study',
    eyebrow: 'Study',
    title: 'Read, and keep what it left you',
    body: 'Build a plan from the passages you actually want to read (a book, a theme, a list someone gave you) and set the days it runs. One passage at a time, in your translation, ticked off when you have read it.',
    src: '/visuals/plan-passage.PNG',
    alt: 'A passage open in HolyFit, with the plan it belongs to above it.',
    color: '#7bd44b'
  },
  {
    id: 'pray',
    eyebrow: 'Pray',
    title: 'A list you keep, not a wall you perform on',
    body: 'Write down what you are carrying and come back to it. Nobody else can see it. There is no feed, no sharing, and no other reader anywhere in the app.',
    src: '/visuals/prayer-sreen.PNG',
    alt: 'The prayer list in HolyFit.',
    color: '#e36fd2'
  },
  {
    id: 'reflect',
    eyebrow: 'Reflect',
    title: 'A few lines a day, where you can find them',
    body: 'One entry per day, private and searchable. The app works out your streak from the entries themselves rather than asking you to defend one.',
    src: '/visuals/refrelct-screen.PNG',
    alt: 'The reflection journal in HolyFit, one entry a day.',
    color: '#f0a05a'
  }
];

const promises = [
  ['No analytics', 'There is no analytics SDK in the app. Not a self-hosted one either. We do not know which screens you open or how long you stay.'],
  ['No advertising', 'No ad network, no ad identifier, no advertising profile. Nothing about you is used to sell anything to you.'],
  ['No push notifications', 'Reminders are scheduled by your phone, on your phone. There is no push token, so no server learns the hours you keep.'],
  ['No selling or sharing', 'Not sold, not rented, not handed to anyone for their own purposes, in the senses GDPR and California law give those words.']
];

const faqs = [
  {
    q: `Is ${site.name} free?`,
    a: 'Yes. No charge, no subscription and no advertising. If that ever changes it will be announced in the app before it takes effect, never applied to an account that already exists without warning.'
  },
  {
    q: 'Can other people see what I write?',
    a: 'No. Not your notes, not your prayers, not your journal, not your routine. There is no sharing feature and no public profile. Every row of your data is fenced off in the database by a rule that checks it belongs to you before it is returned, including for us.'
  },
  {
    /* The question the category actually gets asked, and the one place the
       difference between this and a devotional app can be stated plainly
       rather than implied. It earns its place as copy; that it also carries
       the terms people search for is a second reason, not the first. */
    q: `Is ${site.name} a devotional app?`,
    a: `Not in the usual sense. A devotional app hands you today's reading and today's thought. ${site.name} asks what your routine is and then keeps it: you bring the passages, set the hours, and it reminds you and gets out of the way. There is no daily content written by us, no streak to defend, and nothing that turns red when you miss a day.`
  },
  {
    q: 'Which translations can I read in?',
    a: 'The list is served from our own API rather than built into the app, so translations can be added as licences allow without waiting for an App Store release. You pick one in Profile, and it is used for new plans.'
  },
  {
    q: 'Does it work without a connection?',
    a: 'Not fully, and it is better to say so. Your plans, notes, prayers and journal live on our server so they survive a lost phone, which means reading a passage or saving an entry needs a connection. Reminders still fire without one.'
  },
  {
    q: 'Is there an Android version?',
    a: 'Not yet. HolyFit is being tested on iOS first. There is no date to promise, and one will not be invented here.'
  },
  {
    q: 'How do I delete my account?',
    a: `Profile → Delete account, inside the app. It asks twice and then removes the account and every plan, note, prayer and journal entry attached to it. It is permanent. If you have lost access to the app, ${site.privacyEmail} will do it for you.`
  }
];

export default function HomePage() {
  return (
    <>
      {/* Generated from `faqs` above, so the markup cannot drift from what the
          page actually shows further down. */}
      <StructuredData data={homeGraph(faqs)} />

      {/* ---------------------------------------------------------------- Hero */}
      {/*
        * Pulled up under the header, and padded back down by exactly as much.
        *
        * A sticky header occupies flow space *above* this section, so the wash
        * began below it and the two met at a hard horizontal seam across the
        * top of the page — visible before the visitor had scrolled anything.
        * The negative margin lets the orb field run to the very top of the
        * document and the matching padding puts the content back where it was,
        * so the header now floats in the wash instead of capping it. The number
        * is the header's height; the two must be changed together.
        */}
      <section className="orb-field relative -mt-[4.25rem] pt-[4.25rem]">
        <OrbField />
        <div className="mx-auto max-w-5xl px-5 pb-24 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-28">
          <Reveal>
            {/* No app icon above the headline. It sat a few hundred pixels
                below the same mark in the header, which said the name twice
                before the page had said anything once. */}
            <h1 className="hero-title mx-auto max-w-3xl text-balance">
              {site.tagline}
            </h1>

            <p className="lede mx-auto mt-7 max-w-xl text-pretty text-muted">
              A Christian daily routine you set yourself: Bible reading, prayer and reflection, at hours you choose.{' '}
              {site.name} remembers, reminds, and gets out of the way.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <InstallButton />
              {site.installUrl ? <p className="max-w-sm text-sm text-muted">{site.installNote}</p> : null}
            </div>
          </Reveal>

          {/* The app running, immediately — before the visitor has to read
              anything to find out what it is.

              Shown whole. It was cropped against the fold, which is the
              fashionable treatment and was simply wrong here: the crop landed
              two thirds up the handset and read as a rendering fault rather
              than as a device continuing past the edge. */}
          <Reveal delay={120}>
            <div className="hero-stage mt-14 sm:mt-16">
              {/* The arch, and the handset hung inside it. */}
              <div className="hero-arch">
                <div className="hero-arch-line" aria-hidden="true" />
                <ArchFruit angles={[-55, 55]} />
              </div>

              <div className="hero-arch-phone relative">
                <div className="brand-wash absolute -inset-10 rounded-[70px] opacity-20 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <DeviceVideo
                    src="/visuals/demo-web.mp4"
                    poster="/visuals/demo-poster.jpg"
                    label={`A recording of ${site.name} in use: today’s reading, the routine, and the prayer list.`}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Everything below the hero shares one ground. See `.on-dark`. */}
      <div className="on-dark">
      {/* -------------------------------------------------------- Trust strip */}
      <section className="border-y border-line/50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 text-center text-sm font-semibold text-muted sm:px-8">
          <span>No advertising</span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span>No tracking</span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span>No feed</span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span>Nothing shared with anyone</span>
        </div>
      </section>

      {/* ------------------------------------------------------------- Practice */}
      {/*
        * The one photograph on the page, full-bleed and early.
        *
        * This began as four thumbnails in a contained grid further down, which
        * was the wrong shape for the job: a grid of small pictures under four
        * sections of screenshots reads as a gallery, and a gallery is
        * decoration. The sites this is measured against — Glorify most directly
        * — each commit a whole screen to one image and let it carry the
        * feeling. Bigger and earlier beats more.
        *
        * Composition chosen for the layout, not just the subject: the figure
        * sits right, the mist and low sun fill the left, so overlaid copy lands
        * on the quiet half of the frame instead of fighting the subject.
        *
        * Still no identifiable face. A silhouette needs no model release, and
        * it lets the reader be the person in it, which a portrait does not.
        *
        * Unsplash License. unsplash.com/photos/lPCu8HnGU2E
        */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          {/* Same shell as the final ask: `max-w-5xl`, the 2.5rem radius and a
              hairline border. It was full-bleed, which made it the loudest
              thing on the page and put it in a different family from every
              other block. Inside a card it reads as part of the page. */}
          <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] border border-line sm:h-[480px] lg:h-[540px]">
            <Image
              src="/people/sunrise-wide.jpg"
              alt="A person kneeling in silhouette beside still water, in mist, against a low sun."
              fill
              // Capped by the card, not the viewport: `max-w-5xl` less the
              // gutters is 960px at the widest it ever draws.
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
              // The sun blows out at low quality and bands across the mist.
              quality={95}
            />

            {/*
              * The scrim changes direction with the viewport, and it has to.
              *
              * A left-to-right scrim is right on a wide card: the copy occupies
              * the left and the figure the right, so darkening one side buys
              * contrast without burying the subject. Narrow, that same gradient
              * fails — the crop puts the bright mist directly behind the text.
              *
              * The values are measured, not judged by eye — by hiding the copy,
              * photographing what sits behind it and taking the worst pixel in
              * the box. The eye was wrong twice before: an earlier pass ran body
              * copy at 2.93:1 and looked fine. Narrowing this from full-bleed to
              * a card re-crops the image, so the numbers were taken again.
              */}
            <div
              className="absolute inset-0 sm:hidden"
              style={{ background: 'linear-gradient(180deg, rgba(8,10,20,0.92) 0%, rgba(8,10,20,0.86) 50%, rgba(8,10,20,0.45) 100%)' }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 hidden sm:block"
              style={{ background: 'linear-gradient(90deg, rgba(8,10,20,0.92) 0%, rgba(8,10,20,0.82) 55%, rgba(8,10,20,0.30) 82%, rgba(8,10,20,0) 100%)' }}
              aria-hidden="true"
            />

            <div className="relative flex h-full items-center px-8 sm:px-12">
              <div className="max-w-lg">
                {/* White regardless of theme: it sits on a photograph, not on
                    the page, so it must not follow the palette underneath. */}
                <p className="eyebrow text-white/70">The practice</p>
                <h2 className="section-title mt-4 text-balance text-white">It does not look the same for anyone</h2>
                <p className="lede mt-5 text-pretty text-white/90">
                  A sitting is a sitting whether it happens at a kitchen table before the house is up, on a train, or in
                  a building built for it. {site.name} has no opinion about where you are.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------- What it is */}
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="section-title">What it is</h2>
          <div className="lede mt-6 space-y-5 text-muted">
            <p>
              Most Christian devotional apps are built around a plan you are handed and a streak you are afraid to
              break. Both work until the first day you miss, and then they mostly work against you.
            </p>
            <p>
              <strong className="text-ink">{site.name} is built around a routine you set yourself.</strong> You say how
              many times a day you want your quiet time (to read, to pray, to write) and at what hours. Everything else
              follows from that one answer.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- Features */}
      <FeatureOrbit features={features} />

      {/* ----------------------------------------------------------- Privacy */}
      <section id="privacy">
        <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <h2 className="section-title max-w-2xl text-balance">What we don’t do</h2>
            <p className="lede mt-5 max-w-2xl text-muted">
              Not promises about intentions. Statements about what is in the app. Each one is checkable against the{' '}
              <Link href="/privacy">privacy policy</Link>, which names every company that touches your data and exactly
              what it sees.
            </p>
          </Reveal>

          {/* Four, so two columns divides evenly. Three columns left an orphan on
              the second row, which reads as a card that failed to load. */}
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {promises.map(([title, body], index) => (
              <Reveal key={title} delay={index * 50}>
                <li className="h-full rounded-2xl border border-line bg-background p-6">
                  <p className="font-bold text-base">{title}</p>
                  <p className="body-copy mt-2 text-muted">{body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>


  
      {/* --------------------------------------------------------------- FAQ */}
      <section className="border-t border-line/50">
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <h2 className="section-title">Questions</h2>
          </Reveal>

          <div className="mt-12 divide-y divide-line border-y border-line">
            {faqs.map(faq => (
              // `details` rather than a state hook: it opens without JavaScript,
              // is keyboard-operable for free, and is what a browser's own
              // find-in-page can expand.
              <details key={faq.q} className="group py-6">
                <summary className="subsection-title flex cursor-pointer list-none items-center justify-between gap-6 marker:hidden">
                  {faq.q}
                  <span className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="body-copy mt-4 max-w-2xl text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Final ask */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="orb-field overflow-hidden rounded-[2.5rem] border border-line px-8 py-20 text-center">
            <OrbField />
            <h2 className="section-title mx-auto max-w-lg text-balance">Start with one sitting a day.</h2>
            <p className="lede mx-auto mt-5 max-w-md text-muted">
              Change the routine whenever you like. Nothing is lost when you do.
            </p>
            <div className="mt-9 flex justify-center">
              <InstallButton />
            </div>
          </div>
        </Reveal>
      </section>
      </div>
    </>
  );
}
