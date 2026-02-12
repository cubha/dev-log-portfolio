-- About 프로필 테이블 생성
-- About 페이지에 표시될 프로필 정보를 저장합니다.

CREATE TABLE IF NOT EXISTS public.about_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  main_copy TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  profile_image_url TEXT,
  story_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_about_profiles_user_id ON public.about_profiles(user_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.about_profiles ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view about profiles"
  ON public.about_profiles
  FOR SELECT
  USING (true);

-- 정책: 본인만 삽입 가능
CREATE POLICY "Users can insert their own profile"
  ON public.about_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 정책: 본인만 업데이트 가능
CREATE POLICY "Users can update their own profile"
  ON public.about_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 정책: 본인만 삭제 가능
CREATE POLICY "Users can delete their own profile"
  ON public.about_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- 코멘트 추가
COMMENT ON TABLE public.about_profiles IS 'About 페이지에 표시될 사용자 프로필 정보';
COMMENT ON COLUMN public.about_profiles.main_copy IS '메인 카피 (한 줄 요약)';
COMMENT ON COLUMN public.about_profiles.intro_text IS '서두 소개글';
COMMENT ON COLUMN public.about_profiles.profile_image_url IS '프로필 이미지 URL';
COMMENT ON COLUMN public.about_profiles.story_json IS '스토리 섹션 배열 (JSON 형태)';
