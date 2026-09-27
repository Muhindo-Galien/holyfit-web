import type {
  NewPlanEntry,
  NewPrayerEntry,
  PlanTemplateEntry,
  PrayerTemplateEntry
} from '@/lib/holyfit-api';

/**
 * A template's list as one block of text, one entry per line.
 *
 * **A textarea rather than a row of inputs with an "add" button, deliberately.**
 * The work this console exists for is bulk: twenty-one chapters of John, five
 * requests for the persecuted church, pasted in from wherever the editor
 * actually wrote them. A repeating field set makes that twenty-one clicks and
 * needs JavaScript to do anything at all; a textarea is one paste, and the form
 * still submits with scripting off.
 *
 * It costs a format, which is the trade being made here. `|` separates the
 * fields, and the rules below are chosen so that the character an editor is
 * most likely to type anyway does the least damage.
 */

/** The separator, and the one character an editor may not put mid-field freely. */
const SEP = '|';

/**
 * Everything after the *first* separator is one field.
 *
 * `John 3 | Nicodemus, at night | and the verse everybody knows` keeps its
 * second pipe rather than silently dropping the tail, because a description is
 * prose and prose contains punctuation. The alternative — refusing the line —
 * would be a parser lecturing an editor about a character.
 */
function splitOnce(line: string): [string, string] {
  const at = line.indexOf(SEP);
  if (at === -1) return [line.trim(), ''];
  return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
}

function lines(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

// --- Passages, for a plan template --------------------------------------------

/**
 * `John 1 | The Word became flesh`, one per line.
 *
 * The description is optional; a line that is only a reference is the common
 * case for a straight read-through.
 *
 * Nothing here checks the reference. That is the API's job and it is the whole
 * reason templates are written through it rather than through a table editor:
 * it parses every one of them, refuses the write, and names *all* the bad lines
 * at once. A second, weaker check here would only disagree with it — this
 * parser knowing less about what a reference may be than the parser that
 * decides.
 */
export function parsePassages(text: string): NewPlanEntry[] {
  return lines(text).map(line => {
    const [verse, description] = splitOnce(line);
    return { verse, description };
  });
}

export function formatPassages(entries: PlanTemplateEntry[]): string {
  return entries
    .map(entry => (entry.description ? `${entry.verse} ${SEP} ${entry.description}` : entry.verse))
    .join('\n');
}

// --- Requests, for a prayer template -------------------------------------------

/**
 * `Title | the situation | the ask | theirs`, one per line.
 *
 * Only the title is required. The trailing `theirs` marks a request that is
 * about somebody else rather than about the reader, and it is read as a flag
 * **only when the last field is exactly that word or `mine`** — so an intention
 * that happens to end in a pipe-separated clause is left alone instead of
 * having its last sentence eaten by a parser looking for a keyword. A flag that
 * can be mistaken for content is worse than no flag.
 */
export function parseRequests(text: string): NewPrayerEntry[] {
  return lines(text).map(line => {
    const parts = line.split(SEP).map(part => part.trim());

    let isMine = true;
    const last = parts[parts.length - 1]?.toLowerCase();
    if (parts.length > 1 && (last === 'mine' || last === 'theirs')) {
      isMine = last === 'mine';
      parts.pop();
    }

    const [title, description, ...rest] = parts;

    return {
      title: title ?? '',
      description: description ?? '',
      // Rejoined rather than truncated, for the reason `splitOnce` exists: the
      // ask is a sentence somebody wrote, and a sentence may contain the
      // separator.
      intention: rest.length > 0 ? rest.join(` ${SEP} `) || null : null,
      isMine
    };
  });
}

export function formatRequests(entries: PrayerTemplateEntry[]): string {
  return entries
    .map(entry => {
      const fields = [entry.title, entry.description, entry.intention ?? ''];

      // Trailing empties are dropped so a bare title stays a bare line, but an
      // empty description between a title and an intention has to stay, or the
      // ask would be read back as the situation.
      while (fields.length > 1 && fields[fields.length - 1] === '') fields.pop();

      // Only written when it is false: `mine` is the default, and printing it
      // on every line would make the common case look like the exception.
      if (!entry.isMine) fields.push('theirs');

      return fields.join(` ${SEP} `);
    })
    .join('\n');
}
