-- Otel kateqoriyasını Hotel olaraq yenilə
update public.categories
set slug = 'hotel',
    name_az = 'Hotel'
where slug = 'otel';
