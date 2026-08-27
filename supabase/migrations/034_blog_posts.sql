-- Admin paneldən idarə olunan blog məqalələri
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  region text,
  read_minutes int not null default 5,
  cover_url text,
  cover_storage_path text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Azərbaycan dili məcburidir, digərləri boş qala bilər (AZ-yə fallback olunur)
  title_az text not null,
  title_ru text,
  title_tr text,

  excerpt_az text,
  excerpt_ru text,
  excerpt_tr text,

  meta_description_az text,
  meta_description_ru text,
  meta_description_tr text,

  -- "Qısa faktlar" bloku — hər sətir ayrı bənd
  highlights_az text,
  highlights_ru text,
  highlights_tr text,

  -- Sadə mətn formatı: "## Başlıq", "- siyahı bəndi", boş sətirlə ayrılmış abzaslar
  body_az text,
  body_ru text,
  body_tr text
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (status, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts
  for select
  using (status = 'published');

drop policy if exists "blog_posts_admin_all" on public.blog_posts;
create policy "blog_posts_admin_all"
  on public.blog_posts
  for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.handle_updated_at();
