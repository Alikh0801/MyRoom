-- Elan başlığı və təsvir üçün istəyə bağlı rus dili

alter table public.listings
  add column if not exists title_ru text,
  add column if not exists description_ru text;
