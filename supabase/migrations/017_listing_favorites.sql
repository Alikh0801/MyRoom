-- İstifadəçi sevimli elanları

create table public.listing_favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index listing_favorites_user_idx
  on public.listing_favorites (user_id, created_at desc);

alter table public.listing_favorites enable row level security;

create policy "listing_favorites_select_own" on public.listing_favorites
  for select using (auth.uid() = user_id);

create policy "listing_favorites_insert_own" on public.listing_favorites
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'approved'
    )
  );

create policy "listing_favorites_delete_own" on public.listing_favorites
  for delete using (auth.uid() = user_id);
