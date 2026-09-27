import Link from 'next/link';

import { createPrayerSet } from '@/app/admin/actions';
import TemplateForm from '@/components/admin/template-form';

/**
 * A new prayer set.
 *
 * A draft by default, for the reason a plan template is. The window is the
 * field to leave alone unless you mean it: most sets are carried until each
 * request is answered or put away, and an end date nobody chose is worse than
 * none.
 */
export default function NewPrayerTemplatePage() {
  return (
    <>
      <Link href="/admin" className="text-sm font-semibold text-accent underline underline-offset-4">
        ← Catalogue
      </Link>

      <h1 className="section-title mt-6">New prayer set</h1>

      <TemplateForm
        kind="prayer"
        mode="new"
        action={createPrayerSet}
        initial={{ code: '', title: '', summary: '', days: '', isPublished: false, entries: '' }}
      />
    </>
  );
}
