-- Clinic-interest leads from the public website.
--
-- These are deliberately NOT stored in marketing_private.public_interest_leads.
-- That table holds the historical participant submissions (intended parent,
-- gestational surrogate, donor, not_sure) captured by the retired /signup flow.
-- Those rows are left exactly as they are: not migrated, not rewritten, and not
-- reinterpreted as clinic submissions. Both tables carry an explicit lead_type
-- so the two populations stay distinguishable if they are ever read together.

create table if not exists marketing_private.clinic_interest_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  lead_type text not null default 'clinic_interest'
    check (lead_type = 'clinic_interest'),
  schema_version integer not null default 1,

  clinic_name text not null,
  contact_name text not null,
  -- Stored already lower-cased by the application. Uniqueness makes a repeated
  -- submission idempotent rather than creating duplicate leads.
  work_email text not null unique,
  phone text not null,
  -- Formatting-only normalization. Not a verified or reachable number.
  phone_normalized text not null,

  consent_to_contact boolean not null default true,
  source text not null default 'website_clinic_interest',
  user_agent text,
  referrer text
);

create index if not exists clinic_interest_leads_created_at_idx
  on marketing_private.clinic_interest_leads (created_at desc);

comment on table marketing_private.clinic_interest_leads is
  'Clinic-interest registrations from the public marketing site. No PHI, no patient or case data.';

comment on column marketing_private.clinic_interest_leads.phone_normalized is
  'Digits (and a leading + when supplied). Formatting only - ownership is not verified.';

-- Document the retired table in place. No data or constraint changes: the
-- historical participant leads must survive the repositioning untouched.
comment on table marketing_private.public_interest_leads is
  'HISTORICAL. Participant interest submissions (intended parent / gestational surrogate / donor / not sure) captured by the retired public /signup flow. Read-only: no longer written by the website. New clinic-interest leads go to clinic_interest_leads.';
