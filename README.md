# Natalyx Public Website

Public Next.js website for Natalyx.

This repo owns the marketing and interest-capture surface only. It should frame
Natalyx as assisted-reproduction journey management: known-surrogate gestational
surrogacy is the first proof case, and the broader product direction is guided
ART journey coordination, shared case context, clinic-first provider handoffs,
and privacy-first human-reviewed operations.

## Boundaries

- Do not position Natalyx as a generic surrogacy matching marketplace or as an
  online agency that owns clinical, legal, escrow, payment, eligibility, or
  final matching decisions.
- Public forms must stay lead-capture oriented. Do not request PHI, detailed
  medical facts, legal documents, financial records, or sensitive participant
  case data from this site.
- Gestational carriers should be described as shared-journey participants, not
  supply inventory.
- AI references, if added, should describe coordination, education, context,
  and handoff support. Do not imply final clinical, legal, insurance, payment,
  eligibility, or matching authority.
- Server-side Supabase credentials belong only in server/runtime environment
  configuration. Never commit service-role keys or live lead data.

## Local Development

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run build
npm run lint
```

## Repo Ownership

- `src/app` owns Next.js pages and metadata.
- `src/components/landing` owns public landing-page sections.
- `src/app/signup` and `src/components/signup` own the public interest form.
- `supabase/migrations` owns the public lead-capture schema history.

Production participant journey, case context, provider handoffs, PHI handling,
and app-service integration belong in `natalyx-app`, `natalyx-intelligence`, and
`natalyx-infra`, not in this public website repo.
