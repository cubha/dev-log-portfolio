-- 방명록 댓글(guestbook_comments) + 좋아요(guestbook_comment_likes) 테이블 생성

-- ── 1. guestbook_comments ──────────────────────────────
create table public.guestbook_comments (
  id           bigserial    primary key,
  guestbook_id bigint       not null references public.guestbook(id) on delete cascade,
  user_id      text,
  nickname     text         not null,
  message      text         not null,
  avatar_url   text,
  created_at   timestamptz  not null default now()
);

alter table public.guestbook_comments enable row level security;

create policy "Anyone can read comments"
  on public.guestbook_comments for select using (true);

create policy "Anyone can insert comments"
  on public.guestbook_comments for insert with check (true);

create policy "Admin or author can delete comments"
  on public.guestbook_comments for delete using (
    user_id = auth.uid()::text
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create index idx_guestbook_comments_guestbook_id
  on public.guestbook_comments(guestbook_id);

create index idx_guestbook_comments_created_at
  on public.guestbook_comments(created_at desc);

-- ── 2. guestbook_comment_likes ─────────────────────────
create table public.guestbook_comment_likes (
  id          bigserial    primary key,
  comment_id  bigint       not null references public.guestbook_comments(id) on delete cascade,
  user_id     text         not null,
  created_at  timestamptz  not null default now(),
  unique(comment_id, user_id)
);

alter table public.guestbook_comment_likes enable row level security;

create policy "Anyone can read likes"
  on public.guestbook_comment_likes for select using (true);

create policy "Authenticated users can insert likes"
  on public.guestbook_comment_likes for insert
  with check (auth.uid() is not null);

create policy "Users can delete own likes"
  on public.guestbook_comment_likes for delete
  using (user_id = auth.uid()::text);

create index idx_guestbook_comment_likes_comment_id
  on public.guestbook_comment_likes(comment_id);
