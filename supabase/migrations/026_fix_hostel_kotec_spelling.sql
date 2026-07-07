-- Hostel/Kotec yazılışını düzəlt (əvvəlki migrationda Kortec səhv yazılmışdı)
update public.categories
set name_az = 'Hostel/Kotec'
where slug = 'hostel';

update public.categories
set name_ru = 'Хостел/Котеч'
where slug = 'hostel';
