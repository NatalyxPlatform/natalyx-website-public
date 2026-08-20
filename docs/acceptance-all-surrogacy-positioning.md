# Acceptance matrix — clinic-first positioning for all surrogacy journeys

Written before implementation. This matrix is the authority for **what the
public site means**; `acceptance-clinic-interest.md` remains the authority for
**how the clinic-interest submission behaves**. Where they touch the same
surface, this document governs the message and that one governs the mechanism.

The specification outranks the copy that exists today. Every row names the
substrate that establishes it, because evidence is scoped by where it ran.

## Substrates

Same keys as `acceptance-clinic-interest.md`: `unit`, `route`, `dom`, `source`,
`browser`. A `source` result never establishes `browser` behaviour, and a
`browser` walkthrough never establishes that a string is absent repo-wide.

## The position being asserted

What a surrogacy agency does, day to day, is run a manual relay between the
intended parents, the carrier, clinic staff and a string of outside
professionals. Natalyx automates that relay and runs it inside the fertility
clinic, so a practice can take the surrogacy journey in-house instead of
referring patients out - keeping the patients who already trust it, and the
revenue that leaves with them, without an agency's worth of overhead.

The clinic remains the coordinating center and keeps full administrative
control. Participants and providers experience a clinic-led journey rather than
being handed to an intermediary.

**What is automated is the relay, never the care.** The distinction is
load-bearing: automating an agency's manual coordination is the product;
automating clinical, legal or eligibility judgment is a claim this repository
must never make. Copy may say the agency workflow is fully automated, because
it names its object. It may not say the journey, the care, or the decisions
are.

Three claims sit underneath that, and every row below defends one of them:

1. **Scope.** Natalyx supports the clinic's surrogacy population broadly. How a
   carrier entered the journey — already known to the intended parents,
   referred through an agency, or another path the clinic approves — does not
   determine whether Natalyx applies.
2. **Centre of gravity.** The clinic owns and directs the workflow; Natalyx is
   an extension of the clinic's operation, not a parallel service.
3. **Honesty.** Everything forward-looking is stated as *built to* / *designed
   to*. No completed integration, adoption, deployment or readiness is claimed.

## What this repositioning is *not*

Natalyx does not recruit, source, screen, rank, match or supply gestational
carriers, and does not become a consumer marketplace by widening its scope.
Broader scope means "the clinic's whole surrogacy population", never "we find
you a surrogate". Participant language stays respectful: carriers are people in
a journey, never capacity, inventory or supply.

## Matrix

| # | Actor | Starting state | Action | Observable (must) | Forbidden (must not) | Surface | Substrate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | Clinic visitor | On `/` | Read the hero | The headline commits to running *every* surrogacy journey through one clinic-led workflow | A headline scoped to known-surrogate / BYOS / bring-your-own cases | `src/components/landing/Hero.tsx` | `source`, `browser` |
| P2 | Clinic visitor | On `/` | Read the hero support copy | The coordination areas are named - preparation, handoffs, records, appointments, shared journey context - with the clinic keeping full administrative control, and the automation claim scoped to the agency's manual workflow | Framing the offer as finding, matching or vetting a carrier; automation stated without naming what is automated | `src/components/landing/Hero.tsx` | `source`, `browser` |
| P3 | Clinic visitor | On `/` | Read the problem section | The journey-origin explanation appears: known to the intended parents, agency-referred, or another clinic-approved path — all land as the clinic's operational work | "there is no agency in the middle" as the *reason* Natalyx exists | `src/components/landing/WhyNatalyx.tsx` | `source`, `browser` |
| P4 | Clinic visitor | On `/` | Read the mission section | The agency's manual relay is named as the thing being automated; the point is stated as running the journey in-house instead of referring out, with less overhead; the clinic keeps administrative control; relay work stays distinct from clinical work | Any wedge framing; positioning the product as somewhere for the clinic to go and work ("another portal to run") | `src/components/landing/ValueCards.tsx` | `source`, `browser` |
| P4b | Any reader | Landing copy | Read the clinic-systems claim | Forward-looking wording appears somewhere in the landing copy (it lives in the FAQ, not the mission card) | Requiring one named component to carry it, which pins the guard to a draft rather than the requirement | `src/components/landing/**` | `source` |
| P5 | Clinic visitor | On `/` | Read how-it-works | The five coordination areas stay visible: shared journey context, participant preparation, provider handoffs, records and appointments, clinic-branded participant contact | A step implying Natalyx makes clinical, legal or eligibility decisions | `src/components/landing/HowItWorks.tsx` | `source`, `browser` |
| P6 | Clinic visitor | On `/` | Open the FAQ | A question answers *which* journeys are supported, with "all of the ones your clinic runs" | A "what is a known-surrogate journey?" entry framing the product's limit | `src/components/landing/FAQ.tsx` | `source`, `browser` |
| P7 | Clinic visitor | On `/` | Open the FAQ | An explicit answer that Natalyx does not source, screen, rank or match carriers and is not a consumer marketplace | Silence on matching, leaving the widened scope ambiguous | `src/components/landing/FAQ.tsx` | `source`, `browser` |
| P8 | Clinic visitor | On `/` | Open the FAQ | An answer on clinic systems using forward-looking wording only, plus an explicit statement that Natalyx does not replace the EHR | "fully integrated with your EHR", or any completed/universal integration claim | `src/components/landing/FAQ.tsx` | `source`, `browser` |
| P9 | Any reader | Whole repo | Search for wedge vocabulary | Zero occurrences of `BYOS`, `bring your own surrogate`, `known surrogate`, `known carrier`, `already found your surrogate` in `src/**`, `README.md`, `AGENTS.md` and the docs set | The limitation surviving in a comment, a doc, or a collapsed/hidden element | repo-wide | `source` |
| P10 | Any reader | Whole repo | Search for marketplace vocabulary | No sentence positions Natalyx *as* a marketplace, matching service or agency; negations ("is not a marketplace") are permitted and expected | An affirmative marketplace/matching/agency identity claim | repo-wide | `source` |
| P11 | Any reader | Landing + metadata | Read the clinic-centre claim | Every landing section and the site metadata name the clinic; clinic-led / coordinating-centre vocabulary is present in hero, metadata and at least the problem and mission sections | Copy that could equally address a consumer audience | `src/components/landing/**`, `src/lib/positioning.ts` | `source`, `browser` |
| P12 | Search engine / social scraper | Fetches `/` | Read title, description, OG, Twitter | All three titles name the clinic; descriptions describe clinic-led coordination of surrogacy journeys without an origin qualifier | Metadata still describing known-surrogate journeys after the visible copy changed | `src/app/layout.tsx`, `src/lib/positioning.ts` | `source`, `unit`, `browser` |
| P13 | Search engine | Fetches `/` | Read structured data | JSON-LD is present, parses, uses `Organization` + `WebSite` + `SoftwareApplication` shapes, names fertility clinics as the audience, and carries the same description as the visible metadata | Structured data asserting adoption, ratings, offers, or a positioning the page does not show | `src/app/layout.tsx`, `src/lib/positioning.ts` | `source`, `unit`, `browser` |
| P14 | Any reader | Metadata definitions | Look for duplicated strings | The site title/description/social/JSON-LD text has exactly one definition, in `src/lib/positioning.ts`, consumed by `layout.tsx` | The same description literal repeated across metadata, OG, Twitter and JSON-LD | `src/lib/positioning.ts` | `source`, `unit` |
| P15 | Clinic visitor | On `/clinic-interest` | Read page metadata and intro | Clinic-led coordination of surrogacy journeys, no origin qualifier | "coordination layer for known-surrogate journeys" | `src/app/clinic-interest/page.tsx` | `source`, `browser` |
| P16 | Clinic visitor | Any page | Read nav and footer | Nav and footer address clinics only; the footer tagline describes running surrogacy journeys through the clinic's own workflow | A participant-facing destination in nav or footer | `src/components/layout/**` | `source`, `browser` |
| P17 | Any reader | Whole repo | Search for participant acquisition | No surrogate, intended-parent or donor interest registration is offered anywhere | A second interest form, a role selector, or a `?role=` link returning | repo-wide | `source`, `browser` |
| P18 | Clinic visitor | On `/clinic-interest` | Fill the form | Exactly five required inputs — clinic name, contact name, work email, phone, consent — and `lead_type` is clinic-only | A field added or removed by the repositioning | `src/lib/validation.ts`, form | `dom`, `route`, `unit` |
| P19 | Server | Stale `/signup?role=…` link, or a `Referer` carrying one | Request / submit | The retired identifier survives in neither the redirect destination, the stored lead, nor the forwarded payload | A retired role reaching storage through URL, query or header | middleware, route | `source`, `route`, `unit` |
| P20 | Any reader | Whole repo | Read claims | No claim of existing clinic customers, partnerships, production EHR integration, guaranteed automation, EHR replacement, clinical decision-making, matching/recruiting/supplying carriers, PHI readiness, real participant use, or legal/medical/eligibility decisions | Any such claim without repository evidence | repo-wide | `source` |
| P21 | Any reader | Marketing copy | Read tense | Forward-looking capability is stated as *built to* / *designed to* / *helps clinics* | "clinics use", "used by clinics", "our clinics", "trusted by" | repo-wide | `source` |
| P22 | Any reader | Participant vocabulary | Read the copy | Intended parents and gestational carriers are named respectfully as people in a journey | Carriers described as capacity, supply, inventory, or a resource to allocate | repo-wide | `source` |
| P23 | Clinic visitor | On `/clinic-interest` | Read the consent block | The inline data-use disclosure is unchanged: what is stored, why, and that processors handle it | The repositioning quietly dropping the disclosure | form | `dom`, `source` |
| P24 | Any reader | Governing docs | Read `AGENTS.md` / `README.md` | Both describe the clinic-first, all-journeys position as the intended state | A doc still instructing future work to keep the BYOS wedge | `AGENTS.md`, `README.md` | `source` |
| P25 | Any visitor | 320 / 390 / 768 / 1440 px | Load `/` and `/clinic-interest` | New copy fits: no horizontal overflow, no console errors, keyboard reachable with visible focus | Layout regressions introduced by longer headlines | rendered site | `browser` |

## Team, contact and typography

Added after the positioning rows, from the clinic pitch deck's team and contact
slides. These publish facts about real people, so the risk is not tone: it is
publishing something the deck does not say, or publishing someone who was
deliberately left off. Guarded by `tests/team-and-contact.test.ts` and
`tests/typography.test.ts`.

| # | Actor | Starting state | Action | Observable (must) | Forbidden (must not) | Surface | Substrate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Clinic visitor | On `/` | Read the team section | Exactly two cards — Allen Cioaca (Founder/CEO) and Luke Rhodes (Co-Founder/CTO) — each with the education line quoted verbatim from the deck | Any other person from the deck's team slide appearing anywhere on the site | `src/components/landing/Team.tsx` | `source`, `browser` |
| T2 | Clinic visitor | On `/` | Look at a card | A committed headshot from the deck, rendered circular, with a descriptive `alt` naming the person and title, served **without** the image optimizer and sized to be served raw | A placeholder, an initials monogram, an empty `alt`, a photo attributed to the wrong person, or a `/_next/image` dependency that fails to alt text wherever that route is unavailable | `public/team/`, `Team.tsx` | `source`, `browser` |
| T3 | Clinic visitor | On `/` | Read a founder card | Both founders' phone and email exactly as the deck writes them, as `mailto:`/`tel:` links, with each `tel:` dialling the number displayed, and the keep-case-information-out line beside them | A `tel:` href whose digits differ from the visible number; contact details as unlinked text; the disclosure lost when the standalone section merged in | `src/components/landing/Team.tsx` | `source`, `browser` |
| T4 | Any reader | Whole repo | Search for commercial figures | No revenue-per-case figure, currency amount, price point or pricing section anywhere | The deck's `~$40K/case` reaching a public surface | repo-wide | `source` |
| T5 | Clinic visitor | Any width | Reach the section | Team is composed into `/`, carries `id="team"`, is linked from the footer, and every footer anchor resolves to a real section | A footer link to `#contact` surviving the merge and scrolling nowhere | `page.tsx`, `Footer.tsx` | `source`, `browser` |
| T6 | Any reader | Team copy | Read the claims | Only what the deck states | Added employers, advisory relationships, or clinical credentials (`Dr.`, `MD`, `PhD`, "physician") the deck does not give | `Team.tsx` | `source` |
| T7 | Any visitor | Any page | Read headings and body copy | One typeface site-wide; headings differ from body copy by size, weight and colour only | A second font family in the theme, a `font-serif` utility, or a heading with no size/weight distinction | `globals.css`, all components | `source`, `browser` |

Contact details live in the founder cards themselves; the standalone contact
section was merged into them. The instruction to keep patient, medical, legal
and case information out of those channels moved with them — the same boundary
the interest form states, applied to the direct channels the cards open.

## Rows discharged by tests that already exist

P17, P18, P19 and P23 are not new obligations — they are the properties the
clinic-interest work already established, restated here so the repositioning
cannot quietly break them. They stay proved by
`tests/api-clinic-interest.test.ts`, `tests/clinic-interest-form.test.tsx`,
`tests/validation.test.ts`, `tests/leadDelivery.test.ts` and
`tests/acquisition-surfaces.test.ts`. New tests must not duplicate those
assertions; they must fail if those files are weakened.

## Guard non-vacuousness

Every absence guard in `tests/positioning.test.ts` is paired with a presence
guard on the same surface, so deleting the copy fails the suite as loudly as
restoring the old copy does. After the candidate is committed, representative
guards are mutation-tested by reintroducing stale wording and confirming the
named test fails for the intended reason.

## Established elsewhere, not by this matrix

- **Real delivery.** Unchanged from `acceptance-clinic-interest.md`: local
  green never establishes that Web3Forms delivery works in production.
- **Whether the position is commercially right.** This matrix establishes that
  the site says one thing consistently and truthfully, not that the strategy is
  correct.
- **Actual clinic-system integration.** Nothing here builds or tests an
  integration; the rows only constrain how integration is *described*.

## Deliberately out of scope

- Redesigning the visual system. Components, responsive behaviour and the
  design-system usage stay as they are; only content and its single source of
  definition move.
- The historical `marketing_private.public_interest_leads` table and the
  migrations that describe it. They are historical technical records that
  cannot reach a public surface, and stay untouched.
