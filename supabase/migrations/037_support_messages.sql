-- İstifadəçilərin admin-ə göndərdiyi şikayət və təkliflər
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists support_messages_created_idx
  on public.support_messages (created_at desc);

create index if not exists support_messages_unread_idx
  on public.support_messages (is_read, created_at desc);

alter table public.support_messages enable row level security;

-- İstifadəçi yalnız öz adından müraciət göndərə bilər
drop policy if exists "support_messages_insert_own" on public.support_messages;
create policy "support_messages_insert_own"
  on public.support_messages
  for insert
  with check (auth.uid() = user_id);

-- İstifadəçi öz müraciətlərini görə bilər
drop policy if exists "support_messages_select_own" on public.support_messages;
create policy "support_messages_select_own"
  on public.support_messages
  for select
  using (auth.uid() = user_id);

-- Admin bütün müraciətləri idarə edir
drop policy if exists "support_messages_admin_all" on public.support_messages;
create policy "support_messages_admin_all"
  on public.support_messages
  for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
