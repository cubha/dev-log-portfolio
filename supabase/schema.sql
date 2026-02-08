-- ============================================
-- Dev Log Portfolio Database Schema
-- ============================================
-- 이 파일은 Supabase SQL Editor에서 실행하세요.
-- Supabase Dashboard > SQL Editor > New Query에서 실행

-- ============================================
-- 1. Profiles 테이블 (사용자 프로필)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 2. Skills 테이블 (기술 스택)
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'frontend', 'backend', 'database', 'tool', 'language' 등
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 3. Projects 테이블 (프로젝트)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- 마크다운 형식의 상세 내용
  thumbnail_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[], -- 기술 스택 배열 (예: ['React', 'TypeScript', 'Next.js'])
  featured BOOLEAN DEFAULT FALSE, -- 주요 프로젝트 여부
  status TEXT DEFAULT 'completed', -- 'completed', 'in-progress', 'archived'
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 4. RLS (Row Level Security) 정책 설정
-- ============================================

-- Profiles 테이블: 모든 사용자가 읽기 가능, 본인만 수정 가능
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Skills 테이블: 모든 사용자가 읽기 가능
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- Projects 테이블: 모든 사용자가 읽기 가능, 본인만 수정 가능
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = profile_id);

-- ============================================
-- 5. 인덱스 생성 (성능 최적화)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ============================================
-- 6. 업데이트 시간 자동 갱신 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. 샘플 데이터 (선택사항)
-- ============================================
-- 필요시 아래 주석을 해제하여 샘플 데이터를 추가할 수 있습니다.

/*
-- 샘플 Skills 데이터
INSERT INTO skills (name, category) VALUES
  ('React', 'frontend'),
  ('TypeScript', 'language'),
  ('Next.js', 'frontend'),
  ('Node.js', 'backend'),
  ('PostgreSQL', 'database'),
  ('Tailwind CSS', 'frontend'),
  ('Supabase', 'tool');

-- 샘플 Projects 데이터 (실제 profile_id는 auth.users에서 가져와야 함)
-- INSERT INTO projects (profile_id, title, description, tech_stack, featured)
-- VALUES (
--   'your-user-id-here',
--   '포트폴리오 웹사이트',
--   'Next.js와 Supabase를 활용한 포트폴리오 웹사이트',
--   ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
--   true
-- );
*/
