-- Production security hardening for profile roles and listing workflow fields.

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id
      and p.role = 'admin'
  );
$$;

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    raise exception 'Profile role cannot be changed by the owner';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row
  execute function public.prevent_profile_role_escalation();

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

    return new;
  end if;

  if new.owner_id is distinct from old.owner_id then
    raise exception 'Listing owner cannot be changed';
  end if;

  if new.is_vip is distinct from old.is_vip then
    raise exception 'VIP status can only be changed by admin';
  end if;

  if new.vip_payment_status is distinct from old.vip_payment_status then
    raise exception 'VIP payment status can only be changed by admin';
  end if;

  if new.requested_vip_plan is distinct from old.requested_vip_plan then
    raise exception 'VIP plan request cannot be changed after creation';
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

drop policy if exists profiles_admin_select on public.profiles;
create policy "profiles_admin_select" on public.profiles
  for select using (public.is_admin(auth.uid()));
