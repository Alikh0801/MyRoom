-- Admin silmə tarixçəsi

create table if not exists public.listing_deletion_log (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  title text not null,
  city text,
  region text,
  price_per_night numeric(10, 2),
  price_unit text,
  currency text,
  category_name_az text,
  owner_name text,
  cover_image_url text,
  delete_reason text not null,
  deleted_by uuid not null references public.profiles (id),
  deleted_at timestamptz not null default now()
);

create index if not exists listing_deletion_log_deleted_at_idx
  on public.listing_deletion_log (deleted_at desc);

alter table public.listing_deletion_log enable row level security;

create policy "listing_deletion_log_admin_select" on public.listing_deletion_log
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "listing_deletion_log_admin_insert" on public.listing_deletion_log
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
