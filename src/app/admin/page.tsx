import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  ApiError,
  listPlanTemplates,
  listPrayerTemplates,
  type PlanTemplateSummary,
  type PrayerTemplateSummary
} from '@/lib/holyfit-api';

/**
 * Both catalogues, on one page.
 *
 * Two lists rather than two pages behind two tabs, because the thing an
 * administrator most often wants to know is "what is still a draft" — and that
 * question is about the catalogue, not about one half of it.
 *
 * The lists are fetched side by side. They are independent calls to independent
 * routes, and awaiting one before starting the other would make this page as
 * slow as the sum of them for no reason. `allSettled` rather than `all`: if the
 * prayer catalogue is unreachable the plan catalogue is still worth drawing,
 * and an error in one half should not blank the other.
 */

function Pill({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-elevated px-2.5 py-1 text-xs font-semibold text-muted">
      Published
    </span>
  ) : (
    <span className="rounded-full border border-accent/40 px-2.5 py-1 text-xs font-semibold text-accent">
      Draft
    </span>
  );
}

function Row({
  href,
  title,
  code,
  detail,
  published
}: {
  href: string;
  title: string;
  code: string;
  detail: string;
  published: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-start justify-between gap-4 rounded-xl border border-line px-4 py-3.5 transition hover:border-accent/50"
      >
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="mt-1 block text-sm text-muted">
            <code>{code}</code> · {detail}
          </span>
        </span>
        <Pill published={published} />
      </Link>
    </li>
  );
}

function Failure({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'The API did not answer.';

  return (
    <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-pretty">
      {message}
    </p>
  );
}

function Section({
  title, blurb, newHref, newLabel, children
}: {
  title: string;
  blurb: string;
  newHref: string;
  newLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="subsection-title">{title}</h2>
        <Link href={newHref} className="text-sm font-semibold text-accent underline underline-offset-4">
          {newLabel}
        </Link>
      </div>
      <p className="mt-2 text-pretty text-sm text-muted">{blurb}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function AdminPage() {
  const [plans, prayers] = await Promise.allSettled([listPlanTemplates(), listPrayerTemplates()]);

  return (
    <>
      <h1 className="section-title">Catalogue</h1>
      <p className="lede mt-3 text-pretty text-muted">
        What a reader can start without writing it out themselves. Everything here is product
        content: nobody owns it, and starting one copies it — so correcting a typo helps everybody
        who starts it afterwards and changes nothing for somebody three weeks in.
      </p>

      <Section
        title="Plan templates"
        blurb="A reading list and the window it suggests. Behind the subscription, like plans."
        newHref="/admin/plans/new"
        newLabel="New plan template"
      >
        {plans.status === 'rejected' ? (
          <Failure error={plans.reason} />
        ) : plans.value.length === 0 ? (
          <p className="text-sm text-muted">Nothing in it yet.</p>
        ) : (
          <ul className="space-y-2">
            {plans.value.map((template: PlanTemplateSummary) => (
              <Row
                key={template.code}
                href={`/admin/plans/${template.code}`}
                title={template.title}
                code={template.code}
                detail={`${template.entryCount} ${
                  template.entryCount === 1 ? 'passage' : 'passages'
                } over ${template.days} days`}
                published={template.isPublished}
              />
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Prayer sets"
        blurb="Requests carried together. Free, like prayers — the subscription does not reach this half."
        newHref="/admin/prayers/new"
        newLabel="New prayer set"
      >
        {prayers.status === 'rejected' ? (
          <Failure error={prayers.reason} />
        ) : prayers.value.length === 0 ? (
          <p className="text-sm text-muted">Nothing in it yet.</p>
        ) : (
          <ul className="space-y-2">
            {prayers.value.map((template: PrayerTemplateSummary) => (
              <Row
                key={template.code}
                href={`/admin/prayers/${template.code}`}
                title={template.title}
                code={template.code}
                detail={`${template.entryCount} ${
                  template.entryCount === 1 ? 'request' : 'requests'
                }, ${template.days ? `over ${template.days} days` : 'carried open-ended'}`}
                published={template.isPublished}
              />
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
