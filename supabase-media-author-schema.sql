alter table public.media
  add column if not exists author_id uuid references public.profiles(id) on delete set null;

create index if not exists media_author_created_idx
  on public.media (author_id, created_at desc);
