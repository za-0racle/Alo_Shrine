alter table public.profiles
add column if not exists pen_name text,
add column if not exists display_name_mode text default 'full_name',
add column if not exists public_show_avatar boolean default true,
add column if not exists public_show_bio boolean default true,
add column if not exists public_show_level boolean default true;

update public.profiles
set display_name_mode = coalesce(display_name_mode, 'full_name'),
    public_show_avatar = coalesce(public_show_avatar, true),
    public_show_bio = coalesce(public_show_bio, true),
    public_show_level = coalesce(public_show_level, true);
