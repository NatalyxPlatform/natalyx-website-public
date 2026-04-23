create table if not exists marketing_private.public_interest_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (
    role in ('intended_parent', 'gestational_surrogate', 'not_sure')
  ),
  name text not null,
  email text not null,
  phone text,
  country text,
  region text,
  journey_stage text check (
    journey_stage is null
    or journey_stage in (
      'just_exploring',
      'already_started',
      'have_clinic_or_lawyer',
      'know_other_party',
      'questions_first',
      'prefer_not_to_say'
    )
  ),
  preferred_contact text check (
    preferred_contact is null
    or preferred_contact in ('email', 'phone', 'either')
  ),
  notes text,
  consent_to_contact boolean not null default true,
  source text not null default 'website',
  user_agent text,
  referrer text,
  constraint public_interest_leads_email_role_key unique (email, role)
);

create index if not exists public_interest_leads_created_at_idx
  on marketing_private.public_interest_leads (created_at desc);

create index if not exists public_interest_leads_role_idx
  on marketing_private.public_interest_leads (role);
