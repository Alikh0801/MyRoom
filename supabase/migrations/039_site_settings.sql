-- Admin panelindən idarə olunan sayt parametrləri (açar/dəyər).
-- Hazırda yalnız footer-dəki Instagram ünvanı üçün istifadə olunur, amma
-- gələcək parametrlər üçün də açıqdır — yeni sütun yox, yeni sətir əlavə edilir.
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Footer bütün ziyarətçilərə göstərilir, ona görə oxumaq hamıya açıqdır
drop policy if exists "site_settings_select_all" on public.site_settings;
create policy "site_settings_select_all"
  on public.site_settings
  for select
  using (true);

-- Dəyişmək yalnız adminin ixtiyarındadır
drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write"
  on public.site_settings
  for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Boş dəyərlə başlayır: ünvan verilməyənə qədər footer-də ikon görünmür
insert into public.site_settings (key, value)
values ('instagram_url', '')
on conflict (key) do nothing;
