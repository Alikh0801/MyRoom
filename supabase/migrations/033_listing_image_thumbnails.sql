-- Kart/grid-də kiçik ölçüdə göstərilən yerlər üçün ayrıca yüngül thumbnail
-- (əsas şəklin keyfiyyətinə toxunmur, yalnız kiçik önizləmələr üçündür).
alter table public.listing_images
  add column if not exists thumb_url text,
  add column if not exists thumb_storage_path text;
