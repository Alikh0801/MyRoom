-- Otel otaq tipləri (Standart, Deluxe və s.)

create table if not exists public.listing_room_types (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  name text not null,
  floor int check (floor is null or floor >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.listing_room_type_amenities (
  room_type_id uuid not null references public.listing_room_types (id) on delete cascade,
  amenity_id uuid not null references public.amenities (id) on delete cascade,
  primary key (room_type_id, amenity_id)
);

create index if not exists listing_room_types_listing_idx
  on public.listing_room_types (listing_id, sort_order);

alter table public.listing_room_types enable row level security;
alter table public.listing_room_type_amenities enable row level security;

create policy "listing_room_types_public_read" on public.listing_room_types
  for select using (true);

create policy "listing_room_types_insert_own" on public.listing_room_types
  for insert with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

create policy "listing_room_type_amenities_public_read" on public.listing_room_type_amenities
  for select using (true);

create policy "listing_room_type_amenities_insert_own" on public.listing_room_type_amenities
  for insert with check (
    exists (
      select 1 from public.listing_room_types rt
      join public.listings l on l.id = rt.listing_id
      where rt.id = room_type_id and l.owner_id = auth.uid()
    )
  );
