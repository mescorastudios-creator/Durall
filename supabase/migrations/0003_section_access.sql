-- Durall admin panel: editors' section access, enforced by the database too.
--
-- Run once in the Supabase SQL editor, after 0001_cms.sql and
-- 0002_enquiry_phone_location.sql. Safe to run again.
--
-- 0001 let any active team member read and write every table, and only the
-- site's server kept an editor to the sections the owner ticked. With these
-- policies the database keeps them there as well, so a member's own login
-- token cannot reach past what the admin panel allows:
--
--   pages, shared sections                      -> "pages"
--   projects, articles, roles, partners         -> their own section,
--     including drafts, closed roles and hidden partners
--   site settings                               -> each part by its section
--   image records                               -> "media"
--   enquiries                                   -> "enquiries"
--   activity log                                -> owner and admins see all,
--                                                  editors their own
--
-- The owner and admins pass every check. What visitors can read is unchanged.

-- ── Helpers ─────────────────────────────────────────────────────────────────

-- May the signed-in member work in this admin section?
create or replace function public.can_access(section text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and not disabled
      and (role in ('owner', 'admin') or section = any (sections))
  )
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and not disabled and role in ('owner', 'admin')
  )
$$;

create or replace function public.my_email() returns text
language sql stable security definer set search_path = public as $$
  select email from public.profiles where id = auth.uid()
$$;

-- ── Settings ────────────────────────────────────────────────────────────────
-- The "site" row holds three sections' parts (navigation, company, site
-- settings), so the policy lets in anyone with one of them and the trigger
-- below checks each part that actually changed.

drop policy if exists "members write settings" on public.settings;
drop policy if exists "sections add settings" on public.settings;
drop policy if exists "sections change settings" on public.settings;
drop policy if exists "admins remove settings" on public.settings;

create policy "sections add settings" on public.settings
  for insert to authenticated
  with check (
    case key
      when 'shared' then public.can_access('pages')
      else public.can_access('navigation') or public.can_access('company') or public.can_access('settings')
    end
  );

create policy "sections change settings" on public.settings
  for update to authenticated
  using (
    case key
      when 'shared' then public.can_access('pages')
      else public.can_access('navigation') or public.can_access('company') or public.can_access('settings')
    end
  )
  with check (
    case key
      when 'shared' then public.can_access('pages')
      else public.can_access('navigation') or public.can_access('company') or public.can_access('settings')
    end
  );

-- Removing a row puts the whole site back on its bundled content.
create policy "admins remove settings" on public.settings
  for delete to authenticated using (public.is_admin());

create or replace function public.check_settings_parts() returns trigger
language plpgsql set search_path = public as $$
declare
  part record;
begin
  -- The site's server, using the service key, has already checked the
  -- saver's sections; this guards members' own logins.
  if auth.uid() is null or new.key <> 'site' then
    return new;
  end if;
  -- An upsert fires the insert trigger first even when the row exists;
  -- the update trigger that follows compares the parts.
  if tg_op = 'INSERT' and exists (select 1 from public.settings where key = new.key) then
    return new;
  end if;
  for part in
    select * from (values
      ('header', 'navigation'), ('footer', 'navigation'),
      ('company', 'company'), ('contact', 'company'), ('office', 'company'),
      ('seo', 'settings'), ('behaviour', 'settings'), ('notFound', 'settings')
    ) as p (name, section)
  loop
    if (tg_op = 'INSERT' or new.content -> part.name is distinct from old.content -> part.name)
      and not public.can_access(part.section) then
      raise exception 'This account cannot change the % settings', part.name
        using errcode = '42501';
    end if;
  end loop;
  return new;
end $$;

drop trigger if exists settings_parts_by_section on public.settings;
create trigger settings_parts_by_section
  before insert or update on public.settings
  for each row execute function public.check_settings_parts();

-- ── Pages ───────────────────────────────────────────────────────────────────

drop policy if exists "members write pages" on public.pages;
drop policy if exists "section writes pages" on public.pages;
create policy "section writes pages" on public.pages
  for all to authenticated
  using (public.can_access('pages')) with check (public.can_access('pages'));

-- ── Collections ─────────────────────────────────────────────────────────────

drop policy if exists "anyone reads published projects" on public.projects;
drop policy if exists "members write projects" on public.projects;
drop policy if exists "section writes projects" on public.projects;
create policy "anyone reads published projects" on public.projects
  for select using (status = 'published' or public.can_access('projects'));
create policy "section writes projects" on public.projects
  for all to authenticated
  using (public.can_access('projects')) with check (public.can_access('projects'));

drop policy if exists "anyone reads published articles" on public.articles;
drop policy if exists "members write articles" on public.articles;
drop policy if exists "section writes articles" on public.articles;
create policy "anyone reads published articles" on public.articles
  for select using (status = 'published' or public.can_access('insights'));
create policy "section writes articles" on public.articles
  for all to authenticated
  using (public.can_access('insights')) with check (public.can_access('insights'));

drop policy if exists "anyone reads open roles" on public.career_roles;
drop policy if exists "members write roles" on public.career_roles;
drop policy if exists "section writes roles" on public.career_roles;
create policy "anyone reads open roles" on public.career_roles
  for select using (open or public.can_access('careers'));
create policy "section writes roles" on public.career_roles
  for all to authenticated
  using (public.can_access('careers')) with check (public.can_access('careers'));

drop policy if exists "anyone reads visible partners" on public.partners;
drop policy if exists "members write partners" on public.partners;
drop policy if exists "section writes partners" on public.partners;
create policy "anyone reads visible partners" on public.partners
  for select using (visible or public.can_access('partners'));
create policy "section writes partners" on public.partners
  for all to authenticated
  using (public.can_access('partners')) with check (public.can_access('partners'));

-- ── Images ──────────────────────────────────────────────────────────────────

drop policy if exists "members write media" on public.media;
drop policy if exists "section writes media" on public.media;
create policy "section writes media" on public.media
  for all to authenticated
  using (public.can_access('media')) with check (public.can_access('media'));

-- ── Enquiries ───────────────────────────────────────────────────────────────

drop policy if exists "members read enquiries" on public.enquiries;
drop policy if exists "members update enquiries" on public.enquiries;
drop policy if exists "members delete enquiries" on public.enquiries;
drop policy if exists "section reads enquiries" on public.enquiries;
drop policy if exists "section updates enquiries" on public.enquiries;
drop policy if exists "section deletes enquiries" on public.enquiries;
create policy "section reads enquiries" on public.enquiries
  for select to authenticated using (public.can_access('enquiries'));
create policy "section updates enquiries" on public.enquiries
  for update to authenticated
  using (public.can_access('enquiries')) with check (public.can_access('enquiries'));
create policy "section deletes enquiries" on public.enquiries
  for delete to authenticated using (public.can_access('enquiries'));

-- ── Activity log ────────────────────────────────────────────────────────────
-- Entries name teammates and invited addresses: the whole log is for the
-- owner and admins. Each entry is written as its author, under their own
-- email.

drop policy if exists "members read activity" on public.activity;
drop policy if exists "members log activity" on public.activity;
drop policy if exists "admins read activity" on public.activity;
create policy "admins read activity" on public.activity
  for select to authenticated
  using (public.is_admin() or (public.is_member() and user_id = auth.uid()));
create policy "members log activity" on public.activity
  for insert to authenticated
  with check (public.is_member() and user_id = auth.uid() and user_email = public.my_email());
