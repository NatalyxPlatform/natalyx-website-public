# natalyx-website-public — Agent Context

Public **Next.js marketing site**. Not app runtime; **no PHI**, ever.

## Audience

**Fertility clinics.** The site sells clinic-first operational infrastructure
for running surrogacy journeys, and the only interest flow is a clinic-interest
flow. Participant acquisition (intended parent / gestational carrier / donor
registration, role selection, waitlists) is retired — do not reintroduce it.

Intended parents and gestational carriers are still *described*, because a
clinic needs the journey explained. That is education, not acquisition. Do not
delete participant vocabulary from explanatory copy, and do not describe
carriers as capacity, supply or inventory.

## Position

What a surrogacy agency does day to day is run a **manual relay** between the
intended parents, the carrier, clinic staff and outside professionals. Natalyx
automates that relay and runs it inside the clinic, so a practice can take the
journey in-house instead of referring patients out — keeping the patients who
trust it and the revenue that leaves with them, without an agency's overhead.

The clinic is the coordinating center and keeps full administrative control.
Natalyx is an extension of the practice, not a parallel service participants
are handed off into.

"In-house" means the **coordination** runs through the clinic's workflow. It
does not mean every service happens inside the clinic, and it does not mean no
outside referral occurs: attorneys, evaluators, doulas, agencies and other
outside providers still take part. Never write copy claiming otherwise.

**What is automated is the relay, never the care.** Copy may say the agency's
manual workflow is fully automated — it names its object. It may never say the
journey, the care, or clinical/legal/eligibility decisions are automated. That
line is what separates the product from a claim we cannot make.

It covers the clinic's surrogacy population broadly, **however a carrier
entered the journey**: already known to the intended parents, or referred by
the clinic itself. No public surface
may narrow the product by journey origin — that qualifier is retired, and the
vocabulary for it belongs only in the acceptance matrix that forbids it.

Natalyx supports clinic-directed carrier discovery and referral workflows. It
is not a direct-to-consumer marketplace: clinics remain responsible for
screening, clinical eligibility and final decisions, and Natalyx does not
automatically rank or select carriers.

Do not restate this as a blanket denial that Natalyx will ever help source or
find carriers - that conflicts with the clinic-led direction. Equally, do not
write copy claiming automated matching exists today. Neither pole is accurate;
the boundary above is.

Capability that does not exist yet is stated as intent — *built to*, *designed
to*, *helps clinics*. "Designed to fit into clinic operations" and "built to
connect with clinic systems as integrations are enabled" are accurate;
"integrated with your EHR" is not, and Natalyx never replaces the EHR.

`docs/acceptance-all-surrogacy-positioning.md` is the authority for what the
copy must mean; `tests/positioning.test.ts` enforces it.

## Team, contact and type

The team section publishes facts about real people, quoted from the clinic
pitch deck: name, title, education, phone, email, all on one founder card. Only the two founders
appear; the rest of the deck's team slide stays off the site, and no commercial
figure from the deck (revenue per case, pricing) reaches a public surface. Add
no credential, employer or advisory relationship the deck does not state.

The founder headshots are served straight from `public/`, deliberately
`unoptimized`: `/_next/image` is a runtime route, and where it is unavailable
every avatar fails to its alt text while the page around it renders fine.

One typeface, site-wide. Headings differ from body copy by size, weight and
colour - never by family. There is no `font-serif`; the token is gone, so the
utility would resolve to nothing.

## The pilot

Natalyx is **looking for** 10 fertility clinics to join a pilot program. That
is a call for clinics, not a roster of them: no clinic has signed up, and no
surface may imply that any has. Recruiting language only - never the
present-tense equivalents that turn the search into a result. The acceptance
matrix (P28) quotes the exact wordings that are forbidden.

The clinic-interest page carries the pilot copy. Registering stays a record of
interest, not an application, and the follow-up promised is a demo.

## Boundaries

- Do not copy app-private workflow details, internal architecture, or internal
  claims into public pages.
- Coordinate product copy/claims with the app + design-system context (root
  workspace `AGENTS.md`); the design system owns the visual language reference.
- Synthetic/marketing content only; no participant data, invite codes, or
  environment details.
- Never claim PHI readiness, clinical validation, deployment, general
  availability, integrations that do not exist, or existing partner clinics -
  the pilot is being recruited, not reported.
- Never claim Natalyx replaces clinic staff, medical judgment, attorneys,
  mental-health evaluators, or other providers. They stay authoritative.

## Map

| Path | Owns |
| --- | --- |
| `src/app/page.tsx` | Landing composition |
| `src/app/layout.tsx` | Shell; composes metadata + JSON-LD from `positioning` |
| `src/lib/positioning.ts` | The site's title/description/social/structured data, defined once |
| `src/app/clinic-interest/` | The one interest page |
| `src/app/api/clinic-interest/route.ts` | Submission endpoint |
| `src/components/landing/` | Landing sections, incl. Team (with founder contact details) |
| `public/team/` | Founder headshots, cropped from the clinic pitch deck |
| `src/components/clinic-interest/` | Form + success state |
| `src/components/ui/` | Design primitives |
| `src/lib/validation.ts` | The single zod schema (client **and** server) |
| `src/lib/leadDelivery.ts` | Lead record + delivery channels |
| `src/lib/rateLimit.ts` | Best-effort endpoint throttle |
| `supabase/migrations/` | Lead-capture schema history |
| `docs/acceptance-clinic-interest.md` | Acceptance matrix for the submission flow |
| `docs/acceptance-all-surrogacy-positioning.md` | Acceptance matrix for what the copy means |

## Submission path

`ClinicInterestForm` → `POST /api/clinic-interest` → `clinicInterestSchema` →
`buildClinicInterestLead` → `deliverClinicInterestLead` (server-side storage)
→ response `forward` → **browser** POSTs it to Web3Forms.

Load-bearing properties — check these before changing anything here:

- **One schema, two sides.** The client and the route parse with the same zod
  object. Do not add a second, hand-rolled client validator.
- **The lead is built from named fields.** A key added to the form cannot reach
  delivery without being added to `buildClinicInterestLead`, and unknown keys
  are stripped by the schema.
- **A failure is never a success — but only the right failure blocks it.**
  Success renders only when Web3Forms accepts the browser's relay. Distinguish
  three cases and do not collapse them:
  - **Optional storage fails** (Supabase down, misconfigured, absent) → the
    route still returns `forward`; the email still goes. Logged, not surfaced.
  - **Web3Forms rejects, or the request fails** → the form shows an error and
    keeps the typed values. This is the only failure that withholds success.
  - **Explicit `LEAD_DELIVERY_MODE=log`** → nothing is forwarded and no email
    is sent. The safe local exception, and the only one.
- **Email delivery is a browser step, and must stay one.** Web3Forms rejects
  server-to-server calls on the free plan (403 "Use our API in client side").
  Never move that call back into the route - it fails in production while
  passing every local test that uses `LEAD_DELIVERY_MODE=log`.
- **The browser relays, it never composes.** The route returns `forward`, the
  exact record it built; the form sends that. A client component must never
  import `leadDelivery` or build a lead itself.
- **Nothing is verified.** Email and phone normalization is formatting only.
  No copy may imply an address or number was checked.
- **Server-side storage is best-effort, and the code must mean it.**
  `deliverClinicInterestLead` never throws; a Supabase failure is logged and the
  route still returns `forward`. Making storage able to fail a submission
  recreates the outage in a new place - an optional dependency taking down the
  primary delivery path. Success is decided by Web3Forms accepting the relay.
- **Log mode is decided by the environment, not by success.** `isLogOnlyMode()`
  gates forwarding, so a failed log write can never fall through to emailing a
  real lead during local testing.

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
