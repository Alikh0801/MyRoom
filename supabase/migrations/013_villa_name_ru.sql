-- Villa kateqoriyasının rus adını qısaldır: yalnız «Вилла»

update public.categories
set name_ru = 'Вилла'
where slug = 'villa';
