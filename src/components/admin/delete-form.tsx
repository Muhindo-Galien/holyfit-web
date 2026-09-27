'use client';

/**
 * Removing something from the catalogue, behind a question.
 *
 * A client component for one reason: `confirm()`. Deleting a template is one
 * click next to a Save button, it cannot be undone from this console, and the
 * thing being deleted may be a list somebody spent an evening typing.
 *
 * What it does *not* destroy is worth saying on the button's own page rather
 * than only here: plans and prayers already started from a template were copies
 * from the moment they were made, so tidying the catalogue never reaches into
 * anybody's own.
 */
export default function DeleteForm({
  code,
  noun,
  action
}: {
  code: string;
  noun: string;
  action: (form: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={event => {
        if (!confirm(`Delete the ${noun} "${code}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="code" value={code} />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center rounded-full border border-danger/50 px-5 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10"
      >
        Delete this {noun}
      </button>
    </form>
  );
}
