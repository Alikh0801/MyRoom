-- Rədd səbəbi və admin üçün əlaqəli cədvəl icazələri

alter table public.listings
  add column if not exists rejection_reason text;

create policy "listing_images_admin_manage" on public.listing_images
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "listing_amenities_admin_manage" on public.listing_amenities
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "listing_room_types_admin_manage" on public.listing_room_types
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "listing_room_type_amenities_admin_manage" on public.listing_room_type_amenities
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
