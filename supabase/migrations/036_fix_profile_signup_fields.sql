-- 030 nömrəli miqrasiya handle_new_user()-i əvəz edərkən email, phone və
-- whatsapp_phone sahələrini itirmişdi. Nəticədə 030-dan sonra qeydiyyatdan
-- keçən istifadəçilərin profilində bu sahələr boş qalıb.
-- Bu miqrasiya funksiyanı bütün sahələrlə bərpa edir və itmiş məlumatı
-- auth.users-dən geri doldurur.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, full_name, phone, whatsapp_phone, email, avatar_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'whatsapp_phone', ''),
    lower(trim(new.email)),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- İtmiş email-ləri bərpa et
update public.profiles p
set email = lower(trim(u.email))
from auth.users u
where p.id = u.id
  and u.email is not null
  and (p.email is null or p.email = '');

-- İtmiş telefon nömrələrini bərpa et (qeydiyyat metadatasından)
update public.profiles p
set phone = nullif(u.raw_user_meta_data ->> 'phone', '')
from auth.users u
where p.id = u.id
  and (p.phone is null or p.phone = '')
  and nullif(u.raw_user_meta_data ->> 'phone', '') is not null;

update public.profiles p
set whatsapp_phone = nullif(u.raw_user_meta_data ->> 'whatsapp_phone', '')
from auth.users u
where p.id = u.id
  and (p.whatsapp_phone is null or p.whatsapp_phone = '')
  and nullif(u.raw_user_meta_data ->> 'whatsapp_phone', '') is not null;
