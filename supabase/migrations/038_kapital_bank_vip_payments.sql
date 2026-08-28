-- Kapital Bank onlayn ödəniş inteqrasiyası: hər VIP alış cəhdi bu cədvəldə
-- izlənir. status: preparing (bankın ödəniş səhifəsinə yönləndirilib) ->
-- paid / failed (callback-də bankdan təsdiqləndikdən sonra).
create table if not exists public.vip_payment_orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null check (plan in ('day', 'week')),
  amount numeric(10, 2) not null,
  currency text not null default 'AZN',
  bank_order_id text not null unique,
  status text not null default 'preparing' check (status in ('preparing', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists vip_payment_orders_listing_idx
  on public.vip_payment_orders (listing_id, created_at desc);

create index if not exists vip_payment_orders_bank_order_idx
  on public.vip_payment_orders (bank_order_id);

alter table public.vip_payment_orders enable row level security;

drop policy if exists "vip_payment_orders_select_own" on public.vip_payment_orders;
create policy "vip_payment_orders_select_own"
  on public.vip_payment_orders
  for select
  using (auth.uid() = owner_id);

-- createVipCheckout sifarişi sahibin öz sessiyası ilə (adi client) yaradır,
-- ona görə INSERT icazəsi lazımdır (yoxsa RLS xətası ilə uğursuz olar).
-- status/paid_at yeniləmələri isə (markVipOrderPaid/Failed) yalnız
-- service-role client ilə edilir (RLS-i keçir) — owner üçün ayrıca UPDATE
-- icazəsi yoxdur ki, sahib öz sifarişini birbaşa "ödənilib" kimi
-- işarələyə bilməsin.
drop policy if exists "vip_payment_orders_insert_own" on public.vip_payment_orders;
create policy "vip_payment_orders_insert_own"
  on public.vip_payment_orders
  for insert
  with check (auth.uid() = owner_id);

drop policy if exists "vip_payment_orders_admin_all" on public.vip_payment_orders;
create policy "vip_payment_orders_admin_all"
  on public.vip_payment_orders
  for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Əl ilə bank kartı köçürməsi + çek sistemi ləğv edilir (onlayn ödəniş ilə
-- əvəz olunur). Elanlardakı köhnə çek sahələri (vip_payment_receipt_url/path)
-- toxunulmadan qalır — mövcud elanların tarixi qeydi kimi saxlanılır, sadəcə
-- artıq yazılmır.
drop table if exists public.site_payment_settings;
