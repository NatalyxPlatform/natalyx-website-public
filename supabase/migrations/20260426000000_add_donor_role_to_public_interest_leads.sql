alter table marketing_private.public_interest_leads
  drop constraint if exists public_interest_leads_role_check;

alter table marketing_private.public_interest_leads
  add constraint public_interest_leads_role_check check (
    role in ('intended_parent', 'gestational_surrogate', 'donor', 'not_sure')
  );
