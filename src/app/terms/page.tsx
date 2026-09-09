import type { Metadata } from 'next';
import Link from 'next/link';

import LegalPage, { type LegalSection } from '@/components/legal-page';
import { MINIMUM_AGE, site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The agreement between you and the operator of ${site.name} for the use of the app.`
};

const sections: LegalSection[] = [
  {
    id: 'agreement',
    heading: 'This agreement',
    body: (
      <>
        <p>
          These Terms of Service (the “Terms”) are an agreement between you and the operator of {site.name} (“we”,
          “us”) covering your use of the {site.name} mobile app and this website (together, the “Service”).
        </p>
        <p>
          By creating an account or using the Service you accept these Terms. If you do not accept them, please do not
          use the Service. Our <Link href="/privacy">Privacy Policy</Link> forms part of this agreement and explains
          what happens to your information.
        </p>
      </>
    )
  },
  {
    id: 'eligibility',
    heading: 'Who may use it',
    body: (
      <>
        <p>
          You must be at least {MINIMUM_AGE} years old to use the Service. If the law where you live sets a higher age
          at which you can agree to terms like these on your own, you must meet that age instead.
        </p>
        <p>By using the Service you confirm that you meet this requirement and that nobody has barred you from it.</p>
      </>
    )
  },
  {
    id: 'what-it-is',
    heading: 'What the Service does',
    body: (
      <>
        <p>
          {site.name} helps you keep a daily practice of reading, prayer and reflection. It lets you build reading
          plans, read passages of scripture, write notes and journal entries, keep a list of prayers, and set a routine
          of daily sittings that the app reminds you of.
        </p>
        <p>
          It is a tool for a personal practice. <strong>It is not a church, a counsellor, a doctor or a spiritual
          director</strong>, and nothing in it is professional advice (see <a href="#no-advice">section 10</a>).
        </p>
      </>
    )
  },
  {
    id: 'account',
    heading: 'Your account',
    body: (
      <>
        <p>
          You need an account to use the app. Give accurate information when you create one, keep your sign-in details
          to yourself, and tell us promptly at <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> if you
          think someone else has got into it.
        </p>
        <p>
          You are responsible for what happens under your account. One account is for one person; please do not share
          it.
        </p>
        <p>
          You may close your account at any time (see <a href="#ending">section 13</a>).
        </p>
      </>
    )
  },
  {
    id: 'your-content',
    heading: 'What you write stays yours',
    body: (
      <>
        <p>
          Your notes, prayers, journal entries, plans and everything else you create in the Service (“Your Content”)
          belong to you. We claim no ownership of them.
        </p>
        <p>
          You give us a narrow, practical permission (to store, back up and transmit Your Content) and only so that we
          can operate the Service and show it back to you. That permission exists for no other purpose. It is not a
          licence to publish, display, distribute, sell or analyse what you write, and it ends when you delete the
          content or your account.
        </p>
        <p>
          Your Content is private by default and by design. The Service has no sharing feature, no public profile and no
          way for another user to see anything of yours.
        </p>
      </>
    )
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    body: (
      <>
        <p>Please do not:</p>
        <ul>
          <li>Use the Service to do anything unlawful, or to store material that is unlawful to possess.</li>
          <li>Try to access another person’s account, data, or any part of our systems you are not entitled to.</li>
          <li>
            Probe, scan, overload or interfere with the Service or the infrastructure it runs on, or attempt to get
            round any rate limit or security measure.
          </li>
          <li>
            Extract scripture text from the Service in bulk, redistribute it, or use it in another product. It is
            licensed to us, not to you (see <a href="#scripture">section 8</a>).
          </li>
          <li>Reverse engineer or decompile the app, except to the extent the law expressly permits despite this term.</li>
          <li>Use automated means to create accounts or access the Service.</li>
        </ul>
      </>
    )
  },
  {
    id: 'our-content',
    heading: 'Our part of it',
    body: (
      <>
        <p>
          The Service itself (the app, this site, the name {site.name}, the logo, the design and the software behind
          it) belongs to us and our licensors. These Terms give you a personal, non-exclusive, non-transferable, revocable
          licence to use the app on devices you own or control, for your own personal use. Nothing more is granted.
        </p>
      </>
    )
  },
  {
    id: 'scripture',
    heading: 'Scripture text',
    body: (
      <>
        <p>
          Scripture is supplied to us under licence through a third-party provider, and each translation remains the
          copyright of its publisher. The attribution a translation’s licence requires is shown with the text in the app.
        </p>
        <p>
          You may read it in the app and quote from it as the translation’s own licence allows. You may not redistribute
          it, republish it in bulk, or build another product on it through our Service. Which translations we can offer
          may change if a licence changes, and we cannot promise any particular one will always be available.
        </p>
      </>
    )
  },
  {
    id: 'availability',
    heading: 'Availability, testing and changes',
    body: (
      <>
        <p>
          {site.name} is currently in testing. It is offered <strong>as is</strong>: it may contain defects, it may be
          interrupted, and features may change or be withdrawn as it develops.
        </p>
        <p>
          We do not promise any level of uptime, and we may modify, suspend or discontinue any part of the Service. If
          we ever discontinue it altogether, we will give you reasonable notice in the app and a way to export what you
          have written before it goes.
        </p>
        <p>
          <strong>Please keep your own copy of anything you would be upset to lose.</strong> We take backups and we take
          them seriously, but no service is a substitute for your own records.
        </p>
      </>
    )
  },
  {
    id: 'no-advice',
    heading: 'Not advice, and not a substitute for help',
    body: (
      <>
        <p>
          {site.name} provides tools for personal reading and reflection. It does not provide medical, psychological,
          legal, financial or professional pastoral advice, and nothing in it should be relied on as such.
        </p>
        <p>
          <strong>
            If you are in crisis or thinking about harming yourself, please contact your local emergency services or a
            crisis line in your country.
          </strong>{' '}
          This app is not equipped to help and cannot see what you write.
        </p>
      </>
    )
  },
  {
    id: 'price',
    heading: 'Price',
    body: (
      <>
        <p>
          The Service is free to use at the moment. There are no ads and no purchases inside the app.
        </p>
        <p>
          If we ever introduce a paid feature, we will say so clearly in the app before it applies, and using the free
          parts will never retroactively cost you anything.
        </p>
      </>
    )
  },
  {
    id: 'third-parties',
    heading: 'Third-party services',
    body: (
      <>
        <p>
          The Service relies on providers listed in our <Link href="/privacy">Privacy Policy</Link>, including Clerk
          for sign-in and Apple for distribution. Your use of those services is also subject to their own terms, and we
          are not responsible for them.
        </p>
      </>
    )
  },
  {
    id: 'ending',
    heading: 'Ending this agreement',
    body: (
      <>
        <p>
          <strong>You</strong> may stop at any time. Email{' '}
          <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> to have your account and everything in it
          deleted, permanently, within 30 days. Ask us for a copy first if you want to keep your journal.
        </p>
        <p>
          <strong>We</strong> may suspend or close your account if you materially breach these Terms (in particular
          section 6) or if we are required to by law. Except where the breach is serious or we are legally prevented,
          we will contact you first and give you a chance to put it right. If we close your account, we will give you a
          reasonable opportunity to retrieve Your Content unless the law prevents us.
        </p>
        <p>
          Sections that by their nature should survive the end of this agreement (ownership, disclaimers, liability,
          and governing law) do survive it.
        </p>
      </>
    )
  },
  {
    id: 'disclaimers',
    heading: 'Disclaimers',
    body: (
      <>
        <p>
          To the fullest extent the law allows, the Service is provided “as is” and “as available”, without warranties
          of any kind, whether express or implied, including any implied warranty of merchantability, fitness for a
          particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, error-free
          or secure, or that any defect will be corrected.
        </p>
        <p>
          <strong>
            Some jurisdictions do not allow the exclusion of certain warranties. Where that is the case, this section
            applies to you only as far as the law permits, and your statutory rights as a consumer are not affected.
          </strong>
        </p>
      </>
    )
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <>
        <p>
          To the fullest extent the law allows, we will not be liable for any indirect, incidental, special,
          consequential or punitive damages, or for any loss of data, profits, revenue or goodwill, arising out of your
          use of or inability to use the Service.
        </p>
        <p>
          Our total liability for any claim relating to the Service is limited to the greater of the amount you paid us
          in the twelve months before the claim (which, while the Service is free, is nothing) or USD 50.
        </p>
        <p>
          <strong>
            Nothing in these Terms excludes or limits our liability for death or personal injury caused by our
            negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be excluded
            or limited.
          </strong>
        </p>
      </>
    )
  },
  {
    id: 'indemnity',
    heading: 'Indemnity',
    body: (
      <>
        <p>
          You agree to indemnify us against claims, losses and reasonable costs arising from your breach of these Terms
          or your unlawful use of the Service. This does not apply where the claim arises from our own breach or
          negligence, and it does not apply to the extent the law does not permit it.
        </p>
      </>
    )
  },
  {
    id: 'apple',
    heading: 'If you got the app from Apple',
    body: (
      <>
        <p>These terms apply when you obtain the app through the App Store or TestFlight:</p>
        <ul>
          <li>
            This agreement is between <strong>you and us only</strong>, not with Apple. We, not Apple, are solely
            responsible for the app and its content.
          </li>
          <li>
            Apple has <strong>no obligation to provide maintenance or support</strong> for the app. Support requests go
            to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </li>
          <li>
            If the app fails to conform to any applicable warranty, you may notify Apple and Apple will refund the
            purchase price, if any. To the maximum extent permitted by law, Apple has no other warranty obligation
            whatsoever with respect to the app.
          </li>
          <li>
            We, not Apple, are responsible for addressing any claim relating to the app, including product liability
            claims, failure to conform to a legal requirement, and claims under consumer protection or similar
            legislation.
          </li>
          <li>
            We, not Apple, are responsible for investigating and defending any third-party claim that the app infringes
            that party’s intellectual property rights.
          </li>
          <li>
            You confirm you are not located in a country subject to a U.S. Government embargo or designated as
            “terrorist supporting”, and are not on any U.S. Government list of prohibited or restricted parties.
          </li>
          <li>
            <strong>
              Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.
            </strong>
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'law',
    heading: 'Governing law',
    body: (
      <>
        <p>
          These Terms are governed by the laws of {site.governingLaw}, and the courts of {site.governingLaw} have
          jurisdiction over any dispute, except that if you are a consumer, you keep the benefit of any mandatory
          protections and the right to bring proceedings in the country where you live.
        </p>
      </>
    )
  },
  {
    id: 'general',
    heading: 'The remaining details',
    body: (
      <>
        <p>
          <strong>Changes.</strong> We may update these Terms. The date at the top changes when we do, and we will tell
          you in the app before any material change takes effect. Continuing to use the Service after that means you
          accept the new version; if you do not, you may close your account.
        </p>
        <p>
          <strong>Severability.</strong> If a term is found unenforceable, the rest stays in force and that term is
          applied as far as it lawfully can be.
        </p>
        <p>
          <strong>No waiver.</strong> If we do not enforce a term straight away, we have not given up the right to.
        </p>
        <p>
          <strong>Transfer.</strong> You may not transfer this agreement. We may transfer it to a successor of the
          Service, on notice to you.
        </p>
        <p>
          <strong>Whole agreement.</strong> These Terms and the Privacy Policy are the entire agreement between us about
          the Service.
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
          {site.operator} · <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </p>
      </>
    )
  }
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      pending={[site.governingLaw]}
      summary={
        <>
          <p>
            {site.name} is a personal tool for reading, prayer and reflection. Use it lawfully, keep your account to
            yourself, and don’t try to extract the scripture text in bulk. It is licensed to us, not to you.
          </p>
          <p>
            <strong>What you write stays yours.</strong> We store it only to show it back to you, and we make no claim
            on it. You can have it all deleted at any time.
          </p>
          <p>
            The app is in testing and provided as is, so keep your own copy of anything precious. It is not medical,
            psychological or professional pastoral advice. If you are in crisis, please contact your local emergency
            services.
          </p>
        </>
      }
      sections={sections}
    />
  );
}
