-- VIP elan flag-i (Populyar elanlar bölməsi üçün)

alter table public.listings
  add column if not exists is_vip boolean not null default false;

create index if not exists listings_is_vip_idx
  on public.listings (is_vip)
  where is_vip = true;
