# holyfit-site

The marketing page for HolyFit, plus the two legal documents the App Store
listing has to point at. **This is not a web version of the app** — nothing here
signs in, reads scripture or touches the API. It is four static pages.

Next.js 16 (App Router) · React 19 · Tailwind v4 · no runtime dependencies
beyond those.

```bash
npm run dev     # http://localhost:3000
npm run build   # all four routes prerender to static HTML
npm run lint
```

## Where things are

| Route      | File                       | Why it exists                                   |
| ---------- | -------------------------- | ----------------------------------------------- |
| `/`        | `src/app/page.tsx`         | The whole pitch, on one scrollable page          |
| `/privacy` | `src/app/privacy/page.tsx` | **Required** as the App Store Privacy Policy URL |
| `/terms`   | `src/app/terms/page.tsx`   | The EULA, including Apple's required clauses     |
| `/support` | `src/app/support/page.tsx` | **Required** as the App Store Support URL        |

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

Static output, so anything works. `vercel --prod` from this directory, or point
Vercel/Netlify at the repo. Set the custom domain to `useholyfit.com`; nothing
else needs configuring, as there are no environment variables and no server.
