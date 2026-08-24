-- Sayt ziyarətlərinin qeydiyyatı (admin statistika paneli üçün).

create table public.site_visits (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  path text not null,
  locale text,
  country text,
  region text,
  city text,
  created_at timestamptz not null default now()
);

create index site_visits_created_at_idx on public.site_visits (created_at);
create index site_visits_visitor_id_idx on public.site_visits (visitor_id);

alter table public.site_visits enable row level security;

create policy "Admins can view site visits"
on public.site_visits for select
using (public.is_admin(auth.uid()));

-- Yazma yalnız aşağıdakı SECURITY DEFINER funksiya vasitəsilə, cədvələ birbaşa insert yoxdur.
create or replace function public.log_site_visit(
  p_visitor_id uuid,
  p_path text,
  p_locale text,
  p_country text,
  p_region text,
  p_city text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_visits (visitor_id, path, locale, country, region, city)
  values (p_visitor_id, p_path, p_locale, p_country, p_region, p_city);
end;
$$;

revoke all on function public.log_site_visit(uuid, text, text, text, text, text) from public;
grant execute on function public.log_site_visit(uuid, text, text, text, text, text) to anon, authenticated;
