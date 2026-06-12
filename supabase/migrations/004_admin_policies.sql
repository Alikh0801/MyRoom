-- Admin: bütün elanları oxuma və status yeniləmə

create policy "listings_admin_select" on public.listings
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "listings_admin_update" on public.listings
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "listing_images_admin_select" on public.listing_images
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- İlk admin təyin etmək üçün (öz user id-nizi yazın):
-- update public.profiles set role = 'admin' where id = 'YOUR-USER-UUID';
