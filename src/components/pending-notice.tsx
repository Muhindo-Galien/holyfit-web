import { isPending } from '@/config/site';

/**
 * Draws attention to a value in `config/site.ts` that was never decided.
 *
 * Visible on the live page on purpose. A legal document is exactly the kind of
 * thing that gets written once, skimmed, and deployed with a bracketed token
 * still in the governing-law clause; a comment in the source would not stop
 * that, and the App Store reviewer reading the page would be the one to find
 * it. When the value is filled in this renders nothing and disappears on its
 * own — there is no second edit to remember.
 */
export default function PendingNotice({ values }: { values: string[] }) {
  const unresolved = values.filter(isPending);
  if (unresolved.length === 0) return null;

  return (
    <div className="not-prose mb-10 rounded-2xl border border-danger/40 bg-danger/5 p-5 text-sm">
      <p className="font-semibold text-danger">This document is not finished.</p>
      <p className="mt-2 text-muted">
        {unresolved.length === 1 ? 'A value has' : `${unresolved.length} values have`} not been filled in yet. Set{' '}
        {unresolved.length === 1 ? 'it' : 'them'} in <code className="font-mono text-xs">src/config/site.ts</code> before
        submitting the app for review.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-xs text-muted">
        {unresolved.map(value => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}
