-- VIP ödəniş çeki + bank kartı ayarları + VIP bitmə tarixi

create table if not exists public.site_payment_settings (
  id int primary key default 1 check (id = 1),
  bank_name text,
  card_number text,
  cardholder_name text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

insert into public.site_payment_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_payment_settings enable row level security;

drop policy if exists "site_payment_settings_public_read" on public.site_payment_settings;
create policy "site_payment_settings_public_read"
  on public.site_payment_settings
  for select
  using (true);

drop policy if exists "site_payment_settings_admin_update" on public.site_payment_settings;
create policy "site_payment_settings_admin_update"
  on public.site_payment_settings
  for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

alter table public.listings
  add column if not exists vip_payment_receipt_url text,
  add column if not exists vip_payment_receipt_path text,
  add column if not exists vip_expires_at timestamptz;

create index if not exists listings_vip_expires_at_idx
  on public.listings (vip_expires_at)
  where is_vip = true;

-- Owner VIP sorğusu (paket + çeki) göndərə bilsin; VIP status yalnız admin
create or replace function public.prevent_listing_workflow_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.is_admin(auth.uid()) then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.owner_id is distinct from auth.uid() then
      raise exception 'Listing owner must match authenticated user';
    end if;

    if new.status is distinct from 'pending' then
      raise exception 'Listing status must start as pending';
    end if;

    if coalesce(new.is_vip, false) is distinct from false then
      raise exception 'VIP status can only be changed by admin';
    end if;

    if coalesce(new.vip_payment_status, 'none') not in ('none', 'pending') then
      raise exception 'VIP payment status cannot be marked paid by owner';
    end if;

    if new.vip_expires_at is not null then
      raise exception 'VIP expiry can only be set by admin';
    end if;

    return new;
  end if;

  if new.owner_id is distinct from old.owner_id then
    raise exception 'Listing owner cannot be changed';
  end if;

  if new.is_vip is distinct from old.is_vip then
    raise exception 'VIP status can only be changed by admin';
  end if;

  if new.vip_expires_at is distinct from old.vip_expires_at then
    raise exception 'VIP expiry can only be changed by admin';
  end if;

  if new.vip_payment_status is distinct from old.vip_payment_status then
    if not (
      new.vip_payment_status = 'pending'
      and old.vip_payment_status in ('none', 'pending')
    ) then
      raise exception 'VIP payment status can only be changed by admin';
    end if;
  end if;

  if new.requested_vip_plan is distinct from old.requested_vip_plan then
    if not (
      new.requested_vip_plan in ('day', 'week')
      and old.vip_payment_status in ('none', 'pending')
      and coalesce(old.is_vip, false) = false
    ) then
      raise exception 'VIP plan request cannot be changed in the current state';
    end if;
  end if;

  if new.vip_payment_receipt_url is distinct from old.vip_payment_receipt_url
     or new.vip_payment_receipt_path is distinct from old.vip_payment_receipt_path then
    if coalesce(old.is_vip, false) = true or old.vip_payment_status = 'paid' then
      raise exception 'VIP receipt cannot be changed after payment is confirmed';
    end if;
  end if;

  if new.status is distinct from old.status and new.status is distinct from 'pending' then
    raise exception 'Listing status can only be reset to pending by owner';
  end if;

  if new.rejection_reason is distinct from old.rejection_reason then
    if new.status is distinct from 'pending' or new.rejection_reason is not null then
      raise exception 'Rejection reason can only be cleared when resubmitting';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists listings_protect_workflow on public.listings;
create trigger listings_protect_workflow
  before insert or update on public.listings
  for each row
  execute function public.prevent_listing_workflow_escalation();
