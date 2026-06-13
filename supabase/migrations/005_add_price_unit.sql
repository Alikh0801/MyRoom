-- Qiymət vahidi: gün, həftə, ay

alter table public.listings
  add column if not exists price_unit text not null default 'day'
  check (price_unit in ('day', 'week', 'month'));
