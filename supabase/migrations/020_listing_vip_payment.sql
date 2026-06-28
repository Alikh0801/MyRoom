-- VIP plan seçimi və ödəniş statusu (ödəniş sistemi inteqrasiyası üçün)

alter table public.listings
  add column if not exists requested_vip_plan text
    check (requested_vip_plan is null or requested_vip_plan in ('day', 'week')),
  add column if not exists vip_payment_status text not null default 'none'
    check (vip_payment_status in ('none', 'pending', 'paid'));
