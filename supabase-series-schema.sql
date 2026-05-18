alter table public.posts
  add column if not exists story_format text not null default 'standalone',
  add column if not exists series_title text,
  add column if not exists episode_title text,
  add column if not exists episode_number integer,
  add column if not exists release_cadence text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_story_format_check'
  ) then
    alter table public.posts
      add constraint posts_story_format_check
      check (story_format in ('standalone', 'series'))
      not valid;
  end if;
end $$;

alter table public.posts
  validate constraint posts_story_format_check;

create index if not exists posts_series_lookup_idx
  on public.posts (series_title, episode_number)
  where story_format = 'series';
