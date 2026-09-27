# holyfit-site

The marketing page for HolyFit, plus the two legal documents the App Store
listing has to point at. **This is not a web version of the app** — no reader
signs in here and no scripture is served. Four static pages, a waitlist form,
and one hidden console for whoever edits the catalogue.

Next.js 16 (App Router) · React 19 · Tailwind v4 · Clerk on two routes and
nowhere else.

```bash
npm run dev     # http://localhost:3000
npm run build   # the four public routes prerender; /waitlist and /admin do not
npm run lint
```

## Where things are

| Route      | File                       | Why it exists                                   |
| ---------- | -------------------------- | ----------------------------------------------- |
| `/`        | `src/app/page.tsx`         | The whole pitch, on one scrollable page          |
| `/privacy` | `src/app/privacy/page.tsx` | **Required** as the App Store Privacy Policy URL |
| `/terms`   | `src/app/terms/page.tsx`   | The EULA, including Apple's required clauses     |
| `/support` | `src/app/support/page.tsx` | **Required** as the App Store Support URL        |
| `/waitlist` | `src/app/waitlist/page.tsx` | Clerk's waitlist form. `noindex`, and not in the sitemap |
| `/admin`   | `src/app/admin/`           | The catalogue console. Hidden — see below        |

## The catalogue console, on `/admin`

Where plan templates and prayer sets are written — the lists a reader can start
without typing one out themselves. It talks to `holyfit-backend`; set
`HOLYFIT_API_URL` (`.env.example` says where) and point it at **staging** unless you
mean production.

**Hidden is four decisions, and only three are the obvious ones.** Nothing links
to it, it is `noindex, nofollow`, and it is absent from the sitemap. It is
deliberately **not** in `robots.txt`: that file is public, so `Disallow: /admin`
would publish the address to everyone curious enough to read it, and a hostile
crawler ignores it anyway.

**Hidden is also not the protection.** Three things refuse, in order, and only
the last one matters:

1. `src/app/admin/layout.tsx` draws a sign-in or a refusal rather than a form.
2. Every Server Action in `src/app/admin/actions.ts` re-checks, because an
   action is a `POST` endpoint whether or not a form was drawn.
3. **The row-level security on `plan_templates` and `prayer_templates`**, which
   reads `app_role` off the same Clerk token. This is the gate. The two checks
   above exist so a person is told *why* in words.

An administrator is an account with `role: admin` in Clerk **public** metadata —
never unsafe metadata, which an account can write for itself. This site cannot
grant it. A token minted before the change does not carry it, so sign out and
back in.

Both editors take their list as one textarea, one entry per line, because the
work is bulk — twenty-one chapters pasted at once, not twenty-one clicks. The
format is documented under each field.

**Everything factual lives in `src/config/site.ts`** — the domain, the operator,
both email addresses, the governing law, the document dates, the install link
and the full subprocessor list the privacy policy renders as a table. Edit that
file, not the pages.

## Two guards that fail loudly

Both exist because the failure they prevent is silent and expensive.

1. **Unfilled values are shown on the page.** Any `site.ts` string still
   starting with `[` renders a red "This document is not finished" panel naming
   it (`src/components/pending-notice.tsx`). `governingLaw` is currently one.
2. **The install button will not link to nothing.** While `site.installUrl` is
   empty it renders "Coming soon to the App Store" rather than a dead link. Keep
   it in step with `INVITE_URL` in `holyfit-app/src/lib/invite.ts`; they are the
   same TestFlight address.

## The privacy policy is a description, not a template

Every claim in it is checkable against the other two repos, and it will stop
being true if those change:

- **No analytics, ads or tracking SDK** — nothing of the kind is in
  `holyfit-app/package.json`.
- **No push tokens** — `use-reminders.ts` schedules local notifications only, so
  no server learns a reader's hours.
- **Reader data is fenced by RLS** — `holyfit-backend/supabase/migrations/`, and
  the API holds no service-role key (ADR-0007).
- **API.Bible never sees a reader** — the backend calls it with its own key,
  sending only the passage reference.

Adding an analytics SDK, a push token, or a sharing feature means editing
`src/app/privacy/page.tsx` in the same change.

The "no third-party script" claim is about the pages a visitor can reach, and it
is why `ClerkProvider` is mounted per route rather than at the root. `/waitlist`
and `/admin` load Clerk; every public page loads nothing at all. The middleware
matcher in `src/middleware.ts` is scoped to the same two routes, and the three
have to be edited together.

## Before submitting to Apple

Done:

- [x] `governingLaw` is set to Arizona — **confirm it**, it was inferred from
      the development machine's timezone, not from anything you said.
- [x] In-app account deletion exists (Guideline 5.1.1(v)): `Profile → Delete
      account` in the app, `DELETE /v1/profile` in the backend. The privacy
      policy and support page describe that route.

Still needs you, because each one needs a credential this repo does not have:

- [ ] Create the `support@` and `privacy@` mailboxes on `useholyfit.com`. Both
      addresses are published on every page and in both legal documents.
- [ ] Enable **"Delete self"** in the Clerk dashboard (User & Authentication →
      Restrictions). Without it Clerk refuses `user.delete()`, the app reports
      the failure, and the account survives with its data gone.
- [ ] Switch on the public TestFlight link and set `installUrl` (here *and* in
      the app's `src/lib/invite.ts`).
- [ ] Deploy, point `useholyfit.com` at it, and confirm `/privacy` and
      `/support` load publicly with no sign-in.
- [ ] Put those two URLs in App Store Connect as the Privacy Policy URL and the
      Support URL.

## Deploying

`vercel --prod` from this directory, or point Vercel/Netlify at the repo. Set
the custom domain to `useholyfit.com`.

The public pages are still static output and still need nothing configured. Two
routes are not, and they need three variables — `.env.example` has the long
version of why each one is the way it is:

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `/waitlist`, `/admin` | Live keys work **only** on the registered domain; use test keys locally |
| `CLERK_SECRET_KEY` | `/waitlist`, `/admin` | Same instance as the key above, never the other one |
| `HOLYFIT_API_URL` | `/admin` | The backend. Unset is not a build failure — the console says so on the page |

Without them the marketing pages deploy and serve exactly as before; it is the
waitlist and the console that stop working.
