-- Profil email unikal olsun (auth.users ilə sinxron)
alter table public.profiles
  add column if not exists email text;

-- Mövcud istifadəçilərin emailini doldur
update public.profiles p
set email = lower(trim(u.email))
from auth.users u
where p.id = u.id
  and (p.email is null or p.email = '');

create unique index if not exists profiles_email_unique
  on public.profiles (email)
  where email is not null;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, whatsapp_phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'whatsapp_phone', ''),
    lower(trim(new.email))
  );
  return new;
end;
$$ language plpgsql security definer;
