import Link from 'next/link';
import { notFound } from 'next/navigation';

import { removePlan, savePlan } from '@/app/admin/actions';
import DeleteForm from '@/components/admin/delete-form';
import TemplateForm from '@/components/admin/template-form';
import { ApiError, getPlanTemplate } from '@/lib/holyfit-api';
import { formatPassages } from '@/lib/template-lines';

/**
 * One plan template, edited in place.
 *
 * Edited *live*, which is why the draft switch exists at all: this is the same
 * row a reader browses, and there is no staging copy. The API's own comment
 * makes the same point from the other side — a draft is a 404 to a reader, so
 * work happens in the open without being on offer.
 *
 * `params` is awaited: in this version of Next it is a promise, and the
 * codemod-free way to read it is the one below.
 */
export default async function PlanTemplatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  let template;
  try {
    template = await getPlanTemplate(code);
  } catch (error) {
    // 404 is the page not existing, which the framework already knows how to
    // draw. Anything else is a fact about the API and has to be readable rather
    // than dressed up as a missing page.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <Link href="/admin" className="text-sm font-semibold text-accent underline underline-offset-4">
        ← Catalogue
      </Link>

      <h1 className="section-title mt-6 text-pretty">{template.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {template.entryCount} {template.entryCount === 1 ? 'passage' : 'passages'} ·{' '}
        {template.isPublished ? 'published' : 'a draft, so no reader can see it'}
      </p>

      <TemplateForm
        kind="plan"
        mode="edit"
        action={savePlan}
        initial={{
          code: template.code,
          title: template.title,
          summary: template.summary ?? '',
          days: String(template.days),
          isPublished: template.isPublished,
          entries: formatPassages(template.entries)
        }}
      />

      <div className="mt-14 border-t border-line pt-8">
        <h2 className="subsection-title">Remove it</h2>
        <p className="mt-2 max-w-xl text-pretty text-sm text-muted">
          The passages go with it. Plans people already started do not: those were copies from the
          moment they were made, and somebody three weeks into this one keeps every word of it.
        </p>
        <div className="mt-5">
          <DeleteForm code={template.code} noun="plan template" action={removePlan} />
        </div>
      </div>
    </>
  );
}
