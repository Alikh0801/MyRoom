-- Kateqoriya və amenities üçün rus dili adları

alter table public.categories
  add column if not exists name_ru text;

alter table public.amenity_categories
  add column if not exists name_ru text;

alter table public.amenities
  add column if not exists name_ru text;

update public.categories
set name_ru = case slug
  when 'hotel' then 'Отель'
  when 'hostel' then 'Хостел'
  when 'a-frame' then 'A-frame (Glamping)'
  when 'villa' then 'Вилла'
  when 'rayon-evi' then 'Загородный дом'
  else name_az
end
where name_ru is null;

update public.amenity_categories
set name_ru = case slug
  when 'room' then 'Особенности номера'
  when 'property' then 'Особенности заведения'
  else name_az
end
where name_ru is null;

update public.amenities
set name_ru = case slug
  when 'wifi' then 'Wi-Fi'
  when 'tv' then 'TV'
  when 'ac' then 'Кондиционер'
  when 'kitchen' then 'Кухня'
  when 'refrigerator' then 'Холодильник'
  when 'coffee-maker' then 'Кофеварка'
  when 'iron' then 'Утюг'
  when 'bathroom' then 'Ванная комната'
  when 'hair-dryer' then 'Фен'
  when 'ironing-board' then 'Гладильная доска'
  when 'washing-machine' then 'Стиральная машина'
  when 'bathtub' then 'Ванна'
  when 'shampoo' then 'Шампунь'
  when 'soap' then 'Мыло'
  when 'towel' then 'Полотенце'
  when 'parking' then 'Парковка'
  when 'pool' then 'Бассейн'
  when 'jacuzzi' then 'Джакузи'
  when 'balcony' then 'Балкон'
  when 'reception' then 'Ресепшн'
  when 'room-service' then 'Обслуживание номеров'
  when 'breakfast' then 'Завтрак'
  when 'mountain-view' then 'Вид на горы'
  when 'forest-view' then 'Вид на лес'
  when 'city-view' then 'Вид на город'
  when 'water-view' then 'Вид на воду'
  else name_az
end
where name_ru is null;
