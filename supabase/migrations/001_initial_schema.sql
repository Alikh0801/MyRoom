-- MyRoom: ilkin verilənlər bazası sxemi

-- Kateqoriyalar
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_az text not null,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Amenities (Daxildir)
create table public.amenity_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_az text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_az text not null,
  category_id uuid not null references public.amenity_categories (id),
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- İstifadəçi profilləri (auth.users genişləndirməsi)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  whatsapp_phone text,
  avatar_url text,
  role text not null default 'host' check (role in ('guest', 'host', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Elanlar
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id),
  title text not null,
  description text not null,
  price_per_night numeric(10, 2) not null check (price_per_night > 0),
  price_unit text not null default 'day' check (price_unit in ('day', 'week', 'month')),
  currency text not null default 'AZN',
  city text not null,
  region text not null,
  address text,
  lat double precision,
  lng double precision,
  max_guests int not null default 2 check (max_guests > 0),
  bedrooms int not null default 1 check (bedrooms >= 0),
  bathrooms int not null default 1 check (bathrooms >= 0),
  whatsapp_phone text not null,
  status text not null default 'pending' check (status in ('draft', 'pending', 'approved', 'rejected')),
  is_vip boolean not null default false,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Elan şəkilləri
create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  url text not null,
  storage_path text not null,
  is_cover boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Elan ↔ amenity əlaqəsi
create table public.listing_amenities (
  listing_id uuid not null references public.listings (id) on delete cascade,
  amenity_id uuid not null references public.amenities (id) on delete cascade,
  primary key (listing_id, amenity_id)
);

-- Otel otaq tipləri
create table public.listing_room_types (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  name text not null,
  floor int check (floor is null or floor >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.listing_room_type_amenities (
  room_type_id uuid not null references public.listing_room_types (id) on delete cascade,
  amenity_id uuid not null references public.amenities (id) on delete cascade,
  primary key (room_type_id, amenity_id)
);

-- İndekslər
create index listings_status_idx on public.listings (status);
create index listings_is_vip_idx on public.listings (is_vip) where is_vip = true;
create index listings_region_idx on public.listings (region);
create index listings_category_idx on public.listings (category_id);
create index listing_images_listing_idx on public.listing_images (listing_id, sort_order);
create index listing_room_types_listing_idx on public.listing_room_types (listing_id, sort_order);

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.handle_updated_at();

-- Yeni istifadəçi üçün avtomatik profil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.categories enable row level security;
alter table public.amenity_categories enable row level security;
alter table public.amenities enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.listing_amenities enable row level security;
alter table public.listing_room_types enable row level security;
alter table public.listing_room_type_amenities enable row level security;

-- Kateqoriya və amenities: hamı oxuya bilər
create policy "categories_public_read" on public.categories for select using (true);
create policy "amenity_categories_public_read" on public.amenity_categories for select using (true);
create policy "amenities_public_read" on public.amenities for select using (true);

-- Profil: öz profilini oxu/yenilə
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_select_public" on public.profiles
  for select using (true);

-- Elanlar: təsdiqlənmiş elanlar hamıya açıq
create policy "listings_public_read" on public.listings
  for select using (status = 'approved' or owner_id = auth.uid());
create policy "listings_insert_own" on public.listings
  for insert with check (auth.uid() = owner_id);
create policy "listings_update_own" on public.listings
  for update using (auth.uid() = owner_id);
create policy "listings_delete_own" on public.listings
  for delete using (auth.uid() = owner_id);

-- Şəkillər: təsdiqlənmiş elanların şəkilləri hamıya açıq
create policy "listing_images_public_read" on public.listing_images
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'approved' or l.owner_id = auth.uid())
    )
  );
create policy "listing_images_insert_own" on public.listing_images
  for insert with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );
create policy "listing_images_delete_own" on public.listing_images
  for delete using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

-- Listing amenities
create policy "listing_amenities_public_read" on public.listing_amenities
  for select using (true);
create policy "listing_amenities_insert_own" on public.listing_amenities
  for insert with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

-- Otel otaq tipləri
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

-- Seed: kateqoriyalar
insert into public.categories (slug, name_az, sort_order) values
  ('hotel', 'Hotel', 1),
  ('hostel', 'Hostel', 2),
  ('a-frame', 'A-frame (Glamping)', 3),
  ('villa', 'Villa / Bağ evi', 4),
  ('rayon-evi', 'Rayon evi', 5);

create index amenities_category_idx on public.amenities (category_id, sort_order);

-- Seed: amenity kateqoriyaları və daxildir
insert into public.amenity_categories (slug, name_az, sort_order) values
  ('room', 'Otaq xüsusiyyətləri', 1),
  ('property', 'Müəssisə xüsusiyyətləri', 2);

insert into public.amenities (slug, name_az, category_id, sort_order)
select v.slug, v.name_az, c.id, v.sort_order
from (values
  ('wifi', 'Wi-Fi', 'room', 1),
  ('tv', 'TV', 'room', 2),
  ('ac', 'Kondisioner', 'room', 3),
  ('kitchen', 'Mətbəx', 'room', 4),
  ('refrigerator', 'Soyuducu', 'room', 5),
  ('coffee-maker', 'Qəhvə aparatı', 'room', 6),
  ('iron', 'Tefal', 'room', 7),
  ('bathroom', 'Hamam otağı', 'room', 8),
  ('hair-dryer', 'Hava fenı', 'room', 9),
  ('ironing-board', 'Paltar ütüsü', 'room', 10),
  ('washing-machine', 'Paltaryuyan', 'room', 11),
  ('bathtub', 'Su vannası', 'room', 12),
  ('shampoo', 'Şampun', 'room', 13),
  ('soap', 'Sabun', 'room', 14),
  ('towel', 'Dəsmal', 'room', 15),
  ('parking', 'Parkinq', 'property', 1),
  ('pool', 'Hovuz', 'property', 2),
  ('jacuzzi', 'Jakuzi', 'property', 3),
  ('balcony', 'Balkon', 'property', 4),
  ('reception', 'Resepsiya', 'property', 5),
  ('room-service', 'Otaq xidməti', 'property', 6),
  ('breakfast', 'Səhər yeməyi', 'property', 7),
  ('mountain-view', 'Dağ mənzərəsi', 'property', 8),
  ('forest-view', 'Meşə mənzərəsi', 'property', 9),
  ('city-view', 'Şəhər mənzərəsi', 'property', 10),
  ('water-view', 'Çay (Dəniz) mənzərəsi', 'property', 11)
) as v(slug, name_az, cat_slug, sort_order)
join public.amenity_categories c on c.slug = v.cat_slug;
