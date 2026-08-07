-- 방명록 댓글/좋아요 RLS INSERT 정책 강화 (2026-08-07 /ship 사전 보안검토 발견)
--
-- 문제:
-- 1) guestbook_comment_likes INSERT 정책이 auth.uid() is not null만 검사하고
--    user_id = auth.uid()::text를 검증하지 않아, 로그인 사용자가 타인 UUID로
--    좋아요를 위조할 수 있었다 (unique(comment_id, user_id) 제약 무력화).
-- 2) guestbook_comments INSERT 정책이 with check (true)라 로그인 사용자도
--    임의의 user_id를 지정해 신원 도용 댓글을 삽입할 수 있었다.
--    (익명 댓글은 user_id = null로 정상 허용되어야 하므로 완전 차단은 아님)

-- ── guestbook_comment_likes: 항상 로그인 필요 + 본인 user_id만 허용 ──
drop policy if exists "Authenticated users can insert likes" on public.guestbook_comment_likes;

create policy "Authenticated users can insert own likes"
  on public.guestbook_comment_likes for insert
  with check (auth.uid() is not null and user_id = auth.uid()::text);

-- ── guestbook_comments: 익명(user_id null)은 허용, 로그인 시 본인 user_id만 허용 ──
drop policy if exists "Anyone can insert comments" on public.guestbook_comments;

create policy "Anyone can insert comments with own identity"
  on public.guestbook_comments for insert
  with check (user_id is null or user_id = auth.uid()::text);
