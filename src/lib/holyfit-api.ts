import 'server-only';

import { auth } from '@clerk/nextjs/server';

/**
 * The holyfit API, as this site's admin console calls it.
 *
 * The only place on this site that talks to a backend at all. The marketing
 * pages are static and the waitlist is Clerk's own component; `/admin` is the
 * exception, and it is an exception with a boundary — every call here runs on
 * the server, with the signed-in administrator's own Clerk token, and nothing
 * in this module is reachable from the browser. `server-only` makes that a
 * build error rather than a convention.
 *
 * **Server-side rather than browser-side, on purpose.** The obvious shape is a
 * `fetch` from a client component with a token from `useAuth()`, and it would
 * work. It would also mean the API needs this origin in `CORS_ORIGINS`, and
 * that the base URL and every response shape ship to the browser. Server
 * Components and Server Actions need none of that: the request leaves from the
 * same machine that rendered the page, so there is no preflight, no origin to
 * allow, and the only thing crossing the network to the visitor is HTML.
 *
 * **This module is not the gate, and must not be read as one.** The gate is the
 * row-level security on `plan_templates` and `prayer_templates`, which reads
 * `app_role` off the same token this sends — so a bug here, or a page that
 * forgot to check, still cannot write the catalogue. What the checks in this
 * codebase buy is a person being told *why* in words, which is the same
 * division of labour the API's own `AdminPrincipal` dependency describes.
 */

/**
 * Where the API lives.
 *
 * Read at call time rather than at module scope. A missing variable should be a
 * sentence on the admin page — the one place anybody can act on it — and not a
 * crash during the build of a marketing site that has no other use for it.
 */
function baseUrl(): string {
  const url = process.env.HOLYFIT_API_URL;

  if (!url) {
    throw new ApiError(
      'HOLYFIT_API_URL is not set, so there is no API to ask. Set it in the environment and reload.',
      0
    );
  }

  return url.replace(/\/+$/, '');
}

/** What went wrong, in words an administrator can act on. */
export class ApiError extends Error {
  readonly status: number;
  /**
   * The references the API refused, when it refused any.
   *
   * Only ever populated for plan templates: the API parses every reference
   * before storing it and names *all* the bad ones at once, so somebody pasting
   * twenty-one chapters sees every typo in one pass instead of finding them one
   * submission at a time. Carrying the list through means the form can show it.
   */
  readonly rejected: { verse: string; error: string }[];

  constructor(message: string, status: number, rejected: { verse: string; error: string }[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.rejected = rejected;
  }
}

type Detail = string | { message?: string; rejected?: { verse: string; error: string }[] } | null;

/**
 * The API's error taxonomy, turned into sentences.
 *
 * The backend is deliberate about which code it answers with — 403 is "you are
 * not an administrator", 422 is "what you typed will not parse", 502 is "the
 * database or the provider is out of step" — and flattening all of them to
 * "something went wrong" would throw away the only part of the answer that
 * tells an editor what to do next.
 */
function toError(status: number, detail: Detail): ApiError {
  const message = typeof detail === 'string' ? detail : detail?.message;
  const rejected = typeof detail === 'string' ? [] : (detail?.rejected ?? []);

  if (status === 401) {
    return new ApiError(
      'The API would not accept the session token. Sign out and back in, and if it persists the token is missing the claims the API expects.',
      status
    );
  }

  if (status === 403) {
    return new ApiError(
      message ??
        'This account is signed in but is not a catalogue administrator. The claim comes from Clerk public metadata; setting it there is what grants it.',
      status
    );
  }

  if (status === 404) {
    return new ApiError(message ?? 'There is nothing in the catalogue by that name.', status);
  }

  if (status === 422) {
    return new ApiError(message ?? 'Some of that will not parse.', status, rejected);
  }

  return new ApiError(
    message ?? `The API answered ${status}, which is not something this page can fix.`,
    status,
    rejected
  );
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { getToken } = await auth();
  /*
   * The plain session token, not a JWT template.
   *
   * It is the token the mobile app sends and the one the API's JWKS
   * verification expects, and it carries the `app_role` claim the policies
   * read — the claim is configured on Clerk's session token itself, minted from
   * public metadata. If a template is ever introduced for this, it has to be
   * named here *and* accepted there; they are one setting in two places.
   */
  const token = await getToken();

  if (!token) {
    throw new ApiError('Not signed in, so there is no token to call the API with.', 401);
  }

  const response = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers
    },
    /*
     * Never cached, and this is the one page where that is not a default worth
     * relying on. An administrator publishes a template and reloads to check;
     * a cached list would show them the draft they just published and send
     * them looking for a bug in the API.
     */
    cache: 'no-store'
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw toError(response.status, (body as { detail?: Detail } | null)?.detail ?? null);
  }

  return body as T;
}

// --- What the catalogue looks like -------------------------------------------
//
// camelCase, because the API is: `schemas/common.py` serialises every DTO that
// way. These are the fields this console uses and not every field the API
// sends — a type is a claim about what is relied on, not a copy of a schema.

export type PlanTemplateSummary = {
  code: string;
  title: string;
  summary: string | null;
  days: number;
  entryCount: number;
  isPublished: boolean;
};

export type PlanTemplateEntry = {
  position: number;
  verse: string;
  referenceNormalized: string;
  description: string;
};

export type PlanTemplate = PlanTemplateSummary & { entries: PlanTemplateEntry[] };

export type PrayerTemplateSummary = {
  code: string;
  title: string;
  summary: string | null;
  /** Null is open-ended — carried until answered or put away. */
  days: number | null;
  entryCount: number;
  isPublished: boolean;
};

export type PrayerTemplateEntry = {
  position: number;
  title: string;
  description: string;
  intention: string | null;
  isMine: boolean;
};

export type PrayerTemplate = PrayerTemplateSummary & { entries: PrayerTemplateEntry[] };

/** What an administrator sends for one passage. No normalised form: the API derives it. */
export type NewPlanEntry = { verse: string; description: string };

export type NewPrayerEntry = {
  title: string;
  description: string;
  intention: string | null;
  isMine: boolean;
};

export type PlanTemplateFields = {
  title: string;
  summary: string | null;
  days: number;
  isPublished: boolean;
};

export type PrayerTemplateFields = {
  title: string;
  summary: string | null;
  days: number | null;
  isPublished: boolean;
};

// --- Plan templates -----------------------------------------------------------

export function listPlanTemplates() {
  return request<PlanTemplateSummary[]>('/v1/plan-templates');
}

export function getPlanTemplate(code: string) {
  return request<PlanTemplate>(`/v1/plan-templates/${encodeURIComponent(code)}`);
}

export function createPlanTemplate(body: PlanTemplateFields & { code: string; entries: NewPlanEntry[] }) {
  return request<PlanTemplate>('/v1/plan-templates', { method: 'POST', body: JSON.stringify(body) });
}

export function updatePlanTemplate(code: string, changes: Partial<PlanTemplateFields>) {
  return request<PlanTemplate>(`/v1/plan-templates/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    body: JSON.stringify(changes)
  });
}

export function syncPlanEntries(code: string, entries: NewPlanEntry[]) {
  return request<PlanTemplate>(`/v1/plan-templates/${encodeURIComponent(code)}/entries`, {
    method: 'PUT',
    body: JSON.stringify({ entries })
  });
}

export function deletePlanTemplate(code: string) {
  return request<void>(`/v1/plan-templates/${encodeURIComponent(code)}`, { method: 'DELETE' });
}

// --- Prayer templates ----------------------------------------------------------

export function listPrayerTemplates() {
  return request<PrayerTemplateSummary[]>('/v1/prayer-templates');
}

export function getPrayerTemplate(code: string) {
  return request<PrayerTemplate>(`/v1/prayer-templates/${encodeURIComponent(code)}`);
}

export function createPrayerTemplate(
  body: PrayerTemplateFields & { code: string; entries: NewPrayerEntry[] }
) {
  return request<PrayerTemplate>('/v1/prayer-templates', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export function updatePrayerTemplate(code: string, changes: Partial<PrayerTemplateFields>) {
  return request<PrayerTemplate>(`/v1/prayer-templates/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    body: JSON.stringify(changes)
  });
}

export function syncPrayerEntries(code: string, entries: NewPrayerEntry[]) {
  return request<PrayerTemplate>(`/v1/prayer-templates/${encodeURIComponent(code)}/entries`, {
    method: 'PUT',
    body: JSON.stringify({ entries })
  });
}

export function deletePrayerTemplate(code: string) {
  return request<void>(`/v1/prayer-templates/${encodeURIComponent(code)}`, { method: 'DELETE' });
}
