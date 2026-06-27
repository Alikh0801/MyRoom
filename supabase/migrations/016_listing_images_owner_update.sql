-- Elan sahibi şəkil sırası və əsas şəkli yeniləyə bilsin

drop policy if exists "listing_images_update_own" on public.listing_images;
create policy "listing_images_update_own" on public.listing_images
  for update using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );
