-- Admin təsdiqdən sonra silinmə tarixçəsini təmizləyə bilsin

create policy "listing_deletion_log_admin_delete" on public.listing_deletion_log
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
