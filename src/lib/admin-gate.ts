import 'server-only';

import { auth } from '@clerk/nextjs/server';

/**
 * Who is asking for the console, in the three answers that need different UI.
 *
 * **The claim, not the metadata.** An administrator is a reader whose Clerk
 * session token carries `app_role: admin` — the API reads it to answer 403 in
 * words, and the database's row-level security reads the same claim off the
 * same token to decide whether a write happens at all. Reading Clerk's public
 * metadata directly here would be a second, *different* source for the same
 * fact: this page would let somebody in whose token had not picked the claim up
 * yet, and every write they attempted would fail against a policy disagreeing
 * with the page that offered the form.
 *
 * So this is not a security boundary and is not written as one. It decides
 * which of three pages to draw. The gate is in Postgres.
 */

export const ADMIN_CLAIM = 'app_role';
export const ADMIN_VALUE = 'admin';

export type AdminSession =
  | { state: 'signed-out' }
  | { state: 'not-admin'; userId: string }
  | { state: 'admin'; userId: string };

export async function adminSession(): Promise<AdminSession> {
  const { userId, sessionClaims } = await auth();

  if (!userId) return { state: 'signed-out' };

  return sessionClaims?.[ADMIN_CLAIM] === ADMIN_VALUE
    ? { state: 'admin', userId }
    : { state: 'not-admin', userId };
}
