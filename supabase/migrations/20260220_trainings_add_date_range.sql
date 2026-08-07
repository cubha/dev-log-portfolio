-- 교육(education) 타입의 경우 수강 기간(from - to)을 저장하기 위한 컬럼 추가
-- 자격증(certification)은 기존 acquired_date만 사용

ALTER TABLE public.trainings
  ADD COLUMN IF NOT EXISTS start_date TEXT,
  ADD COLUMN IF NOT EXISTS end_date TEXT;

COMMENT ON COLUMN public.trainings.start_date IS '교육 시작일 (YYYY-MM). education 타입에서 사용';
COMMENT ON COLUMN public.trainings.end_date IS '교육 수료일 (YYYY-MM). education 타입에서 사용';
