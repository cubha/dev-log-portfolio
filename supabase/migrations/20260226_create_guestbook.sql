-- 방명록(Guestbook) 테이블 생성
-- 공개 읽기, 익명 삽입, 관리자 삭제만 허용

create table public.guestbook (
  id          bigserial primary key,
  nickname    text      not null,
  message     text      not null,
  emoji       text      not null default '👋',
  created_at  timestamptz not null default now()
);

-- RLS 정책
alter table public.guestbook enable row level security;

create policy "Anyone can read guestbook"
  on public.guestbook for select using (true);

create policy "Anyone can insert guestbook"
  on public.guestbook for insert with check (true);

create policy "Admin can delete guestbook"
  on public.guestbook for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
