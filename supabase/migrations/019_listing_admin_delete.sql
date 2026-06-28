-- Admin elan silə bilsin; redaktə üçün əlavə icazələri götür

create policy "listings_admin_delete" on public.listings
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "listing_images_admin_manage" on public.listing_images;
drop policy if exists "listing_amenities_admin_manage" on public.listing_amenities;
drop policy if exists "listing_room_types_admin_manage" on public.listing_room_types;
drop policy if exists "listing_room_type_amenities_admin_manage" on public.listing_room_type_amenities;
