import Link from 'next/link';

import { createPlan } from '@/app/admin/actions';
import TemplateForm from '@/components/admin/template-form';

/**
 * A new plan template.
 *
 * It is created as a draft unless the box is ticked, and that default is the
 * one worth keeping: a list is written over more than one sitting, and a reader
 * who started a plan from the half of John that had been typed so far would get
 * a month of empty evenings.
 */
export default function NewPlanTemplatePage() {
  return (
    <>
      <Link href="/admin" className="text-sm font-semibold text-accent underline underline-offset-4">
        ← Catalogue
      </Link>

      <h1 className="section-title mt-6">New plan template</h1>

      <TemplateForm
        kind="plan"
        mode="new"
        action={createPlan}
        initial={{ code: '', title: '', summary: '', days: '', isPublished: false, entries: '' }}
      />
    </>
  );
}
