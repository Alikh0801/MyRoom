-- Admin gözləyən elanların şəkillərini oxuya bilsin

drop policy if exists "listing_images_admin_select" on public.listing_images;

create policy "listing_images_admin_select" on public.listing_images
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
