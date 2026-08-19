-- Clinic-interest leads from the public website.
--
-- These are deliberately NOT stored in marketing_private.public_interest_leads.
-- That table holds the historical participant submissions (intended parent,
-- gestational surrogate, donor, not_sure) captured by the retired /signup flow.
-- Those rows are left exactly as they are: not migrated, not rewritten, and not
-- reinterpreted as clinic submissions.
--
-- The two populations are distinguished by living in separate tables. That is
-- the whole mechanism. This table additionally stamps lead_type on every row;
-- the historical table has no such column and is not being altered to add one,
-- so a union of the two must supply the discriminator for the older rows.
--
-- Submissions here are append-only: every submission is a row. A clinic that
-- resubmits with a corrected phone number, or one address registering more than
-- one clinic, must not be silently discarded while the site reports success.
-- De-duplication is a downstream concern, applied by whoever reads these leads.

create table if not exists marketing_private.clinic_interest_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  lead_type text not null default 'clinic_interest'
    check (lead_type = 'clinic_interest'),
  schema_version integer not null default 1,

  clinic_name text not null,
  contact_name text not null,
  -- Stored already lower-cased by the application. Deliberately NOT unique:
  -- see the append-only note above.
  work_email text not null,
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

create index if not exists clinic_interest_leads_work_email_idx
  on marketing_private.clinic_interest_leads (work_email);

comment on table marketing_private.clinic_interest_leads is
  'Clinic-interest registrations from the public marketing site. No PHI, no patient or case data.';

comment on column marketing_private.clinic_interest_leads.phone_normalized is
  'Digits (and a leading + when supplied). Formatting only - ownership is not verified.';

comment on column marketing_private.clinic_interest_leads.work_email is
  'Lower-cased by the application. Not unique - submissions are append-only.';

-- Document the retired table in place. No data or constraint changes: the
-- historical participant leads must survive the repositioning untouched.
-- NOTE: this comment records intent. Nothing in the database prevents writes to
-- the table; the guarantee is that this website no longer writes to it. If the
-- table must actually be immutable, that needs a privilege revoke or a rule,
-- which is deliberately out of scope for a marketing-site migration.
comment on table marketing_private.public_interest_leads is
  'HISTORICAL. Participant interest submissions (intended parent / gestational surrogate / donor / not sure) captured by the retired public /signup flow. No longer written by the website (not enforced in the database). New clinic-interest leads go to clinic_interest_leads.';
