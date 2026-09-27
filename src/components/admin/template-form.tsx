'use client';

import { useActionState } from 'react';

import { EMPTY, type FormState } from '@/lib/form-state';

/**
 * One form for both catalogues.
 *
 * The two halves have the same fields — a code, a title, a summary, a window, a
 * published switch and a list — because they are the same idea about different
 * content, and writing the form twice would mean fixing every future change
 * twice. What genuinely differs is named in `KINDS` below and nowhere else: a
 * plan's window is required and a prayer set's is optional, and the list is
 * passages in one and requests in the other.
 *
 * A client component only for `useActionState`, which is what puts the API's
 * refusal — particularly its list of unparseable references — on the screen
 * beside the field that caused it. Without it the form would still submit and
 * still work; the editor would just be told nothing.
 */

type Kind = 'plan' | 'prayer';

const KINDS = {
  plan: {
    noun: 'plan template',
    list: 'Passages',
    /*
     * The window a plan suggests, which is deliberately not its passage count.
     * The API says the same thing in the same words; an editor reading either
     * one should reach the same conclusion about the slack being the point.
     */
    daysLabel: 'Days in the window',
    daysHelp: 'Required. Not the number of passages — John is 21 chapters inside 30 days.',
    listHelp: (
      <>
        One passage a line, as you would write it, optionally followed by{' '}
        <code>|</code> and a note: <code>John 1 | The Word became flesh</code>. Every reference is
        parsed when you save, and any that will not resolve are all listed at once.
      </>
    ),
    placeholder: 'John 1 | The Word became flesh\nJohn 2 | The first sign\nJohn 3'
  },
  prayer: {
    noun: 'prayer set',
    list: 'Requests',
    daysLabel: 'Days in the window',
    daysHelp:
      'Optional. Leave it empty for a set carried until each request is answered or put away.',
    listHelp: (
      <>
        One request a line: <code>Title | the situation | the ask</code>. Only the title is
        required. End a line with <code>| theirs</code> when the request is about somebody else
        rather than the reader.
      </>
    ),
    placeholder:
      'For those in prison for their faith | Held for meeting to pray | That they would not be forgotten | theirs\nFor their families | theirs'
  }
} as const satisfies Record<Kind, unknown>;

const field =
  'mt-2 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none';

export type Initial = {
  code: string;
  title: string;
  summary: string;
  days: string;
  isPublished: boolean;
  entries: string;
};

export default function TemplateForm({
  kind,
  mode,
  action,
  initial
}: {
  kind: Kind;
  mode: 'new' | 'edit';
  action: (state: FormState, form: FormData) => Promise<FormState>;
  initial: Initial;
}) {
  const [state, submit, pending] = useActionState(action, EMPTY);
  const copy = KINDS[kind];

  return (
    <form action={submit} className="mt-8 space-y-7">
      {state.status === 'error' ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-ink"
        >
          <p className="text-pretty">{state.message}</p>

          {state.rejected && state.rejected.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {state.rejected.map(bad => (
                <li key={bad.verse}>
                  <code>{bad.verse}</code> — {bad.error}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {state.status === 'saved' ? (
        <p role="status" className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
          Saved.
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-semibold">Code</span>
        {mode === 'new' ? (
          <>
            <input
              name="code"
              defaultValue={initial.code}
              required
              placeholder="john-in-30"
              className={field}
            />
            <span className="mt-2 block text-sm text-muted">
              Lower-case words joined by hyphens. It travels in URLs and cannot be changed
              afterwards — a new {copy.noun} is the honest way to rename one.
            </span>
          </>
        ) : (
          <>
            {/* Shown, not editable, and sent anyway: the API refuses to change
                a code, so an input here would offer something that silently
                does nothing. */}
            <p className={`${field} text-muted`}>{initial.code}</p>
            <input type="hidden" name="code" value={initial.code} />
          </>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Title</span>
        <input
          name="title"
          defaultValue={initial.title}
          required
          placeholder="Walking through John"
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Summary</span>
        <input
          name="summary"
          defaultValue={initial.summary}
          placeholder="The whole gospel, a chapter at a time."
          className={field}
        />
        <span className="mt-2 block text-sm text-muted">
          One line, shown on the card. Optional.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold">{copy.daysLabel}</span>
        <input
          name="days"
          type="number"
          min={1}
          max={366}
          defaultValue={initial.days}
          required={kind === 'plan'}
          className={field}
        />
        <span className="mt-2 block text-sm text-muted">{copy.daysHelp}</span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold">{copy.list}</span>
        <textarea
          name="entries"
          defaultValue={initial.entries}
          rows={12}
          spellCheck={false}
          placeholder={copy.placeholder}
          className={`${field} font-mono text-sm leading-relaxed`}
        />
        <span className="mt-2 block text-pretty text-sm text-muted">{copy.listHelp}</span>
      </label>

      <label className="flex items-start gap-3">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={initial.isPublished}
          className="mt-1 size-4 accent-[var(--accent)]"
        />
        <span>
          <span className="text-sm font-semibold">Published</span>
          <span className="mt-1 block text-sm text-muted">
            Off is a draft: readers cannot see it at all, which is what makes it safe to write a
            list over several sittings.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-7 py-3.5 text-[0.9375rem] font-semibold text-background transition hover:opacity-85 disabled:opacity-50"
      >
        {pending ? 'Saving…' : mode === 'new' ? `Create ${copy.noun}` : 'Save'}
      </button>
    </form>
  );
}
