# Natalyx Public Website

Public Next.js website for Natalyx.

This repo owns the marketing and interest-capture surface only.

## Positioning

The audience is **fertility clinics**. What a surrogacy agency does day to day
is run a manual relay between the intended parents, the carrier, clinic staff
and outside professionals. Natalyx is presented as that relay, automated and
running inside the clinic: patient preparation, provider handoffs, outstanding
records, appointments and shared journey context, so a practice can run
surrogacy journeys in-house instead of referring patients out.

What is automated is the relay, never the care. Copy may say the agency's
manual workflow is fully automated; it may never say the journey, the care, or
clinical, legal or eligibility decisions are.

The clinic remains the coordinating center. Natalyx is an extension of the
clinic's operation, not a parallel service — participants and providers stay
inside a clinic-led journey rather than being sent into a separate consumer
product. It is designed to fit into clinic operations and to connect with
existing clinic systems as integrations are enabled.

Scope is the clinic's whole surrogacy population, **however a carrier entered
the journey** - known to the intended parents, or clinic-referred.

Natalyx supports clinic-directed carrier discovery and referral workflows. It
is not a direct-to-consumer marketplace: clinics remain responsible for
screening, clinical eligibility and final decisions, and Natalyx does not
automatically rank or select carriers. Do not restate that as a blanket denial
that Natalyx will ever help source carriers, and do not claim automated
matching exists today - neither is accurate.

"In-house" means the coordination runs through the clinic's workflow. It does
not mean every service happens inside the clinic, and it does not mean no
outside referral occurs: attorneys, evaluators, doulas, agencies and other
outside providers still take part.

`docs/acceptance-all-surrogacy-positioning.md` is the authority for what the
copy must mean, and `tests/positioning.test.ts` enforces it.

## Boundaries

- The people registering interest are clinics. Do not reintroduce participant,
  intended-parent, gestational-carrier, or donor registration to this site.
- Intended parents and gestational carriers are still described where the copy
  explains a journey to a clinic. That is education, not acquisition, and it
  should not be stripped out. They are people in a journey, never capacity,
  supply or inventory.
- Never present Natalyx as a direct-to-consumer marketplace, or as an online
  agency owning clinical, legal, escrow, payment or eligibility decisions.
  Screening, clinical eligibility and final decisions stay with the clinic.
- Do not claim Natalyx replaces clinic staff, medical judgment, attorneys,
  mental-health evaluators, other providers, or the clinic's EHR.
- Do not claim PHI readiness, clinical validation, deployment, general
  availability, integrations that do not exist, or existing partner clinics.
  Forward-looking capability is written as *built to* / *designed to*.
- The pilot is being **recruited**: Natalyx is looking for 10 fertility clinics
  to join it. No clinic has signed up, so no surface may use the present-tense
  equivalents that turn the search into a result. `docs/acceptance-all-surrogacy-positioning.md`
  (P28) quotes the exact wordings that are forbidden.
- Public forms stay lead-capture oriented. Never request PHI, medical facts,
  legal documents, financial records, or case data from this site.
- Server-side credentials belong only in server runtime configuration. Never
  commit service-role keys or live lead data.

## Local Development

```bash
npm ci
cp .env.example .env.local   # then set LEAD_DELIVERY_MODE=log
npm run dev
```

`LEAD_DELIVERY_MODE=log` exercises the entire submission path while sending
nothing to a third party. Use it whenever testing the form.

Checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Interest capture

One flow, at `/clinic-interest`. `/signup` permanently redirects to it.

The form collects four fields and nothing else: clinic name, the registrant's
name, work email, and phone number, plus a consent checkbox. It asks no role
question and no patient, case, or health question.

```
ClinicInterestForm  ->  POST /api/clinic-interest  ->  clinicInterestSchema
                    ->  buildClinicInterestLead    ->  deliverClinicInterestLead
```

- `src/lib/validation.ts` holds the single zod schema used by **both** the
  client and the route, so the two cannot drift. Unknown keys are stripped.
- `src/lib/leadDelivery.ts` builds the delivered record from named fields and
  runs the **server-side** channels (Supabase, or the `log` mode). It may
  legitimately have none, and it never throws: a storage failure is logged and
  reported back, never allowed to block the email.
- **Email delivery happens in the browser.** Web3Forms rejects server-to-server
  calls on the free plan (403 "Use our API in client side"), so the route hands
  the built payload back as `forward` and the form POSTs it to Web3Forms. The
  browser only relays what the server composed, so it cannot widen or alter
  what is sent, and the form reports success only once Web3Forms accepts.
- `src/lib/rateLimit.ts` is a best-effort per-address throttle on the public
  endpoint. Read its header comment before relying on it: it is per process and
  trusts the platform's forwarded headers.
- Email and phone are normalized for formatting only. Nothing on this site
  verifies that an address or number exists or is owned by the submitter.

### Leads

New clinic leads go to `marketing_private.clinic_interest_leads`. The
historical participant submissions in `marketing_private.public_interest_leads`
are left exactly as they are - not migrated, not rewritten, not reinterpreted -
and the website no longer writes to that table. Nothing in the database enforces
that; it is a property of this code, not a constraint.

The two populations are kept apart by being separate tables. The clinic table
additionally stamps `lead_type` on every row; the historical table has no such
column and is not being altered to add one, so anything unioning the two must
supply the discriminator for the older rows.

Submissions are append-only - every submission is a row. A clinic correcting a
phone number, or one address registering a second clinic, must not be dropped
while the page reports success. De-duplication belongs to whoever reads the
leads.

### The Web3Forms access key

A built-in key ships in `src/lib/constants.ts`, so **no deployment
configuration is required**. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` overrides it to
route leads to a different inbox.

`NEXT_PUBLIC_` is correct here: the key genuinely must reach the browser,
because the browser is what calls Web3Forms. Their access keys are public by
design - the docs say the key "can be public", since it is normally embedded in
client-side HTML. It names a destination inbox and grants no account access.

Note what this does and does not buy. Routing through `/api/clinic-interest`
first still gives server-side validation, honeypot enforcement and rate
limiting on our endpoint, and it means the emailed payload is composed
server-side. It does not stop anyone posting to Web3Forms directly with the
public key - nothing can, and nothing could before.

## Repo Ownership

- `src/app` owns Next.js pages and the API route. Page metadata composes the
  strings from `src/lib/positioning.ts`; it does not define them.
- `src/lib/positioning.ts` owns the site title, descriptions, social card copy
  and JSON-LD, defined once so metadata cannot describe a different product
  from the one the page shows.
- `src/components/landing` owns public landing-page sections, including the
  team section and the founder contact details inside it. That content is
  quoted from the clinic pitch deck - two founders only, no commercial figures,
  no added credentials - and `public/team` holds the headshots cropped from
  that deck, served unoptimized so they do not depend on `/_next/image`.
- `src/app/clinic-interest` and `src/components/clinic-interest` own the
  clinic-interest flow.
- `src/lib` owns validation, lead delivery, and rate limiting.
- `supabase/migrations` owns the public lead-capture schema history.
- `docs/acceptance-clinic-interest.md` is the acceptance matrix for the
  submission flow, and `docs/acceptance-all-surrogacy-positioning.md` is the
  matrix for what the public copy must mean. The tests are written against
  both.

Production participant journey, case context, provider handoffs, PHI handling,
and app-service integration belong in `natalyx-app`, `natalyx-intelligence`, and
`natalyx-infra`, not in this public website repo.
