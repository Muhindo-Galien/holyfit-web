/**
 * What a form action hands back to the form.
 *
 * In its own module because `'use server'` files may export nothing but async
 * functions — a shared constant alongside the actions is a build error, and the
 * error names the file rather than the export, which is a confusing five
 * minutes for whoever hits it next.
 */
export type FormState = {
  status: 'idle' | 'saved' | 'error';
  message?: string;
  /**
   * References the API refused, when it refused any.
   *
   * Only plan templates produce these: the API parses every reference before
   * storing it and names *all* the bad ones at once, so somebody pasting
   * twenty-one chapters fixes every typo in one pass instead of finding them
   * one submission at a time.
   */
  rejected?: { verse: string; error: string }[];
};

export const EMPTY: FormState = { status: 'idle' };
