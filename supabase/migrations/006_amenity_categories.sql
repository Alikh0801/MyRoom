-- Daxildir: kateqoriyalı amenities sistemi

create table if not exists public.amenity_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_az text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.amenities
  add column if not exists category_id uuid references public.amenity_categories (id),
  add column if not exists sort_order int not null default 0;

-- Köhnə flat amenities-i yenilə (mövcud DB)
delete from public.listing_amenities;
delete from public.amenities;

insert into public.amenity_categories (slug, name_az, sort_order) values
  ('room', 'Otaq xüsusiyyətləri', 1),
  ('property', 'Müəssisə xüsusiyyətləri', 2)
on conflict (slug) do update set name_az = excluded.name_az, sort_order = excluded.sort_order;

-- Otaq xüsusiyyətləri
insert into public.amenities (slug, name_az, category_id, sort_order)
select v.slug, v.name_az, c.id, v.sort_order
from (values
  ('wifi', 'Wi-Fi', 1),
  ('tv', 'TV', 2),
  ('ac', 'Kondisioner', 3),
  ('kitchen', 'Mətbəx', 4),
  ('refrigerator', 'Soyuducu', 5),
  ('coffee-maker', 'Qəhvə aparatı', 6),
  ('iron', 'Tefal', 7),
  ('bathroom', 'Hamam otağı', 8),
  ('hair-dryer', 'Hava fenı', 9),
  ('ironing-board', 'Paltar ütüsü', 10),
  ('washing-machine', 'Paltaryuyan', 11),
  ('bathtub', 'Su vannası', 12),
  ('shampoo', 'Şampun', 13),
  ('soap', 'Sabun', 14),
  ('towel', 'Dəsmal', 15)
) as v(slug, name_az, sort_order)
cross join public.amenity_categories c
where c.slug = 'room';

-- Müəssisə xüsusiyyətləri
insert into public.amenities (slug, name_az, category_id, sort_order)
select v.slug, v.name_az, c.id, v.sort_order
from (values
  ('parking', 'Parkinq', 1),
  ('pool', 'Hovuz', 2),
  ('jacuzzi', 'Jakuzi', 3),
  ('balcony', 'Balkon', 4),
  ('reception', 'Resepsiya', 5),
  ('room-service', 'Otaq xidməti', 6),
  ('breakfast', 'Səhər yeməyi', 7),
  ('mountain-view', 'Dağ mənzərəsi', 8),
  ('forest-view', 'Meşə mənzərəsi', 9),
  ('city-view', 'Şəhər mənzərəsi', 10),
  ('water-view', 'Çay (Dəniz) mənzərəsi', 11)
) as v(slug, name_az, sort_order)
cross join public.amenity_categories c
where c.slug = 'property';

alter table public.amenity_categories enable row level security;

create policy "amenity_categories_public_read" on public.amenity_categories
  for select using (true);

create index if not exists amenities_category_idx on public.amenities (category_id, sort_order);
