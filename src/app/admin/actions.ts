'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';

import { adminSession } from '@/lib/admin-gate';
import type { FormState } from '@/lib/form-state';
import {
  ApiError,
  createPlanTemplate,
  createPrayerTemplate,
  deletePlanTemplate,
  deletePrayerTemplate,
  syncPlanEntries,
  syncPrayerEntries,
  updatePlanTemplate,
  updatePrayerTemplate
} from '@/lib/holyfit-api';
import { parsePassages, parseRequests } from '@/lib/template-lines';

/**
 * Everything the console writes.
 *
 * **Each of these re-checks who is calling, and that is not belt-and-braces.**
 * A Server Action is a `POST` endpoint: the layout deciding not to draw a form
 * does not stop anybody sending to the action behind it. The API refuses too,
 * and the row-level security behind *it* refuses after that — three checks, and
 * only the last one is load-bearing. The other two exist so the answer arrives
 * as a sentence rather than as a 500 from somewhere deeper.
 *
 * Saving is two calls, not one. The API keeps a template's details and its list
 * on separate routes on purpose — a `PATCH` for the title and window, a `PUT`
 * that replaces the whole list — and this console puts them behind one Save
 * because an editor thinks of them as one document. The `PUT` is sent even when
 * the textarea was not touched, which rewrites rows that did not change. That
 * is harmless here and only here: nothing hangs off a template entry, no tick,
 * no note, nothing a reader put there. The same shortcut against a reader's own
 * plan would throw away their progress.
 */

const NOT_ADMIN: FormState = {
  status: 'error',
  message: 'That account is not a catalogue administrator, so nothing was written.'
};

/** What the API said, or what went wrong before it was asked. */
function failed(error: unknown): FormState {
  if (error instanceof ApiError) {
    return { status: 'error', message: error.message, rejected: error.rejected };
  }

  // A network failure, a DNS answer, a TLS refusal: nothing the API said, so
  // nothing to quote. Naming the address is what makes it diagnosable.
  return {
    status: 'error',
    message: `Could not reach the API${
      process.env.HOLYFIT_API_URL ? ` at ${process.env.HOLYFIT_API_URL}` : ''
    }. ${error instanceof Error ? error.message : 'No further detail.'}`
  };
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function text(form: FormData, field: string): string {
  return (form.get(field) as string | null)?.trim() ?? '';
}

function optionalText(form: FormData, field: string): string | null {
  return text(form, field) || null;
}

function checked(form: FormData, field: string): boolean {
  return form.get(field) === 'on';
}

/**
 * A window in days, or null where the catalogue allows one.
 *
 * `null` is a real answer for a prayer set — carried until answered or put away
 * — and not an answer at all for a plan, whose window is what a plan *is*. The
 * caller says which it is dealing with; this only refuses what neither would
 * accept.
 */
function days(form: FormData, field: string): number | null {
  const raw = text(form, field);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 366) {
    throw new ApiError('A window is a whole number of days, from 1 to 366.', 422);
  }
  return value;
}

function code(form: FormData): string {
  const value = text(form, 'code').toLowerCase();

  if (!SLUG.test(value)) {
    throw new ApiError(
      `"${value}" is not a usable code. It travels in URLs and never changes afterwards, so it has to be lower-case words joined by hyphens — "john-in-30".`,
      422
    );
  }

  return value;
}

// --- Plan templates -----------------------------------------------------------

export async function createPlan(_previous: FormState, form: FormData): Promise<FormState> {
  if ((await adminSession()).state !== 'admin') return NOT_ADMIN;

  let slug: string;

  try {
    slug = code(form);
    const window = days(form, 'days');

    if (window === null) {
      throw new ApiError('A plan template needs a window. "John, over a month" is 30.', 422);
    }

    await createPlanTemplate({
      code: slug,
      title: text(form, 'title'),
      summary: optionalText(form, 'summary'),
      days: window,
      isPublished: checked(form, 'isPublished'),
      entries: parsePassages(text(form, 'entries'))
    });
  } catch (error) {
    return failed(error);
  }

  // Outside the `try`, because `redirect` works by throwing and a `catch` would
  // report the navigation as a failure to write.
  redirect(`/admin/plans/${slug}`);
}

export async function savePlan(_previous: FormState, form: FormData): Promise<FormState> {
  if ((await adminSession()).state !== 'admin') return NOT_ADMIN;

  try {
    const slug = text(form, 'code');
    const window = days(form, 'days');

    if (window === null) {
      throw new ApiError('A plan template needs a window. "John, over a month" is 30.', 422);
    }

    await updatePlanTemplate(slug, {
      title: text(form, 'title'),
      summary: optionalText(form, 'summary'),
      days: window,
      isPublished: checked(form, 'isPublished')
    });

    await syncPlanEntries(slug, parsePassages(text(form, 'entries')));
  } catch (error) {
    return failed(error);
  }

  refresh();
  return { status: 'saved' };
}

export async function removePlan(form: FormData): Promise<void> {
  if ((await adminSession()).state !== 'admin') return;

  await deletePlanTemplate(text(form, 'code'));
  redirect('/admin');
}

// --- Prayer templates ----------------------------------------------------------

export async function createPrayerSet(_previous: FormState, form: FormData): Promise<FormState> {
  if ((await adminSession()).state !== 'admin') return NOT_ADMIN;

  let slug: string;

  try {
    slug = code(form);

    await createPrayerTemplate({
      code: slug,
      title: text(form, 'title'),
      summary: optionalText(form, 'summary'),
      // Null on purpose where a plan refuses it: a request carried until it is
      // answered has no end date anybody meant, and the API's `days` is
      // nullable for exactly that.
      days: days(form, 'days'),
      isPublished: checked(form, 'isPublished'),
      entries: parseRequests(text(form, 'entries'))
    });
  } catch (error) {
    return failed(error);
  }

  redirect(`/admin/prayers/${slug}`);
}

export async function savePrayerSet(_previous: FormState, form: FormData): Promise<FormState> {
  if ((await adminSession()).state !== 'admin') return NOT_ADMIN;

  try {
    const slug = text(form, 'code');

    await updatePrayerTemplate(slug, {
      title: text(form, 'title'),
      summary: optionalText(form, 'summary'),
      // Sent every time, including as null. On this route null is not "leave it
      // alone" but "make it open-ended" — which is the only way a window set by
      // mistake ever comes off again.
      days: days(form, 'days'),
      isPublished: checked(form, 'isPublished')
    });

    await syncPrayerEntries(slug, parseRequests(text(form, 'entries')));
  } catch (error) {
    return failed(error);
  }

  refresh();
  return { status: 'saved' };
}

export async function removePrayerSet(form: FormData): Promise<void> {
  if ((await adminSession()).state !== 'admin') return;

  await deletePrayerTemplate(text(form, 'code'));
  redirect('/admin');
}
