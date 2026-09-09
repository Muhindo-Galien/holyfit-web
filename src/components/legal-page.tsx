import type { ReactNode } from 'react';

import PendingNotice from '@/components/pending-notice';
import { site } from '@/config/site';

export type LegalSection = {
  /** Anchor, so a clause can be linked to directly in a support reply. */
  id: string;
  heading: string;
  body: ReactNode;
};

type LegalPageProps = {
  title: string;
  /** The one-paragraph version, read by everyone who reads nothing else. */
  summary: ReactNode;
  sections: LegalSection[];
  /** Values from `config/site.ts` this document depends on being filled in. */
  pending?: string[];
};

/**
 * The shell both legal documents sit in.
 *
 * Shared because the two have to agree about all of it — the dates, where the
 * contents list sits, how a clause is numbered and linked. They are read side by
 * side by exactly one audience that matters at submission time, and two
 * documents that look like they came from different companies invite the
 * question of who wrote them.
 *
 * The contents list is built from the section data rather than hand-written, so
 * adding a clause cannot leave the list a clause short.
 */
export default function LegalPage({ title, summary, sections, pending = [] }: LegalPageProps) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <header>
        <h1 className="page-title">{title}</h1>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
          <div className="flex gap-2">
            <dt className="font-semibold">Effective</dt>
            <dd>{site.effectiveDate}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Last updated</dt>
            <dd>{site.lastUpdated}</dd>
          </div>
        </dl>
      </header>

      <PendingNotice values={pending} />

      {/* The plain-English version, first and visibly set apart. It is not a
          substitute for the clauses and says so, but a document nobody finishes
          protects nobody — and the summary is what most readers will act on. */}
      <section className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">In short</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed">{summary}</div>
        <p className="mt-5 text-sm text-muted">
          This summary is here to be understood, not to replace what follows. Where the two differ, the full text below
          is what applies.
        </p>
      </section>

      <nav aria-label="Contents" className="mt-12 border-y border-line py-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Contents</h2>
        <ol className="mt-4 grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
          {sections.map((section, index) => (
            <li key={section.id} className="flex gap-3">
              <span className="tabular-nums text-muted">{index + 1}.</span>
              <a href={`#${section.id}`} className="text-muted underline-offset-4 transition hover:text-ink hover:underline">
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/*
       * Typography is applied here rather than on every paragraph in both
       * documents. The `@tailwindcss/typography` plugin would do the same job,
       * but it brings a whole opinionated stylesheet to lay out two pages, and
       * its defaults would have to be overridden back to the brand's colours
       * anyway.
       */}
      <div
        className="mt-14 space-y-14 text-[15px] leading-[1.75] [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-bold [&_li]:pl-1 [&_p+p]:mt-4 [&_strong]:font-semibold [&_table]:w-full [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
      >
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="subsection-title">
              <span className="mr-3 tabular-nums text-muted">{index + 1}.</span>
              {section.heading}
            </h2>
            <div className="mt-4">{section.body}</div>
          </section>
        ))}
      </div>

      <p className="mt-16 border-t border-line pt-8 text-sm text-muted">
        Questions about this document? Write to{' '}
        <a href={`mailto:${site.supportEmail}`} className="text-accent underline underline-offset-4">
          {site.supportEmail}
        </a>
        .
      </p>
    </article>
  );
}
