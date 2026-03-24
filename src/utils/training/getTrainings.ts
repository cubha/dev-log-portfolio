import { createClient } from '@/src/utils/supabase/server'
import type { Training } from '@/src/types/profile'

/**
 * 전체 교육/자격증 목록 조회 (서버 컴포넌트용, 최신순)
 *
 * ── Supabase 마이그레이션 SQL ──────────────────────────────────────────────
 * DB에 아직 테이블/컬럼이 없다면 아래 SQL을 먼저 실행하세요.
 *
 * -- 교육/자격증 테이블
 * CREATE TABLE IF NOT EXISTS trainings (
 *   id             SERIAL PRIMARY KEY,
 *   title          TEXT NOT NULL,
 *   institution    TEXT NOT NULL,
 *   acquired_date  TEXT NOT NULL,
 *   description    TEXT,
 *   type           TEXT NOT NULL DEFAULT 'education'
 *                  CHECK (type IN ('education', 'certification')),
 *   created_at     TIMESTAMPTZ DEFAULT NOW()
 * );
 * -- 교육 타입의 경우 수강 기간(from - to) 컬럼 추가:
 * -- ALTER TABLE trainings ADD COLUMN IF NOT EXISTS start_date TEXT;
 * -- ALTER TABLE trainings ADD COLUMN IF NOT EXISTS end_date TEXT;
 *
 * -- About 프로필 섹션 공개 여부 컬럼 추가
 * ALTER TABLE about_profiles
 *   ADD COLUMN IF NOT EXISTS show_experience BOOLEAN NOT NULL DEFAULT TRUE,
 *   ADD COLUMN IF NOT EXISTS show_education  BOOLEAN NOT NULL DEFAULT TRUE,
 *   ADD COLUMN IF NOT EXISTS show_training   BOOLEAN NOT NULL DEFAULT TRUE;
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function getAllTrainings(): Promise<Training[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await (supabase as any)
      .from('trainings')
      .select('*')
      .order('acquired_date', { ascending: false })

    if (error) {
      console.error('trainings 조회 오류:', error)
      return []
    }
    return ((data ?? []) as unknown[]) as Training[]
  } catch (err) {
    console.error('trainings 조회 예외:', err)
    return []
  }
}
