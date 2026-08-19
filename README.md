# Natalyx Public Website

Public Next.js website for Natalyx.

This repo owns the marketing and interest-capture surface only.

## Positioning

The audience is **fertility clinics**. Natalyx is presented as clinic-first
operational infrastructure for coordinating known-surrogate journeys: one
coordinated journey and case context, less repetitive participant and provider
follow-up, organized operational handoffs, clearer outstanding work, and
clinic-branded coordination where appropriate. The clinic and its providers
stay authoritative throughout.

Known-surrogate (BYOS) gestational surrogacy is the current wedge and proof
case, not the limit of the company.

## Boundaries

- The people registering interest are clinics. Do not reintroduce participant,
  intended-parent, gestational-carrier, or donor registration to this site.
- Intended parents and gestational carriers are still described where the copy
  explains a journey to a clinic. That is education, not acquisition, and it
  should not be stripped out.
- Do not position Natalyx as a matching marketplace or as an online agency that
  owns clinical, legal, escrow, payment, eligibility, or matching decisions.
- Do not claim Natalyx replaces clinic staff, medical judgment, attorneys,
  mental-health evaluators, or other providers.
- Do not claim PHI readiness, clinical validation, deployment, general
  availability, integrations that do not exist, or existing partner clinics.
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
  fans it out to the configured channels (`supabase`, `web3forms`, or the
  explicit `log` mode). Nothing configured, or every channel failing, raises -
  the route answers 500/502 and the form shows an error. A submission that was
  not delivered is never shown as a success.
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

### Deployment note

The Web3Forms access key moved from a bundled `NEXT_PUBLIC_` variable with a
hard-coded fallback to the server-only `WEB3FORMS_ACCESS_KEY`. There is no
fallback any more, so a deployment that relies on Web3Forms must set it.

## Repo Ownership

- `src/app` owns Next.js pages, metadata, and the API route.
- `src/components/landing` owns public landing-page sections.
- `src/app/clinic-interest` and `src/components/clinic-interest` own the
  clinic-interest flow.
- `src/lib` owns validation, lead delivery, and rate limiting.
- `supabase/migrations` owns the public lead-capture schema history.
- `docs/acceptance-clinic-interest.md` is the acceptance matrix the tests are
  written against.

Production participant journey, case context, provider handoffs, PHI handling,
and app-service integration belong in `natalyx-app`, `natalyx-intelligence`, and
`natalyx-infra`, not in this public website repo.
