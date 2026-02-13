-- Add missing columns to inquiries table
-- password_hash: 비밀번호 해시 (문의 수정/삭제 및 비공개 문의 열람용)
-- reply: 관리자 답변 내용
-- replied_at: 답변 일시

ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reply TEXT NULL,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE NULL;
