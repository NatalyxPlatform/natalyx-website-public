# Acceptance matrix — clinic-interest B2B repositioning

Written before implementation. This matrix is the authority: implementation and
tests are judged against it, not the other way round. Every row names the
substrate that establishes it, because evidence is scoped by where it ran.

## Substrates

| Key | Substrate | What it can establish |
| --- | --- | --- |
| `unit` | Vitest, Node environment, module under test imported directly | Schema/normalisation/adapter behaviour |
| `route` | Vitest, real `Request` objects passed to the exported route handler | Server-side validation, honeypot, rate limit, delivered payload shape |
| `dom` | Vitest + jsdom + Testing Library, real React render | Client validation, labels, autocomplete, success/error rendering |
| `source` | Vitest assertions over repository source files | Repo-wide absence of retired acquisition surfaces |
| `browser` | Playwright against the local production build | Real composed stack, layout, keyboard, console, links |

`unit`/`route`/`dom` results never establish `browser` behaviour and vice versa.

## Matrix

| # | Actor | Starting state | Action | Observable (must) | Forbidden (must not) | Substrate |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | Clinic visitor | On `/` at any width | Look for how to register | A CTA reading "Register your clinic's interest" is reachable in hero, mid-page banner and footer | Any CTA offering participant/IP/GC/donor registration | `dom`, `source`, `browser` |
| A2 | Clinic visitor | On `/` | Activate any prominent CTA | Lands on `/clinic-interest` with the clinic form | A second, different registration destination | `source`, `browser` |
| A3 | Clinic visitor | Holds a stale `/signup` link | Request `/signup` | Permanent redirect to `/clinic-interest` | The old participant form still rendering anywhere | `source`, `browser` |
| B1 | Clinic visitor | On `/clinic-interest` | Inspect the form | Exactly four collected fields: clinic name, contact name, work email, phone — all required, all with visible `<label>` elements | Placeholder used as the only label | `dom`, `browser` |
| B2 | Clinic visitor | On `/clinic-interest` | Inspect input semantics | `autocomplete` = `organization`, `name`, `email`, `tel`; `type` = `text`, `text`, `email`, `tel` | Missing/incorrect autocomplete tokens | `dom` |
| B3 | Clinic visitor | Empty form | Submit | Each of the four fields reports its own required error; focus moves to the first invalid field; no network request is made | A submission attempt with empty required fields | `dom` |
| B4 | Clinic visitor | Three valid fields, one blank | Submit | The blank field is refused by name | Submission proceeding with three of four fields | `dom`, `route` |
| B5 | Clinic visitor | Malformed email (`nope`, `a@b`, `a b@c.com`) | Submit | Refused with an email-specific message, client **and** server | Server accepting what the client refused | `dom`, `unit`, `route` |
| B6 | Clinic visitor | Unusable phone (`12`, `abc`, 40 digits) | Submit | Refused with a phone-specific message, client **and** server | A claim that the number was verified or reachable | `dom`, `unit`, `route` |
| C1 | Server | Any submission | Inspect the delivered payload | Payload keys are exactly `clinic_name`, `contact_name`, `work_email`, `phone`, `phone_normalized`, `consent_to_contact`, `lead_type`, `schema_version`, `source` (+ server-derived `user_agent`, `referrer`) | Any of `role`, `role_value`, `intended_parent`, `gestational_surrogate`, `donor`, `not_sure`, `journey_stage`, `preferred_contact`, `notes`, `country`, `region` | `route`, `unit` |
| C2 | Server | Client sends extra `role` field | Submit | The extra key is stripped and never reaches delivery | A role value being stored or forwarded | `route` |
| C3 | Server | Any submission | Inspect the form and payload | No field requests patient, case, health, medical, legal or financial information | A free-text field inviting case detail | `source`, `route`, `dom` |
| C4 | Server | Honeypot field filled | Submit | Request is accepted-looking to the bot but nothing is delivered | Delivering a honeypot-flagged lead | `route` |
| C5 | Server | Rate limit exceeded for a client IP | Submit again | HTTP 429 and no delivery | Unlimited relaying to the delivery provider | `route` |
| C6 | Server | `SUPABASE_*` set | Submit | Row inserted into `marketing_private.clinic_interest_leads` | Any write to `marketing_private.public_interest_leads` | `unit`, `route` |
| C7 | Server | No delivery channel configured | Submit | HTTP 500 and an error response | A success response with nothing delivered | `route` |
| D1 | Clinic visitor | Valid submission, delivery succeeds | Submit | Success state confirms the request was **received** | Echoing the submitted email/phone/clinic name back; promising acceptance, onboarding, partnership, or a response time | `dom`, `route` |
| D2 | Clinic visitor | Valid submission, delivery fails (500/network) | Submit | An error state and the form still present with values intact | Any success state rendering after a failed submission | `dom` |
| E1 | Any reader | Whole repo | Search acquisition surfaces | No "Register interest" / "Join as…" / role-selection CTA copy remains on acquisition surfaces; no `?role=` links | Retired acquisition copy surviving in metadata, OG tags, or nav | `source` |
| E2 | Any reader | Whole repo | Search educational copy | Intended parents and gestational carriers are still described where the copy explains the journey to clinics | Deleting participant vocabulary from educational context | `source` |
| E3 | Any reader | Page metadata | Read title/description/OG/Twitter | Describe clinic-facing coordination infrastructure | "online fertility agency", "ART marketplace", participant waitlist framing | `source`, `browser` |
| E4 | Any reader | Whole repo | Read claims | No claim of PHI-readiness, clinical validation, deployment, general availability, live integrations, or existing partner clinics | Any such claim without repository evidence | `source` |
| F1 | Keyboard user | On `/clinic-interest` | Tab through | Every control reachable, visible focus ring on each | A focus trap or invisible focus | `browser` |
| F2 | Any visitor | 390 / 768 / 1440 px | Load `/` and `/clinic-interest` | No horizontal overflow; no duplicate element IDs; no console errors | Layout overflow or duplicate IDs | `browser` |

## Deliberately out of scope

- Verifying that an email address or phone number is real or owned by the
  submitter. Normalisation is formatting only, and no copy may imply otherwise.
- Any analytics vendor integration: none exists in this repository, so there is
  no event stream to rename. The lead payload's own `source`/`lead_type`
  labels are the routing signal that changes.
