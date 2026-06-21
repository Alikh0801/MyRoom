-- Profil telefonu unikal olsun; qeydiyyatda metadata-dan yazılsın
create unique index if not exists profiles_phone_unique
  on public.profiles (phone)
  where phone is not null;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, whatsapp_phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'whatsapp_phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;
