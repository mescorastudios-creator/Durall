-- The enquiry band ("Let's frame the view.") asks for a phone number and
-- the project's location, and also sits on the Partners and Expertise
-- pages. Safe to run more than once.
--
-- Until this runs, whatever the table cannot hold arrives at the top of the
-- enquiry's message instead (see src/content/enquiry.ts), so nothing is
-- lost either way.

alter table public.enquiries
  add column if not exists phone text not null default '',
  add column if not exists location text not null default '';

alter table public.enquiries drop constraint if exists enquiries_source_check;
alter table public.enquiries add constraint enquiries_source_check
  check (source in ('contact', 'home', 'about', 'partners', 'expertise'));

-- Let the API see the new columns straight away.
notify pgrst, 'reload schema';
