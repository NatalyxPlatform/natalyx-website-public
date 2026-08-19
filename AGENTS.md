# natalyx-website-public — Agent Context

Public **Next.js marketing site**. Not app runtime; **no PHI**, ever.

## Audience

**Fertility clinics.** The site sells clinic-first operational infrastructure
for coordinating known-surrogate journeys, and the only interest flow is a
clinic-interest flow. Participant acquisition (intended parent / gestational
carrier / donor registration, role selection, waitlists) is retired — do not
reintroduce it.

Intended parents and gestational carriers are still *described*, because a
clinic needs the journey explained. That is education, not acquisition. Do not
delete participant vocabulary from explanatory copy.

Known-surrogate (BYOS) surrogacy is the wedge and proof case, not the limit of
the company.

## Boundaries

- Do not copy app-private workflow details, internal architecture, or internal
  claims into public pages.
- Coordinate product copy/claims with the app + design-system context (root
  workspace `AGENTS.md`); the design system owns the visual language reference.
- Synthetic/marketing content only; no participant data, invite codes, or
  environment details.
- Never claim PHI readiness, clinical validation, deployment, general
  availability, integrations that do not exist, or existing partner clinics.
- Never claim Natalyx replaces clinic staff, medical judgment, attorneys,
  mental-health evaluators, or other providers. They stay authoritative.

## Map

| Path | Owns |
| --- | --- |
| `src/app/page.tsx` | Landing composition |
| `src/app/layout.tsx` | Shell, site metadata, OG/Twitter |
| `src/app/clinic-interest/` | The one interest page |
| `src/app/api/clinic-interest/route.ts` | Submission endpoint |
| `src/components/landing/` | Landing sections |
| `src/components/clinic-interest/` | Form + success state |
| `src/components/ui/` | Design primitives |
| `src/lib/validation.ts` | The single zod schema (client **and** server) |
| `src/lib/leadDelivery.ts` | Lead record + delivery channels |
| `src/lib/rateLimit.ts` | Best-effort endpoint throttle |
| `supabase/migrations/` | Lead-capture schema history |
| `docs/acceptance-clinic-interest.md` | Acceptance matrix the tests answer to |

## Submission path

`ClinicInterestForm` → `POST /api/clinic-interest` → `clinicInterestSchema` →
`buildClinicInterestLead` → `deliverClinicInterestLead`.

Load-bearing properties — check these before changing anything here:

- **One schema, two sides.** The client and the route parse with the same zod
  object. Do not add a second, hand-rolled client validator.
- **The lead is built from named fields.** A key added to the form cannot reach
  delivery without being added to `buildClinicInterestLead`, and unknown keys
  are stripped by the schema.
- **A failure is never a success.** No channel configured, or every channel
  failing, raises; the route answers 500/502 and the form renders an error.
  Success renders only on an explicit `ok: true`.
- **Nothing is verified.** Email and phone normalization is formatting only.
  No copy may imply an address or number was checked.
- **The browser never posts to a third party.** Delivery keys are server-only.

## Leads

Clinic leads go to `marketing_private.clinic_interest_leads`, append-only: one
row per submission, so a corrected phone number or a second clinic registered
from one address is never silently dropped.

The historical participant leads in `marketing_private.public_interest_leads`
are treated as history: not migrated, not rewritten, not reinterpreted, and no
longer written by this site. That is a property of this code — **no database
rule enforces it**. The two populations are separated by being separate tables;
only the clinic table has a `lead_type` column.

## Checks

`npm run typecheck` · `npm run lint` · `npm test` · `npm run build`.

Set `LEAD_DELIVERY_MODE=log` for any local or browser testing so the whole
submission path runs without sending anything externally.
