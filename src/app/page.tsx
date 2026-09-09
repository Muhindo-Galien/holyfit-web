import Link from 'next/link';
import type { ReactNode } from 'react';

import { DeviceShot, DeviceVideo } from '@/components/device';
import InstallButton from '@/components/install-button';
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
 * told on the same page as a privacy policy. The honest substitute is the
 * `#made-by` section: being small is the actual differentiator, so it is
 * claimed rather than hidden.
 */

/** One feature, told as a claim beside a picture of it. */
type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  screen: ReactNode;
};

const features: Feature[] = [
  {
    id: 'routine',
    eyebrow: 'The routine',
    title: 'It starts with one answer',
    body: 'How many times a day do you want to sit down, and when? Up to two sittings each of reading, prayer and reflection, at hours you pick. Everything else in the app follows from that: what today looks like, what it reminds you of, what it counts.',
    points: [
      'Two mornings and an evening is a routine. So is one sitting at 6am.',
      'Change it whenever you like. Nothing you have written is lost when you do.'
    ],
    screen: (
      <DeviceShot src="/visuals/routine.PNG" alt="Setting a routine in HolyFit: reading, prayer and reflection, each at an hour you choose." />
    )
  },
  {
    id: 'study',
    eyebrow: 'Study',
    title: 'Read, and keep what it left you',
    body: 'Build a plan from the passages you actually want to read (a book, a theme, a list someone gave you) and set the days it runs. One passage at a time, in your translation, ticked off when you have read it.',
    points: [
      'Any passage will hold a note, so what you noticed on a Tuesday is still there in March.',
      'A plan keeps the translation it began in, so a book is finished in the words it was started in.'
    ],
    screen: (
      <DeviceShot src="/visuals/plan-passage.PNG" alt="A passage open in HolyFit, with the plan it belongs to above it." />
    )
  },
  {
    id: 'pray',
    eyebrow: 'Pray',
    title: 'A list you keep, not a wall you perform on',
    body: 'Write down what you are carrying and come back to it. Nobody else can see it. There is no feed, no sharing, and no other reader anywhere in the app.',
    points: [
      'Mark one answered and it stays in the list, quieter. That record is the point.',
      'Prayer is a full sitting, so keeping it counts toward your day the same way reading does.'
    ],
    screen: (
      <DeviceShot src="/visuals/prayer-sreen.PNG" alt="The prayer list in HolyFit." />
    )
  },
  {
    id: 'reflect',
    eyebrow: 'Reflect',
    title: 'A few lines a day, where you can find them',
    body: 'One entry per day, private and searchable. The app works out your streak from the entries themselves rather than asking you to defend one.',
    points: [
      'Miss a day and nothing is lost. The entries you did write are still yours.',
      'No reminders that guilt you, and nothing on the screen turns red.'
    ],
    screen: (
      <DeviceShot src="/visuals/refrelct-screen.PNG" alt="The reflection journal in HolyFit, one entry a day." />
    )
  }
];

const steps = [
  {
    title: 'Set your routine, once',
    body: 'Tell HolyFit how your day is shaped and at what hours. It asks you this on the first run, and then leaves you alone.'
  },
  {
    title: 'It reminds you, quietly',
    body: 'Each sitting gets a reminder at the hour you picked, scheduled on your phone, by your phone. No server is ever told when you pray.'
  },
  {
    title: 'Do the sitting',
    body: 'Open the reminder and land on the thing it was about: today’s passage, your prayer list, or a blank entry for today. Not a home screen to navigate from.'
  },
  {
    title: 'The day fills in',
    body: 'Home shows what you have kept and what is next, worked out from your routine rather than stored beside it. There is no score.'
  }
];

const promises = [
  ['No analytics', 'There is no analytics SDK in the app. Not a self-hosted one either. We do not know which screens you open or how long you stay.'],
  ['No advertising', 'No ad network, no ad identifier, no advertising profile. Nothing about you is used to sell anything to you.'],
  ['No tracking across apps', 'Nothing follows you off HolyFit. The app has no reason to ask permission to track you, and never does.'],
  ['No push notifications', 'Reminders are scheduled by your phone, on your phone. There is no push token, so no server learns the hours you keep.'],
  ['No location, contacts or health data', 'Never requested, never read, never stored.'],
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
        <div className="mx-auto max-w-5xl px-5 pb-24 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-28">
          <Reveal>
            {/* No app icon above the headline. It sat a few hundred pixels
                below the same mark in the header, which said the name twice
                before the page had said anything once. */}
            <h1 className="hero-title mx-auto max-w-3xl text-balance">
              A daily rhythm of Bible study, reflection and prayer.
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
            <div className="mt-16 flex justify-center sm:mt-20">
              <div className="relative">
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

      {/* -------------------------------------------------------- Trust strip */}
      <section className="border-y border-line/50 bg-surface">
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
            <p>
              It is a private app. There is no feed, no other readers, no sharing, and no way for anyone, including us,
              to browse what you have written.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------- Feature stories */}
      {features.map((feature, index) => (
        <section
          key={feature.id}
          id={feature.id}
          className={index % 2 === 1 ? 'bg-surface' : ''}
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div
              className={`flex flex-col items-center gap-14 lg:flex-row lg:gap-20 ${
                // Alternated so the eye zig-zags down the page instead of
                // running down one rail. Reversed only from `lg`, because
                // stacked the picture belongs under the words either way.
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <Reveal className="flex-1">
                <p className="eyebrow text-muted">{feature.eyebrow}</p>
                <h2 className="section-title mt-4 text-balance">{feature.title}</h2>
                <p className="lede mt-5 text-muted">{feature.body}</p>

                <ul className="mt-7 space-y-4">
                  {feature.points.map(point => (
                    <li key={point} className="body-copy flex gap-3.5 text-muted">
                      {/* The brand wash as a bullet: the only place five colours
                          belong at this size. */}
                      <span className="brand-wash mt-2.5 size-1.5 shrink-0 rounded-full" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={100} className="flex justify-center lg:flex-1">
                {/* The orb wash pooled behind the handset, so it sits in light
                    rather than on a flat panel. */}
                <div className="relative">
                  <div
                    className="brand-wash absolute -inset-8 rounded-[60px] opacity-15 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative">{feature.screen}</div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* ------------------------------------------------------- How it works */}
      <section id="how" className="mx-auto max-w-4xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="section-title">How a day goes</h2>
        </Reveal>

        <ol className="mt-14 space-y-10">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <li className="flex gap-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-base font-bold tabular-nums text-background">
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="subsection-title">{step.title}</h3>
                  <p className="body-copy mt-2 text-muted">{step.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ----------------------------------------------------------- Privacy */}
      <section id="privacy" className="bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <h2 className="section-title max-w-2xl text-balance">What we don’t do</h2>
            <p className="lede mt-5 max-w-2xl text-muted">
              Not promises about intentions. Statements about what is in the app. Each one is checkable against the{' '}
              <Link href="/privacy">privacy policy</Link>, which names every company that touches your data and exactly
              what it sees.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* --------------------------------------------------------- Made small */}
      <section id="made-by" className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="section-title text-balance">Made by one person, on purpose</h2>
          <div className="lede mt-6 space-y-5 text-muted">
            <p>
              {site.name} has no investors, no growth team and no advertising, which means nothing in it is there to
              make you open it more often. There is no engagement to optimise, so the app is free to be quiet.
            </p>
            <p>
              It also means there are no download numbers to put on this page and no testimonials to quote.{' '}
              <strong className="text-ink">It is new, and you would be early.</strong> That is the honest version, and
              it seemed a poor idea to write anything else directly above a privacy policy.
            </p>
            <p>
              If you use it and something is wrong, the person who wrote it reads the email:{' '}
              <a href={`mailto:${site.supportEmail}`} className="text-accent underline underline-offset-4">
                {site.supportEmail}
              </a>
              .
            </p>
          </div>
        </Reveal>
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
    </>
  );
}
