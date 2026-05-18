create table if not exists public.series (
  id bigserial primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  cover_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts
  add column if not exists series_id bigint references public.series(id) on delete set null,
  add column if not exists series_order integer;

alter table public.series enable row level security;

drop policy if exists "Series are viewable by everyone" on public.series;
drop policy if exists "Writers can create their own series" on public.series;
drop policy if exists "Writers can update their own series" on public.series;

create policy "Series are viewable by everyone"
on public.series for select
using (true);

create policy "Writers can create their own series"
on public.series for insert
with check (auth.uid() = author_id);

create policy "Writers can update their own series"
on public.series for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create index if not exists posts_series_lookup_idx
  on public.posts (series_id, series_order)
  where series_id is not null;

create index if not exists series_author_title_idx
  on public.series (author_id, lower(title));
