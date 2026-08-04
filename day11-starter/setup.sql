-- Supabase SQL Editor에 통째로 붙여넣고 Run 한 번.
create table if not exists applications (
  id bigint generated always as identity primary key,
  name text not null,
  contact text not null,
  level text not null,
  availability text not null,
  experience text,
  motivation text,
  created_at timestamptz not null default now()
);
alter table applications enable row level security;
-- 익명 키로는 "넣기"만 허용한다. 읽기는 대시보드(Table Editor)에서만.
create policy "anon insert only" on applications
  for insert to anon with check (true);
