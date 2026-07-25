-- Otaq xüsusiyyətlərinə yeni amenities əlavə et
insert into public.amenities (slug, name_az, name_ru, category_id, sort_order)
select v.slug, v.name_az, v.name_ru, c.id, v.sort_order
from (values
  ('dishes-set', 'Qab-qacaq dəsti', 'Набор посуды', 16),
  ('barbecue', 'Manqal', 'Мангал', 17),
  ('samovar', 'Samovar', 'Самовар', 18),
  ('shower-cabin', 'Duş-kabin', 'Душевая кабина', 19),
  ('combi-boiler', 'Kombi', 'Комби', 20),
  ('water-heater', 'Su qızdırıcı', 'Водонагреватель', 21)
) as v(slug, name_az, name_ru, sort_order)
cross join public.amenity_categories c
where c.slug = 'room'
on conflict (slug) do update
set
  name_az = excluded.name_az,
  name_ru = excluded.name_ru,
  category_id = excluded.category_id,
  sort_order = excluded.sort_order;
