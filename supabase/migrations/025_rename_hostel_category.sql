-- Hostel kateqoriyasının görünən adını yenilə (slug dəyişmir)
update public.categories
set name_az = 'Hostel/Kortec'
where slug = 'hostel';

update public.categories
set name_ru = 'Хостел/Кортеч'
where slug = 'hostel';
