-- Mənzil və Glamping kateqoriyalarını sil (planlaşdırılmır)

update public.listings
set category_id = (select id from public.categories where slug = 'rayon-evi' limit 1)
where category_id in (
  select id from public.categories where slug in ('menzil', 'glamping')
);

delete from public.categories
where slug in ('menzil', 'glamping');

-- Rayon evi sıra nömrəsini yenilə
update public.categories
set sort_order = 5
where slug = 'rayon-evi';
