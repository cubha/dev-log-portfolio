# 프로필 관리 시스템 설정 가이드

## 1. 데이터베이스 설정

### Supabase 테이블 생성

Supabase SQL Editor에서 다음 명령을 실행하세요:

```sql
-- About 프로필 테이블 생성
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

-- RLS 활성화
ALTER TABLE public.about_profiles ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Anyone can view about profiles"
  ON public.about_profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.about_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.about_profiles FOR UPDATE 
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### Storage 버킷 설정

프로필 이미지는 기존 `project-images` 버킷을 재사용합니다.

**폴더 구조:**
```
project-images/
├── profile/              # 프로필 이미지 (자동 생성됨)
│   └── 1234567890-user.jpg
├── 1234567890-project1.jpg  # 프로젝트 썸네일
└── 1234567890-project2.jpg
```

**장점:**
- 버킷 관리 단순화 (하나의 버킷으로 통합)
- 자동으로 폴더가 생성되므로 별도 설정 불필요
- 권한 관리가 일관됨

> **참고:** 별도 버킷을 원하는 경우:
> 1. Supabase Dashboard → Storage
> 2. "Create bucket" → 이름: `profile-images`, Public 체크
> 3. 코드에서 `'project-images'` → `'profile-images'`로 변경

## 2. 타입 생성

타입이 자동으로 생성되도록 Supabase CLI를 실행하세요:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## 3. 사용 방법

### 관리자 페이지 접속

1. 관리자 계정으로 로그인
2. `/admin/profile` 페이지로 이동
3. 프로필 정보 입력:
   - 메인 카피 (한 줄 요약)
   - 서두 소개글
   - 프로필 이미지 업로드
   - 5가지 스토리 섹션 작성
4. "미리보기" 버튼으로 실시간 확인
5. "저장하기" 클릭

### 페이지 구조

```
/admin/profile          # 프로필 편집 페이지
  ├─ 왼쪽: 편집 폼
  └─ 오른쪽: 실시간 미리보기

/about                  # 공개 프로필 페이지 (TODO: 구현 필요)
```

## 4. 데이터 구조

### about_profiles 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | 기본 키 |
| `user_id` | UUID | 사용자 ID (유니크) |
| `main_copy` | TEXT | 메인 카피 |
| `intro_text` | TEXT | 서두 소개글 |
| `profile_image_url` | TEXT | 프로필 이미지 URL |
| `story_json` | JSONB | 스토리 섹션 배열 |
| `created_at` | TIMESTAMP | 생성 시간 |
| `updated_at` | TIMESTAMP | 수정 시간 |

### story_json 구조

```json
[
  {
    "id": "growth",
    "title": "성장 과정",
    "content": "...",
    "icon": "🌱"
  },
  {
    "id": "mindset",
    "title": "긍정적 마인드",
    "content": "...",
    "icon": "💡"
  },
  ...
]
```

## 5. 기능 목록

### ✅ 구현 완료
- [x] 관리자 프로필 편집 폼
- [x] 프로필 이미지 업로드 (드래그 앤 드롭)
- [x] 5가지 스토리 섹션 편집
- [x] 실시간 미리보기
- [x] Upsert 기능 (생성/수정 자동 판단)
- [x] 이미지 Storage 연동

### 📝 TODO
- [ ] `/about` 공개 페이지 구현
- [ ] 기존 프로필 데이터 불러오기 기능
- [ ] 프로필 이미지 삭제 기능
- [ ] 반응형 레이아웃 최적화

## 6. 주요 파일

```
src/
├── app/
│   └── admin/
│       └── profile/
│           └── page.tsx              # 관리자 편집 페이지
├── components/
│   └── admin/
│       └── ProfilePreview.tsx        # 실시간 미리보기
├── types/
│   └── profile.ts                    # 프로필 타입 정의
└── utils/
    └── profile/
        ├── upsertProfile.ts          # 프로필 저장 액션
        └── getProfile.ts             # 프로필 조회 액션
```

## 7. 트러블슈팅

### 이미지 업로드 실패
- Supabase Storage에서 `profile-images` 버킷이 Public인지 확인
- 파일 크기 제한: 5MB
- 지원 형식: JPG, PNG, GIF

### 저장 실패
- 관리자 권한 확인
- 필수 필드 입력 확인 (메인 카피, 서두 소개글)
- Supabase RLS 정책 확인

### 미리보기가 안 보임
- "미리보기" 버튼 클릭
- 브라우저 캐시 클리어

## 8. 다음 단계

1. **`/about` 페이지 구현**: 저장된 프로필을 표시하는 공개 페이지
2. **데이터 불러오기**: 기존 프로필이 있으면 폼에 자동 입력
3. **이미지 최적화**: Next.js Image 컴포넌트 최적화
4. **SEO 설정**: 메타 태그 및 OG 이미지 설정
