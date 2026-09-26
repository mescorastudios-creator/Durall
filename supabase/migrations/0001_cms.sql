-- Durall admin panel: content, media, enquiries and accounts.
--
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to read
-- top to bottom: every table has row-level security switched on, and the
-- public (anon) key can only ever read what the live site shows.
--
-- Who can do what, as enforced here:
--   visitors (anon key)      read published projects/articles, open roles,
--                            visible partners, pages, settings, media
--   signed-in team members   read everything, write content and media
--   nobody via the API       insert enquiries or manage accounts; the
--                            site's server does those with the service key
--
-- Per-section access for editors is checked by the site's server today;
-- enforcing it here too is part of the later security step.

-- ── Accounts ────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor')),
  -- For editors: the admin sections they may open (pages, projects, …).
  sections text[] not null default '{}',
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Exactly one owner, ever.
create unique index profiles_one_owner on public.profiles ((role)) where role = 'owner';

-- Every new login gets a profile. The very first one becomes the owner;
-- everyone after that is created by the owner from the admin panel, starts
-- as an editor with no sections, and is given access there.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    case when exists (select 1 from public.profiles where role = 'owner') then 'editor' else 'owner' end
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and not disabled)
$$;

create function public.is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'owner' and not disabled)
$$;

-- Hands the owner role to another active member in one step, so the site is
-- never left without an owner. Only the current owner can call it.
create function public.transfer_ownership(target uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then
    raise exception 'Only the owner can transfer ownership';
  end if;
  if target = auth.uid() then
    raise exception 'Choose another member';
  end if;
  if not exists (select 1 from public.profiles where id = target and not disabled) then
    raise exception 'That member does not exist or is disabled';
  end if;
  update public.profiles set role = 'admin', updated_at = now() where id = auth.uid();
  update public.profiles set role = 'owner', sections = '{}', updated_at = now() where id = target;
end $$;

-- ── Content ─────────────────────────────────────────────────────────────────
-- Documents are stored whole as JSON (the shapes in src/content/types.ts);
-- the columns beside them are copies of the fields the site filters on.

create table public.settings (
  key text primary key check (key in ('site', 'shared')),
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.pages (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.projects (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  position integer not null default 0,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.articles (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at date,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.career_roles (
  id text primary key default gen_random_uuid()::text,
  position integer not null default 0,
  open boolean not null default true,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.partners (
  id text primary key default gen_random_uuid()::text,
  kind text not null check (kind in ('partner', 'practice')),
  position integer not null default 0,
  visible boolean not null default true,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  -- Folder in the "media" bucket holding this image's sizes.
  path text not null,
  src text not null,
  src_set text,
  width integer not null,
  height integer not null,
  alt text not null default '',
  name text not null default '',
  bytes integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

-- ── Enquiries and the activity log ─────────────────────────────────────────

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'contact' check (source in ('contact', 'home', 'about')),
  name text not null,
  email text not null,
  studio text not null default '',
  project_type text not null default '',
  subject text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  notes text not null default ''
);

create index enquiries_created_at on public.enquiries (created_at desc);

create table public.activity (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  user_id uuid references auth.users (id) on delete set null,
  user_email text not null default '',
  action text not null,
  entity text not null,
  entity_id text not null default '',
  summary text not null default ''
);

create index activity_at on public.activity (at desc);

-- ── Row-level security ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.pages enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.career_roles enable row level security;
alter table public.partners enable row level security;
alter table public.media enable row level security;
alter table public.enquiries enable row level security;
alter table public.activity enable row level security;

-- Profiles: members see the team (names in the activity log); changes to
-- accounts go through the site's server with the service key.
create policy "members read profiles" on public.profiles
  for select to authenticated using (public.is_member());

-- Site-wide content: public to read, members to write.
create policy "anyone reads settings" on public.settings for select using (true);
create policy "members write settings" on public.settings
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "anyone reads pages" on public.pages for select using (true);
create policy "members write pages" on public.pages
  for all to authenticated using (public.is_member()) with check (public.is_member());

-- Collections: visitors see only what is live; members see and edit all.
create policy "anyone reads published projects" on public.projects
  for select using (status = 'published' or public.is_member());
create policy "members write projects" on public.projects
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "anyone reads published articles" on public.articles
  for select using (status = 'published' or public.is_member());
create policy "members write articles" on public.articles
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "anyone reads open roles" on public.career_roles
  for select using (open or public.is_member());
create policy "members write roles" on public.career_roles
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "anyone reads visible partners" on public.partners
  for select using (visible or public.is_member());
create policy "members write partners" on public.partners
  for all to authenticated using (public.is_member()) with check (public.is_member());

create policy "anyone reads media" on public.media for select using (true);
create policy "members write media" on public.media
  for all to authenticated using (public.is_member()) with check (public.is_member());

-- Enquiries: private. Inserted by the site's server (service key) after it
-- has validated the form; members read and triage them.
create policy "members read enquiries" on public.enquiries
  for select to authenticated using (public.is_member());
create policy "members update enquiries" on public.enquiries
  for update to authenticated using (public.is_member()) with check (public.is_member());
create policy "members delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_member());

create policy "members read activity" on public.activity
  for select to authenticated using (public.is_member());
create policy "members log activity" on public.activity
  for insert to authenticated with check (public.is_member() and user_id = auth.uid());

-- ── Image storage ───────────────────────────────────────────────────────────
-- Public to read (the site links to these files), images only, 10 MB each.
-- Uploads arrive through short-lived signed URLs the site's server issues to
-- signed-in members, so no storage write policy is needed for the browser.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;
