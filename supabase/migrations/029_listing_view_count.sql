-- Organic view increments via RPC + protect view_count from owner tampering.

create or replace function public.increment_listing_view_count(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.listings
  set view_count = view_count + 1
  where id = p_listing_id
    and status = 'approved';
end;
$$;

revoke all on function public.increment_listing_view_count(uuid) from public;
grant execute on function public.increment_listing_view_count(uuid) to anon, authenticated;

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

    if coalesce(new.view_count, 0) is distinct from 0 then
      raise exception 'View count cannot be set by owner';
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

  if new.view_count is distinct from old.view_count then
    if new.view_count is distinct from coalesce(old.view_count, 0) + 1 then
      raise exception 'View count can only be incremented or changed by admin';
    end if;
  end if;

  return new;
end;
$$;
