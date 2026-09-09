import type { Metadata } from 'next';
import Link from 'next/link';

import LegalPage, { type LegalSection } from '@/components/legal-page';
import { MINIMUM_AGE, site, subprocessors } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${site.name} handles your information: what is collected, who processes it, how long it is kept, and how to have it deleted.`
};

/**
 * Written against what the app actually does rather than from a template.
 *
 * Every claim here is checkable in the source: there is no analytics SDK in the
 * app’s dependencies, reminders are scheduled with the device’s own scheduler
 * and no push token is ever registered, and every table is fenced by a
 * row-level-security policy keyed to the signed-in reader. A privacy policy
 * that overstates is a liability; one that hedges everything is useless to the
 * person reading it.
 */
const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are, and what this covers',
    body: (
      <>
        <p>
          This policy covers the {site.name} mobile app and this website, and explains what happens to information
          about you when you use them. “We” and “us” mean the operator of {site.name}.
        </p>
        <p>
          For readers in the UK and the European Economic Area, we are the <strong>data controller</strong> for that
          information. If you would rather not read the whole document, the summary above is accurate and the sections
          on <a href="#deleting">deletion</a> and <a href="#your-rights">your rights</a> are the ones most people want.
        </p>
      </>
    )
  },
  {
    id: 'you-give-us',
    heading: 'Information you give us',
    body: (
      <>
        <h3>Your account</h3>
        <p>
          Accounts are handled by Clerk, an authentication provider. When you sign up, Clerk records your{' '}
          <strong>email address</strong> and, if you supply them, your <strong>name</strong>,{' '}
          <strong>username</strong> and <strong>profile picture</strong>. We keep a copy of those four things so the app
          can greet you and show your account without calling Clerk on every screen.
        </p>
        <p>
          Your password, if you use one, is held by Clerk and never reaches us. We cannot read it and cannot recover it.
        </p>

        <h3>What you create in the app</h3>
        <p>Everything the app is for is stored so that it survives losing or replacing your phone:</p>
        <ul>
          <li>
            <strong>Reading plans:</strong> the title, description, dates and the list of passages you chose.
          </li>
          <li>
            <strong>Passages and notes:</strong> which you have marked as read, and anything you wrote about one.
          </li>
          <li>
            <strong>Prayers:</strong> the requests you write down and whether you have marked them answered.
          </li>
          <li>
            <strong>Journal entries:</strong> your daily reflections, one per day.
          </li>
          <li>
            <strong>Your routine:</strong> how many sittings of each kind you keep, the hour of each, and which ones
            you kept on which day.
          </li>
          <li>
            <strong>Settings:</strong> your chosen translation and which notices you have already seen.
          </li>
        </ul>
        <p>
          This is the private, personal material the app exists to hold. It is treated accordingly: see{' '}
          <a href="#security">Security</a>.
        </p>
      </>
    )
  },
  {
    id: 'as-you-use',
    heading: 'Information created as you use it',
    body: (
      <>
        <p>Two things are produced by the act of using the service rather than typed in by you.</p>
        <ul>
          <li>
            <strong>A session token</strong>, stored in your device’s secure keychain so you are not asked to sign in
            every time you open the app. It stays on your device. Deleting the app removes it.
          </li>
          <li>
            <strong>Server logs.</strong> Our API and its hosting provider record ordinary request information (the
            time, the route called, the response status and the originating IP address) for a short period. These are
            used to keep the service running and to investigate faults and abuse. They are not used to build a picture
            of you, and they are not combined with what you write.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'not-collected',
    heading: 'What we do not collect',
    body: (
      <>
        <p>
          Stated specifically, because “we value your privacy” is not information. None of the following exists in the
          app:
        </p>
        <ul>
          <li>
            <strong>No analytics.</strong> There is no analytics or product-measurement SDK of any kind. We do not know
            which screens you open, how often you open the app, or how long you stay.
          </li>
          <li>
            <strong>No advertising and no ad identifier.</strong> We do not show ads, use an ad network, or read your
            device’s advertising identifier.
          </li>
          <li>
            <strong>No cross-app or cross-site tracking.</strong> Nothing about you is shared for tracking purposes, so
            the app never asks for App Tracking Transparency permission.
          </li>
          <li>
            <strong>No push notification tokens.</strong> See <a href="#reminders">Reminders</a>.
          </li>
          <li>
            <strong>No location, contacts, calendar, photos, microphone, camera or health data.</strong> The app does
            not request access to any of these.
          </li>
          <li>
            <strong>No cookies on this website</strong> beyond what is needed to serve the page. There is no tracking
            pixel and no third-party script; the fonts are served from this site rather than from Google.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'reminders',
    heading: 'How reminders work, and why it matters',
    body: (
      <>
        <p>
          When you set a routine, the app schedules a local notification on your phone for each sitting. That scheduling
          is done entirely by the device, using the hours you chose.
        </p>
        <p>
          There is no push notification service involved and <strong>no push token is ever registered or sent</strong>.
          The practical consequence: no server of ours, and no third party, ever learns what time you pray or read. The
          hours are stored with the rest of your routine so they survive a new phone, but nothing outside your device
          acts on them.
        </p>
      </>
    )
  },
  {
    id: 'why',
    heading: 'Why we are allowed to hold it',
    body: (
      <>
        <p>Under the UK and EU GDPR, the lawful bases we rely on are:</p>
        <ul>
          <li>
            <strong>Performance of a contract:</strong> for your account and everything you create. We cannot show you
            your journal without storing your journal.
          </li>
          <li>
            <strong>Legitimate interests:</strong> for short-lived server logs, used to keep the service available and
            to prevent abuse. We have considered this against your interests and consider the impact minimal, as the
            logs are not used to profile anyone.
          </li>
          <li>
            <strong>Consent:</strong> for device notification permission, which you grant to iOS and can withdraw at
            any time in Settings without losing anything else.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'how-we-use',
    heading: 'What we use it for',
    body: (
      <>
        <p>Only these things:</p>
        <ul>
          <li>To sign you in and keep you signed in.</li>
          <li>To show you your plans, passages, notes, prayers, journal and routine, and to save changes to them.</li>
          <li>To work out what your day looks like: what you have kept, and what is next.</li>
          <li>To reply to you when you contact support.</li>
          <li>To keep the service running, secure and free of abuse.</li>
          <li>To comply with the law where we are legally required to.</li>
        </ul>
        <p>
          We do not use what you write to train machine-learning models, and we do not read it except where you have
          explicitly asked us to look at something in a support request, or where the law requires it.
        </p>
      </>
    )
  },
  {
    id: 'who-else',
    heading: 'Who else processes it',
    body: (
      <>
        <p>
          We use a small number of service providers to run {site.name}. They act on our instructions and may not use
          your information for their own purposes. This is the complete list.
        </p>
        <div className="not-prose mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-3 pr-4 font-bold">Provider</th>
                <th className="py-3 pr-4 font-bold">What for</th>
                <th className="py-3 pr-4 font-bold">What it sees</th>
              </tr>
            </thead>
            <tbody>
              {subprocessors.map(provider => (
                <tr key={provider.name} className="border-b border-line/60 align-top">
                  <td className="py-4 pr-4 font-semibold">
                    <a
                      href={provider.policy}
                      className="text-accent underline underline-offset-4"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {provider.name}
                    </a>
                    <span className="mt-1 block font-normal text-muted">{provider.location}</span>
                  </td>
                  <td className="py-4 pr-4">{provider.role}</td>
                  <td className="py-4 pr-4 text-muted">{provider.handles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6">
          Beyond these, we disclose information only if we are legally compelled to, or where it is necessary to
          establish or defend a legal claim. If we are ever compelled, we will tell you unless we are prohibited from
          doing so.
        </p>
        <p>
          <strong>We do not sell your personal information, and we do not share it for cross-context behavioural
          advertising</strong>, in the specific senses those terms are given by the California Consumer Privacy Act. We
          never have.
        </p>
      </>
    )
  },
  {
    id: 'where',
    heading: 'Where it is stored',
    body: (
      <>
        <p>
          Our providers are based in the United States, and your information is processed there. If you are in the UK or
          the EEA, that is a transfer outside your home jurisdiction.
        </p>
        <p>
          Those transfers are covered by the Standard Contractual Clauses (and the UK Addendum where relevant) in our
          agreements with each provider, which is the safeguard the GDPR provides for this situation. You can ask us for
          details of the safeguards that apply.
        </p>
      </>
    )
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    body: (
      <>
        <ul>
          <li>
            <strong>Your account and everything you create:</strong> for as long as your account exists. It is your
            journal; it is not ours to expire.
          </li>
          <li>
            <strong>Server logs:</strong> a short period, typically no more than 30 days, then discarded.
          </li>
          <li>
            <strong>Support emails:</strong> up to two years, so we can pick up a thread you return to.
          </li>
          <li>
            <strong>After deletion:</strong> removed from the live database immediately, and from encrypted backups
            within 30 days as those backups age out.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'deleting',
    heading: 'Deleting your account and your data',
    body: (
      <>
        <p>
          <strong>In the app:</strong> open <strong>Profile → Delete account</strong>. You will be asked twice, and then
          it happens immediately. There is no queue and no cooling-off period during which we still hold it.
        </p>
        <p>
          <strong>By email:</strong> if you have lost access to the app, write to{' '}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> from the address your account uses. We will
          confirm and complete it within 30 days, usually much sooner.
        </p>
        <p>
          Deletion removes the account and everything attached to it: every plan, passage, note, prayer, journal entry,
          routine and setting, and the sign-in record held by Clerk. <strong>It is permanent and there is no way to undo
          it.</strong> So if you want to keep your journal, ask us for a copy first (see{' '}
          <a href="#your-rights">your rights</a>) and we will send it before deleting anything.
        </p>
        <p>
          You can also delete individual items at any time in the app without deleting your account. Deleting the app
          from your phone does not delete your account, because the point of the account is that your journal survives
          the phone.
        </p>
      </>
    )
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: (
      <>
        <p>Wherever you live, you may ask us to:</p>
        <ul>
          <li>
            <strong>Give you a copy</strong> of the information we hold about you, in a portable format.
          </li>
          <li>
            <strong>Correct</strong> anything that is wrong.
          </li>
          <li>
            <strong>Delete</strong> your account and its contents.
          </li>
          <li>
            <strong>Restrict or object to</strong> a particular use of it.
          </li>
        </ul>
        <p>
          Write to <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>. We will not charge you, and we will
          not treat you differently for asking. We may need to confirm you control the email address on the account
          before acting, which is a protection for you rather than an obstacle.
        </p>
        <p>
          If you are in the UK or EEA and you think we have handled this badly, you can complain to your national data
          protection authority: in the UK, the Information Commissioner’s Office. We would rather you told us first, but
          you do not have to.
        </p>
      </>
    )
  },
  {
    id: 'security',
    heading: 'Security',
    body: (
      <>
        <p>
          Traffic between the app and our servers is encrypted in transit, and data is encrypted at rest by our database
          provider. Your session token is held in your device’s secure keychain, not in ordinary app storage.
        </p>
        <p>
          The more important measure is structural. Every table is protected by a database-level rule that checks a row
          belongs to the signed-in reader before it is returned, and our API reaches the database <em>as you</em>, using
          your own session. It holds no master key that would let it read everyone’s rows. A bug in our code therefore
          cannot hand your journal to another reader, because the database itself would refuse to produce it.
        </p>
        <p>
          No system is perfectly secure, and we will not claim otherwise. If we ever discover a breach affecting your
          information, we will tell you and the relevant regulator as the law requires.
        </p>
      </>
    )
  },
  {
    id: 'children',
    heading: 'Children',
    body: (
      <>
        <p>
          {site.name} is not directed to children under {MINIMUM_AGE}, and we do not knowingly collect personal
          information from them. If you believe a child under {MINIMUM_AGE} has created an account, write to{' '}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> and we will delete it.
        </p>
      </>
    )
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <>
        <p>
          If this policy changes, the date at the top changes with it. For anything that materially affects how your
          information is handled, we will tell you in the app before it takes effect rather than relying on you to
          re-read this page.
        </p>
      </>
    )
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <>
        <p>
          Privacy questions and requests: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
          <br />
          Everything else: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </p>
        <p>
          Operator: {site.operator}. See also our <Link href="/terms">Terms of Service</Link>.
        </p>
      </>
    )
  }
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary={
        <>
          <p>
            We store your account and the things you write (your plans, notes, prayers, journal and routine) because
            the app cannot show them to you otherwise. Nobody else can see any of it.
          </p>
          <p>
            <strong>
              There is no analytics, no advertising, no tracking and no push notifications in {site.name}.
            </strong>{' '}
            We do not know which screens you open. Your reminder times never leave your phone. We do not sell or share
            your information, and we never have.
          </p>
          <p>
            You can delete your account from inside the app, under Profile. Everything in it goes with it,
            permanently and immediately.
          </p>
        </>
      }
      sections={sections}
    />
  );
}
