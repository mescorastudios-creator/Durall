-- The home page's enquiry form also asks for a phone number and the
-- project's location. Safe to run more than once.
--
-- Until this runs, those two arrive at the top of the enquiry's message
-- instead (see src/content/enquiry.ts), so nothing is lost either way.

alter table public.enquiries
  add column if not exists phone text not null default '',
  add column if not exists location text not null default '';

-- Let the API see the new columns straight away.
notify pgrst, 'reload schema';
