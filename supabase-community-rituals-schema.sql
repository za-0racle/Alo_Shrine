-- Community ritual schema for The Circle, communal sagas, shrine notices,
-- Midnight Fire sparks, witnessing events, and libations.
-- Run this after the base profiles, posts, and series schema files.

alter table public.profiles
  add column if not exists libations_received integer default 0 not null,
  add column if not exists role text,
  add column if not exists is_admin boolean default false not null;

alter table public.series
  add column if not exists is_communal boolean default false not null,
  add column if not exists saga_rules text,
  add column if not exists final_category text,
  add column if not exists completed_at timestamp with time zone;

create table if not exists public.sparks (
  id bigserial primary key,
  title text not null,
  description text,
  prompt text,
  starts_at timestamp with time zone default now() not null,
  ends_at timestamp with time zone not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.spark_echoes (
  id bigserial primary key,
  spark_id bigint references public.sparks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.witness_events (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  poetic_message text,
  reference_id text,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.libations (
  id bigserial primary key,
  from_user_id uuid references public.profiles(id) on delete set null,
  to_user_id uuid references public.profiles(id) on delete cascade not null,
  post_id bigint references public.posts(id) on delete set null,
  message text,
  token_count integer default 1 not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.saga_collaborators (
  series_id bigint references public.series(id) on delete cascade not null,
  scribe_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'contributor' not null check (role in ('lead', 'contributor')),
  created_at timestamp with time zone default now() not null,
  primary key (series_id, scribe_id)
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notify_stories boolean default true not null,
  notify_poems boolean default true not null,
  notify_sagas boolean default true not null,
  notify_sparks boolean default true not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.shrine_notifications (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_type text not null,
  title text not null,
  body text,
  reference_id text,
  is_read boolean default false not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now() not null
);

alter table public.sparks enable row level security;
alter table public.spark_echoes enable row level security;
alter table public.witness_events enable row level security;
alter table public.libations enable row level security;
alter table public.saga_collaborators enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.shrine_notifications enable row level security;

drop policy if exists "Sparks are visible to everyone" on public.sparks;
drop policy if exists "Oracles can manage sparks" on public.sparks;
drop policy if exists "Spark echoes are visible to everyone" on public.spark_echoes;
drop policy if exists "Members can offer spark echoes" on public.spark_echoes;
drop policy if exists "Witness events are visible to everyone" on public.witness_events;
drop policy if exists "Members can record witness events" on public.witness_events;
drop policy if exists "Members can pour libations" on public.libations;
drop policy if exists "Members can view their libations" on public.libations;
drop policy if exists "Saga collaborators are visible to everyone" on public.saga_collaborators;
drop policy if exists "Lead scribes can manage saga collaborators" on public.saga_collaborators;

create policy "Sparks are visible to everyone"
on public.sparks for select
using (true);

create policy "Oracles can manage sparks"
on public.sparks for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and (profiles.is_admin is true or lower(coalesce(profiles.role, '')) in ('admin', 'oracle'))
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and (profiles.is_admin is true or lower(coalesce(profiles.role, '')) in ('admin', 'oracle'))
  )
);

create policy "Spark echoes are visible to everyone"
on public.spark_echoes for select
using (true);

create policy "Members can offer spark echoes"
on public.spark_echoes for insert
with check (auth.uid() = user_id);

create policy "Witness events are visible to everyone"
on public.witness_events for select
using (true);

create policy "Members can record witness events"
on public.witness_events for insert
with check (auth.uid() = user_id);

create policy "Members can pour libations"
on public.libations for insert
with check (auth.uid() = from_user_id);

create policy "Members can view their libations"
on public.libations for select
using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Saga collaborators are visible to everyone"
on public.saga_collaborators for select
using (true);

create policy "Lead scribes can manage saga collaborators"
on public.saga_collaborators for all
using (
  exists (
    select 1 from public.series
    where series.id = saga_collaborators.series_id
      and series.author_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.series
    where series.id = saga_collaborators.series_id
      and series.author_id = auth.uid()
  )
);

create table if not exists public.saga_applications (
  id bigserial primary key,
  series_id bigint references public.series(id) on delete cascade not null,
  lead_scribe_id uuid references public.profiles(id) on delete cascade not null,
  applicant_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default now() not null
);

alter table public.saga_applications enable row level security;

drop policy if exists "Saga applications are visible to involved scribes" on public.saga_applications;
drop policy if exists "Scribes can offer saga chapters" on public.saga_applications;
drop policy if exists "Lead scribes can review saga chapters" on public.saga_applications;
drop policy if exists "Lead scribes can publish approved saga chapters" on public.posts;

create policy "Saga applications are visible to involved scribes"
on public.saga_applications for select
using (
  auth.uid() = applicant_id
  or auth.uid() = lead_scribe_id
  or exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and (profiles.is_admin is true or lower(coalesce(profiles.role, '')) in ('admin', 'oracle'))
  )
);

create policy "Scribes can offer saga chapters"
on public.saga_applications for insert
with check (auth.uid() = applicant_id);

create policy "Lead scribes can review saga chapters"
on public.saga_applications for update
using (auth.uid() = lead_scribe_id)
with check (auth.uid() = lead_scribe_id);

create policy "Lead scribes can publish approved saga chapters"
on public.posts for insert
with check (
  exists (
    select 1
    from public.saga_applications
    where saga_applications.series_id = posts.series_id
      and saga_applications.applicant_id = posts.author_id
      and saga_applications.lead_scribe_id = auth.uid()
      and saga_applications.status = 'pending'
  )
);

create or replace function public.notify_saga_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.shrine_notifications (user_id, event_type, title, body, reference_id)
  values (
    new.lead_scribe_id,
    'saga_chapter_offered',
    'A new chapter has been offered for your communal saga',
    coalesce(new.title, 'A chapter awaits your witness'),
    new.series_id::text
  );
  return new;
end;
$$;

drop trigger if exists notify_saga_application on public.saga_applications;
create trigger notify_saga_application
after insert on public.saga_applications
for each row
execute function public.notify_saga_application();

create or replace function public.increment_libations_received()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set libations_received = coalesce(libations_received, 0) + coalesce(new.token_count, 1)
  where id = new.to_user_id;

  return new;
end;
$$;

drop trigger if exists libations_increment_profiles on public.libations;
create trigger libations_increment_profiles
after insert on public.libations
for each row
execute function public.increment_libations_received();

create index if not exists saga_applications_lead_status_idx
  on public.saga_applications (lead_scribe_id, status, created_at desc);

create index if not exists series_communal_idx
  on public.series (is_communal, created_at desc);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notify_stories boolean default true not null,
  notify_poems boolean default true not null,
  notify_sagas boolean default true not null,
  notify_sparks boolean default true not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.shrine_notifications (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_type text not null,
  title text not null,
  body text,
  reference_id text,
  is_read boolean default false not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now() not null
);

alter table public.notification_preferences enable row level security;
alter table public.shrine_notifications enable row level security;

drop policy if exists "Members can manage their notice preferences" on public.notification_preferences;
drop policy if exists "Members can read their own notices" on public.shrine_notifications;
drop policy if exists "Members can mark their own notices" on public.shrine_notifications;

create policy "Members can manage their notice preferences"
on public.notification_preferences for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Members can read their own notices"
on public.shrine_notifications for select
using (auth.uid() = user_id);

create policy "Members can mark their own notices"
on public.shrine_notifications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.notice_all_members(
  notice_event_type text,
  notice_title text,
  notice_body text,
  notice_reference_id text,
  preference_column text,
  actor_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.shrine_notifications (user_id, event_type, title, body, reference_id)
  select profiles.id, notice_event_type, notice_title, notice_body, notice_reference_id
  from public.profiles
  left join public.notification_preferences prefs on prefs.user_id = profiles.id
  where profiles.id <> coalesce(actor_id, '00000000-0000-0000-0000-000000000000'::uuid)
    and case preference_column
      when 'notify_stories' then coalesce(prefs.notify_stories, true)
      when 'notify_poems' then coalesce(prefs.notify_poems, true)
      when 'notify_sagas' then coalesce(prefs.notify_sagas, true)
      when 'notify_sparks' then coalesce(prefs.notify_sparks, true)
      else true
    end;
end;
$$;

create or replace function public.notify_new_offering()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_type text := lower(coalesce(new.type, 'story'));
  is_poem boolean := normalized_type in ('poem', 'poetry');
  is_saga boolean := new.series_id is not null or normalized_type = 'series';
  notice_type text;
  preference_name text;
  notice_title text;
begin
  if new.status <> 'published' then
    return new;
  end if;

  if is_poem then
    notice_type := 'new_poem';
    preference_name := 'notify_poems';
    notice_title := 'A new poem has been offered';
  elsif is_saga then
    notice_type := 'new_saga';
    preference_name := 'notify_sagas';
    notice_title := 'A communal saga has turned a page';
  else
    notice_type := 'new_story';
    preference_name := 'notify_stories';
    notice_title := 'A new story has been offered';
  end if;

  perform public.notice_all_members(
    notice_type,
    notice_title,
    coalesce(new.title, 'Untitled offering'),
    new.id::text,
    preference_name,
    new.author_id
  );

  return new;
end;
$$;

drop trigger if exists notify_post_published on public.posts;
create trigger notify_post_published
after insert on public.posts
for each row
when (new.status = 'published')
execute function public.notify_new_offering();

create or replace function public.notify_new_spark()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notice_all_members(
    'new_spark',
    'The Midnight Fire has been lit',
    coalesce(new.title, 'A new Spark is waiting at the fire.'),
    new.id::text,
    'notify_sparks',
    null
  );

  return new;
end;
$$;

drop trigger if exists notify_spark_lit on public.sparks;
create trigger notify_spark_lit
after insert on public.sparks
for each row
execute function public.notify_new_spark();

create or replace function public.notify_communal_saga_opened()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_communal is true and (tg_op = 'INSERT' or coalesce(old.is_communal, false) is false) then
    perform public.notice_all_members(
      'new_saga',
      'A communal saga has opened',
      coalesce(new.title, 'A saga is calling for many hands.'),
      new.id::text,
      'notify_sagas',
      new.author_id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists notify_communal_saga_opened on public.series;
create trigger notify_communal_saga_opened
after insert or update of is_communal on public.series
for each row
execute function public.notify_communal_saga_opened();

create index if not exists shrine_notifications_user_read_idx
  on public.shrine_notifications (user_id, is_read, created_at desc);
