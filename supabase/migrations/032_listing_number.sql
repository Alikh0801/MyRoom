-- Elanlar üçün qısa, oxunaqlı, unikal sıra nömrəsi (ID ilə axtarış üçün)
create sequence if not exists public.listings_listing_number_seq;

alter table public.listings
  add column if not exists listing_number bigint;

update public.listings l
set listing_number = sub.rn
from (
  select id, row_number() over (order by created_at asc) as rn
  from public.listings
) sub
where l.id = sub.id
  and l.listing_number is null;

select setval(
  'public.listings_listing_number_seq',
  coalesce((select max(listing_number) from public.listings), 0) + 1,
  false
);

alter table public.listings
  alter column listing_number set default nextval('public.listings_listing_number_seq');

alter table public.listings
  alter column listing_number set not null;

alter sequence public.listings_listing_number_seq owned by public.listings.listing_number;

create unique index if not exists listings_listing_number_key
  on public.listings (listing_number);
