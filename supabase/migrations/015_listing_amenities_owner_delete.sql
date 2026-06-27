-- Elan sahibi redaktə edəndə amenities və otaq xüsusiyyətlərini yeniləyə bilsin

drop policy if exists "listing_amenities_delete_own" on public.listing_amenities;
create policy "listing_amenities_delete_own" on public.listing_amenities
  for delete using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

drop policy if exists "listing_room_types_update_own" on public.listing_room_types;
create policy "listing_room_types_update_own" on public.listing_room_types
  for update using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

drop policy if exists "listing_room_types_delete_own" on public.listing_room_types;
create policy "listing_room_types_delete_own" on public.listing_room_types
  for delete using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

drop policy if exists "listing_room_type_amenities_delete_own" on public.listing_room_type_amenities;
create policy "listing_room_type_amenities_delete_own" on public.listing_room_type_amenities
  for delete using (
    exists (
      select 1 from public.listing_room_types rt
      join public.listings l on l.id = rt.listing_id
      where rt.id = room_type_id and l.owner_id = auth.uid()
    )
  );
