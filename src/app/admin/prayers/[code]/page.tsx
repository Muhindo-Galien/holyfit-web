import Link from 'next/link';
import { notFound } from 'next/navigation';

import { removePrayerSet, savePrayerSet } from '@/app/admin/actions';
import DeleteForm from '@/components/admin/delete-form';
import TemplateForm from '@/components/admin/template-form';
import { ApiError, getPrayerTemplate } from '@/lib/holyfit-api';
import { formatRequests } from '@/lib/template-lines';

/**
 * One prayer set, edited in place.
 *
 * The same page as its plan-side twin, with one difference that is worth
 * knowing before editing: these are the words somebody will be using to ask.
 * Rewording a request changes what the next reader starts carrying and does not
 * touch the wall of anybody who started it already — the copy was made when
 * they did.
 */
export default async function PrayerTemplatePage({
  params
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let template;
  try {
    template = await getPrayerTemplate(code);
  } catch (error) {
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
        {template.entryCount} {template.entryCount === 1 ? 'request' : 'requests'} ·{' '}
        {template.days ? `carried for ${template.days} days` : 'carried open-ended'} ·{' '}
        {template.isPublished ? 'published' : 'a draft, so no reader can see it'}
      </p>

      <TemplateForm
        kind="prayer"
        mode="edit"
        action={savePrayerSet}
        initial={{
          code: template.code,
          title: template.title,
          summary: template.summary ?? '',
          days: template.days === null ? '' : String(template.days),
          isPublished: template.isPublished,
          entries: formatRequests(template.entries)
        }}
      />

      <div className="mt-14 border-t border-line pt-8">
        <h2 className="subsection-title">Remove it</h2>
        <p className="mt-2 max-w-xl text-pretty text-sm text-muted">
          The requests go with it. Prayers people are already carrying do not: those became theirs
          the moment they started, and tidying the catalogue must never reach onto somebody&rsquo;s
          own wall.
        </p>
        <div className="mt-5">
          <DeleteForm code={template.code} noun="prayer set" action={removePrayerSet} />
        </div>
      </div>
    </>
  );
}
