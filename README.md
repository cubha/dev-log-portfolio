# 📚 Dev Log Portfolio

> 개인 포트폴리오 및 경력 관리 시스템

Next.js 15와 Supabase를 활용한 풀스택 포트폴리오 웹 애플리케이션입니다. 프로젝트, 기술 스택, 경력 등을 체계적으로 관리하고 공유할 수 있습니다.

---

## 🚀 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (JWT + Virtual Email) |
| **Middleware** | Next.js Middleware (경로 보호 + 역방향 가드) |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Animation** | Framer Motion |
| **State Management** | Jotai |
| **Type Safety** | Supabase CLI Generated Types |

---

## 📁 프로젝트 구조

> **참고**: 본 프로젝트는 `src/` 폴더 기반 구조를 사용합니다. 미들웨어를 포함한 모든 소스 코드가 `src/` 내부에 위치합니다.

```
dev-log-portfolio/
├── src/
│   ├── app/                          # 📄 Next.js App Router 페이지
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── page.tsx                  # 홈페이지 (/)
│   │   ├── error.tsx                 # 에러 바운더리
│   │   ├── about/
│   │   │   └── page.tsx              # About 페이지 (/about)
│   │   ├── projects/
│   │   │   └── page.tsx              # 프로젝트 리스트 (/projects)
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact 페이지 (/contact)
│   │   └── admin/                    # 🔐 관리자 영역
│   │       ├── layout.tsx            # 관리자 전용 레이아웃 (헤더+사이드바)
│   │       ├── login/
│   │       │   └── page.tsx          # 로그인 페이지 (/admin/login)
│   │       └── dashboard/
│   │           └── page.tsx          # 대시보드 (/admin/dashboard)
│   │
│   ├── components/                   # 🧩 재사용 컴포넌트
│   │   ├── common/
│   │   │   ├── BackButton.tsx        # '메인으로' 뒤로가기 버튼
│   │   │   └── FloatingAdminButton.tsx # 플로팅 유저 메뉴 (로그아웃 등)
│   │   ├── admin/
│   │   │   └── LogoutButton.tsx      # 로그아웃 버튼 (variant 지원)
│   │   ├── contact/
│   │   │   ├── ContactInfo.tsx       # 연락처 정보 카드
│   │   │   ├── InquiryForm.tsx       # 문의 작성 폼
│   │   │   ├── InquiryList.tsx       # 문의 목록 컨테이너
│   │   │   └── InquiryCard.tsx       # 문의 아이템 (Accordion UI)
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx       # 프로젝트 카드 UI
│   │   │   ├── ProjectList.tsx       # 프로젝트 리스트 (슬라이더 + 필터)
│   │   │   └── ProjectCardActions.tsx # 관리자 전용 카드 액션 (수정/삭제)
│   │   └── providers/
│   │       └── AuthStateInitializer.tsx # 서버 권한 정보를 Jotai atom에 동기화
│   │
│   ├── utils/                        # 🔧 유틸리티 함수
│   │   ├── supabase/
│   │   │   ├── server.ts             # 서버 컴포넌트용 Supabase 클라이언트
│   │   │   ├── client.ts             # 클라이언트 컴포넌트용 Supabase 클라이언트
│   │   │   └── middleware.ts         # JWT 검증 + 권한 검사 로직
│   │   ├── auth/
│   │   │   ├── login.ts              # 서버 액션: 로그인 처리
│   │   │   └── logout.ts             # 서버 액션: 로그아웃 처리
│   │   ├── inquiries/
│   │   │   ├── create.ts             # 문의 생성 (SHA-256 해싱)
│   │   │   ├── verify.ts             # 비밀번호 검증
│   │   │   └── delete.ts             # 문의 삭제
│   │   └── storage/
│   │       └── uploadImage.ts        # 이미지 업로드/삭제 (Supabase Storage)
│   │
│   ├── types/                        # 📝 TypeScript 타입 정의
│   │   ├── supabase.ts               # Supabase CLI로 생성된 DB 타입
│   │   └── database.ts               # 커스텀 타입 정의
│   │
│   ├── store/                        # 🗄️ 전역 상태 관리 (Jotai)
│   │   ├── authAtom.ts               # 인증 상태 (isAdmin, editingProject)
│   │   └── filterAtom.ts             # 프로젝트 필터 상태 (카테고리)
│   │
│   └── middleware.ts                 # 🔒 전역 미들웨어 (경로 보호 엔트리)
│
├── supabase/                         # 🗄️ Supabase 관련 파일
│   ├── schema.sql                    # 데이터베이스 스키마
│   └── migrations/
│       ├── 20260213_create_inquiries.sql  # 문의 테이블 생성
│       └── 20260214_alter_inquiries_add_columns.sql # 답변 컬럼 추가
│
├── .env.local                        # 🔐 환경 변수 (Git에서 제외됨)
└── package.json                      # 📦 의존성 관리
```

---

## 🎯 핵심 파일 설명

### 1. `src/app/` - 페이지 라우팅
Next.js 15의 App Router를 사용합니다. 각 폴더가 URL 경로가 됩니다.

- **`page.tsx`**: `/` (홈페이지)
- **`projects/page.tsx`**: `/projects` (프로젝트 리스트)
- **`error.tsx`**: 런타임 에러 처리 (무한 새로고침 방지)

### 2. `src/utils/supabase/` - Supabase 연결 설정
SSR(서버 사이드 렌더링)을 위한 Supabase 클라이언트입니다.

- **`server.ts`**: 서버 컴포넌트, 서버 액션, Route Handler에서 사용
- **`client.ts`**: 클라이언트 컴포넌트에서 사용 (`'use client'` 필요)
- **`middleware.ts`**: 세션 갱신 로직

```typescript
// 서버 컴포넌트에서 사용 예시
import { createClient } from '@/src/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*')
  // ...
}
```

### 3. `src/types/` - TypeScript 타입
Supabase의 테이블 구조와 완벽하게 동기화된 타입입니다.

- **`supabase.ts`**: Supabase CLI가 자동 생성한 타입
- **`database.ts`**: 커스텀 인터페이스 및 유틸리티 타입

타입은 자동 완성과 타입 체크를 제공하여 개발 생산성을 높입니다.

### 4. `src/middleware.ts` + `src/utils/supabase/middleware.ts` - 보안 게이트

2계층 구조로 모든 요청을 가로채 인증 및 권한을 검증합니다.

- **`src/middleware.ts`** (사령관): Next.js 엔트리 포인트, matcher 정의, `updateSession()` 호출
- **`src/utils/supabase/middleware.ts`** (실무자): JWT 검증, DB role 조회, 리다이렉트 처리

**보안 정책:**
- 정방향 가드: 비로그인 시 `/admin` 경로 차단 → `/login`
- 역방향 가드: 로그인 상태에서 `/login` 접근 → `/` (중복 로그인 방지)
- 권한 가드: `role !== 'admin'`인 유저의 `/admin` 접근 → `/`
- JWT 서버 검증: `supabase.auth.getUser()`로 토큰 위변조 불가
- DB 실시간 검증: `profiles` 테이블에서 실제 role 재조회

---

## 🗃️ 데이터베이스 스키마

### 주요 테이블

#### `profiles` - 사용자 프로필
- 사용자명, 이름, 아바타, 자기소개
- GitHub, LinkedIn, 웹사이트 링크

#### `projects` - 프로젝트
- 제목, 설명, 상세 내용
- 썸네일, 기술 스택 (배열)
- GitHub, 데모 URL
- 프로젝트 기간, 상태 (완료/진행중/보관)

#### `skills` - 기술 스택
- 기술명, 카테고리 (frontend/backend/database/tool/language)
- 아이콘 URL

#### `inquiries` - 문의 내역
- 제목, 내용, 비밀번호 해시 (SHA-256)
- 공개 여부 (`is_public`)
- 관리자 답변 (`reply`, `replied_at`)
- 작성일, 수정일

---

## 🛠️ 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 스키마 적용

**방법 1: Supabase Dashboard 사용 (권장)**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → SQL Editor
3. `supabase/schema.sql` 파일 내용을 복사하여 실행

**방법 2: Supabase CLI 사용**
```bash
# Supabase CLI 설치 (devDependency)
npm install

# 프로젝트 연결
npx supabase link --project-ref krnuicpyqlqhqeehdprd

# 스키마 적용
npx supabase db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 📋 주요 명령어

### 개발 & 빌드

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린터 실행
npm run lint
```

### Supabase 타입 생성

데이터베이스 스키마가 변경되면 타입을 업데이트해야 합니다:

```bash
# Supabase CLI로 타입 생성
npx supabase gen types typescript --project-id krnuicpyqlqhqeehdprd --schema public > src/types/supabase.ts
```

---

## 🎨 주요 기능

### ✅ 완료된 기능

- [x] Next.js 15 App Router 설정
- [x] Supabase SSR 연동 (서버/클라이언트/미들웨어)
- [x] TypeScript 타입 안정성 (Supabase CLI 생성 타입)
- [x] 에러 바운더리 (무한 새로고침 방지)
- [x] 프로젝트 리스트 페이지
  - [x] 가로 슬라이더 레이아웃 (3개 카드 + 양옆 피크 효과)
  - [x] 카테고리 필터링 (전체, 업무, 개인, 팀)
  - [x] 필터 필(Filter Pills) UI
  - [x] Framer Motion 셔플 애니메이션
  - [x] 드래그 & 스와이프 제스처 지원
  - [x] 피크 카드 클릭 이동
  - [x] 페이지네이션 도트
  - [x] 카드 높이 400px 고정
  - [x] 기술 스택 배지
  - [x] Empty State UI (권한별 조건부 렌더링)
  - [x] 반응형 디자인
- [x] 인증 시스템 (Supabase Auth 기반)
  - [x] ID(Virtual Email) + 비밀번호 로그인
  - [x] JWT 세션 관리 (서버 검증)
  - [x] 역할 기반 접근 제어 (admin/user)
  - [x] 역방향 가드 (로그인 시 /login 접근 차단)
- [x] 관리자 대시보드
  - [x] 전용 레이아웃 (헤더 + 사이드바)
  - [x] 통계 카드 (프로젝트/기술 스택)
  - [x] 미들웨어 경로 보호
- [x] UI/UX 최적화
  - [x] '메인으로' 네비게이션 버튼
  - [x] 플로팅 유저 메뉴 (로그아웃, 대시보드 바로가기)
  - [x] 관리자에게만 '프로젝트 추가' 버튼 노출
  - [x] 전체 페이지 Container 폭 통일 (max-w-4xl)
  - [x] 미니멀리즘 디자인 (70% 사이즈 축소, 정보 밀도 증가)
- [x] Contact 페이지 (문의 시스템)
  - [x] 2-Column 레이아웃 (Contact Info + 문의 작성)
  - [x] Blue-Purple 그라데이션 디자인 시스템
  - [x] Supabase inquiries 테이블 연동
  - [x] 문의 작성 (SHA-256 비밀번호 해싱)
  - [x] 공개/비공개 토글 기능
  - [x] Accordion UI 문의 목록
  - [x] 비밀번호 보호 (비공개 문의)
  - [x] 문의 삭제 기능
  - [x] 답변 상태 표시 (답변완료/대기중)

### 🚧 개발 예정

- [ ] 프로젝트 상세 페이지
- [ ] 프로젝트 CRUD (생성/수정/삭제)
- [ ] 프로필 관리
- [ ] 기술 스택 관리
- [ ] 마크다운 에디터
- [ ] 이미지 업로드
- [ ] 검색 기능

---

## 📌 현재 진행 상태

### Phase 1: 초기 설정 ✅
- Next.js 15 프로젝트 생성
- Tailwind CSS 설정
- 기본 폴더 구조 설정

### Phase 2: Supabase 연동 ✅
- `@supabase/ssr` 패키지 설치
- 서버/클라이언트/미들웨어 유틸리티 생성
- 연결 테스트 완료

### Phase 3: 데이터베이스 스키마 ✅
- `profiles`, `projects`, `skills` 테이블 설계
- RLS (Row Level Security) 정책 설정
- TypeScript 타입 생성 및 적용
- 프로젝트 리스트 페이지 구현

### Phase 4: 인증 및 보안 시스템 ✅
- Supabase Auth 기반 ID(Virtual Email) 로그인 구현
- JWT 서버 검증 + DB role 실시간 조회 미들웨어
- 역할별 경로 보호 (admin/user) 및 역방향 가드
- 관리자 대시보드 레이아웃 구축

### Phase 5: 핵심 기능 구현 🚧
- 진행 예정...

---

## 📅 최근 업데이트

## 🚀 2025-02-21 업데이트 내역

### 1. HeroSection 레이아웃 및 사이즈 조정

**File:** `src/components/home/HeroSection.tsx`

- **배경**: `max-w-5xl` 컨테이너 밖으로 이동 → 전체 뷰포트 너비로 표시
- **높이**: 전체 뷰포트 → `80vh`로 축소
- **크기**: 텍스트·Progress Bar·CTA 버튼 약 20% 확대
- **레이아웃**: 상단 정렬(`justify-start`), 패딩 조정

---

### 2. AIWorkflowSection 간격 조정

**File:** `src/components/home/AIWorkflowSection.tsx`

- 섹션 헤더·스텝·카드·그리드 간 `gap`·`margin` 확대

---

### 3. 홈페이지 레이아웃 구조 변경

**File:** `src/app/page.tsx`

- HeroSection을 `max-w-5xl` 밖으로 분리 → 전체 너비 배경 적용
- 메인 패딩·Footer 링크 간격 조정

---

## 🚀 2026-02-20 업데이트 내역

### 1. ThemeCard 공통 컴포넌트 디자인 전면 개편

**File:** `src/components/common/ThemeCard.tsx`

기존 글래스모피즘(Glass Morphism) 스타일에서 그라데이션 기반 미니멀 디자인으로 전환했습니다.

- **배경**: `bg-white/80 backdrop-blur-md` → `bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5`
- **테두리**: `border-brand-primary/20` → `border-brand-primary/10` (더 섬세한 경계선)
- **모서리**: `rounded-2xl` → `rounded-xl`
- **Sheen 오버레이 제거**: 상단 금속 광택 라인(`::before`) 제거로 구조 단순화
- **전파 범위**: `/about` 스토리, `/projects` 카드, `/contact` 정보/폼 전체 자동 반영

---

### 2. /about 페이지 Experience 섹션 구조 개선

**File:** `src/app/about/page.tsx`, `src/components/about/ExperienceTabsSection.tsx`

전체를 하나의 ThemeCard로 감싸던 방식에서, 개별 타임라인 아이템에 ThemeCard를 적용하는 방식으로 변경했습니다.

- `about/page.tsx`: `<ThemeCard noHoverLift className="mt-14 p-6 sm:p-8">` 래퍼 제거 → `<div className="mt-14">`로 교체
- `ExperienceTabsSection.tsx` `TimelineList`: 각 아이템 카드 `div` → `<ThemeCard noHoverLift className="p-5">`로 교체
- 타임라인 세로 선 및 Silver Dot은 기존 구조(`relative pl-10`) 그대로 유지
- framer-motion 등장 애니메이션과의 충돌 방지를 위해 `noHoverLift` 적용

---

### 3. /about 페이지 Skills 섹션 ThemeCard 통일

**File:** `src/components/about/SkillsSection.tsx`

Technical Skills 섹션의 기술 아이템들에 ThemeCard 그라데이션 테마를 적용했습니다.

- **Collapsed 뷰 (대표 기술 배지)**: 기존 `div` (`bg-background border-foreground/10`) → `<ThemeCard noHoverLift>` 교체
- **Expanded 뷰 (전체 카드 그리드)**: `motion.div` 클래스 → `THEME_CARD_CLASS` 적용
- framer-motion의 `cardVariants` 등장 애니메이션은 유지

---

### 4. Experience 요약 텍스트 스타일 간소화

**File:** `src/components/about/ExperienceTabsSection.tsx`

탭 상단의 경력/학력 요약 정보를 배경 박스에서 인라인 텍스트로 변경했습니다.

- **Before**: 그라데이션 배경 + 테두리가 있는 `SummaryBanner` 컴포넌트 (카드 형태)
- **After**: `flex items-center gap-2 text-sm font-medium text-foreground/55` 플레인 텍스트
- `panelVariants` 타입 오류 수정: `ease: 'easeOut'` → `ease: 'easeOut' as const` (Framer Motion `Easing` 타입 호환)

---

### 5. 교육/자격증 관리 — 교육 타입 날짜 범위 입력 지원

**Files:** `src/components/admin/TrainingManager.tsx`, `src/types/profile.ts`, `src/types/supabase.ts`, `src/utils/training/getTrainings.ts`  
**Migration:** `supabase/migrations/20260220_trainings_add_date_range.sql`

교육(`education`) 타입의 이력을 단일 날짜가 아닌 기간(from–to)으로 입력할 수 있도록 개선했습니다.



## 🚀 2026-02-19 업데이트 내역

### 1. Admin Skills 이름 입력 자동완성 구현

*   **`TechStackInput.tsx`**: `POPULAR_TECHS` 상수 `export` 처리 → 관리자 페이지 간 공유
*   **`admin/skills/page.tsx`**: 기술 이름 입력 필드에 자동완성 드롭다운 추가
    *   입력 시 `POPULAR_TECHS` 목록에서 실시간 필터링 (최대 7개)
    *   드롭다운 각 항목에 `SkillIcon` 아이콘 미리보기 표시
    *   항목 클릭 시 이름 자동 입력 + 드롭다운 닫힘
    *   외부 클릭 감지(`mousedown` 이벤트)로 드롭다운 자동 닫힘
    *   모달 닫기 시 자동완성 상태 초기화

---

### 2. Admin Dashboard 실버 메탈 테마 전체 동기화

#### AdminHeader / AdminSidebar 컴포넌트 분리 (신규)
*   **신규 파일**: `src/components/admin/AdminHeader.tsx`
    *   헤더 + 사이드바를 클라이언트 컴포넌트로 분리
    *   헤더 우측에 **ThemeToggle** 통합 → 관리자 페이지에서도 다크/라이트 전환 가능
    *   `usePathname` 기반 사이드바 활성 항목 자동 강조
*   **`admin/layout.tsx`**: 서버 컴포넌트로 유지하며 `AdminHeader` / `AdminSidebar` import로 리팩토링

#### 전역 CSS 변수 기반 테마 통일 (4개 페이지 + TechStackInput)
*   `bg-white` / `bg-gray-50` → `bg-background`
*   `border-gray-*` → `border-foreground/*` (불투명도 비율 적용)
*   `text-gray-*` → `text-foreground/*`
*   모든 `<input>` / `<textarea>` / `<select>`: `bg-background text-foreground placeholder:text-foreground/30 focus:ring-foreground/20`
*   저장/추가 버튼: `bg-silver-metal animate-shine text-white dark:text-slate-950`
*   취소 버튼: `bg-foreground/8 text-foreground/60`
*   테이블 헤더: `bg-foreground/3 border-foreground/8`
*   대시보드 빠른 액션 카드: 블루 그라데이션 → `bg-foreground/3 hover:bg-foreground/5` 메탈릭 스타일


## 🚀 2026-02-18 업데이트 내역

### 1. Phase 1: 디자인 시스템 정립

#### 폰트 교체 (Pretendard 적용)
*   **`globals.css`**: CDN `@import`로 Pretendard 정적 폰트 로드 (`cdn.jsdelivr.net`)
*   **`layout.tsx`**: `<body className="font-sans antialiased">` 적용 → 전역 폰트 통일
*   **`tailwind.config.ts`**: `fontFamily.sans`에 Pretendard Variable을 최우선으로 등록 (fallback: `-apple-system` → `Arial`)
*   기존 `globals.css`의 하드코딩 `font-family: Arial` 완전 제거

#### 브랜드 컬러 시스템 구축
*   **`tailwind.config.ts`** `theme.extend.colors`에 `brand` 시맨틱 컬러 추가:
    *   `brand.primary: '#2563EB'` (blue-600)
    *   `brand.secondary: '#9333EA'` (purple-600)
*   이제 `from-brand-primary`, `to-brand-secondary`, `text-brand-primary`, `bg-brand-secondary` 등 Tailwind 유틸리티 자동 생성

#### 하드코딩 색상 전면 교체 (15개 파일)
*   `from-blue-600 to-purple-600` → `from-brand-primary to-brand-secondary`
*   `text-blue-600` → `text-brand-primary`, `bg-blue-600` → `bg-brand-primary`
*   주요 파일: `Header.tsx`, `AboutCTA.tsx`, `FloatingAdminButton.tsx`, `ProjectDetailModal.tsx`, `admin/layout.tsx`, `login/page.tsx`, `admin/projects/page.tsx`, `admin/profile/page.tsx` 등 전체
*   hover 상태(`hover:from-blue-700`) → `hover:opacity-90`으로 일관 처리

---

### 2. UI/UX 폴리싱

#### 테두리 개선
*   `border-[0.5px]` 제거 → `border border-gray-100 shadow-sm rounded-2xl` 적용 (InquiryCard, InquiryForm, ContactInfo 등)

#### 입력 필드 개선
*   Input 높이 `h-11` (44px) 표준화
*   포커스 링: `focus:ring-brand-primary/30 focus:border-brand-primary` 적용

#### Toast 알림 도입 (alert() 전면 교체)
*   `sonner` 라이브러리 기반 토스트 알림 적용
*   `layout.tsx`에 `<Toaster richColors position="top-right" />` 전역 등록
*   12곳의 `alert()` / `window.confirm()` 결과 → `toast.success()` / `toast.error()`로 교체
    *   `ContactInfo.tsx`, `InquiryForm.tsx`, `InquiryCard.tsx`, `ProjectCardActions.tsx`

---

### 3. 서버 사이드 인증 유틸리티 (DRY 원칙 적용)

*   **신규 파일**: `src/utils/auth/serverAuth.ts`
*   `getCurrentUserRole()` 함수 구현:
    1.  `supabase.auth.getUser()` 호출
    2.  `profiles` 테이블에서 `role` 조회
    3.  `{ user, role, isAdmin }` 반환
*   `page.tsx`, `projects/page.tsx`, `about/page.tsx` 총 3개 페이지에서 중복 12줄 인증 코드 → 1줄 대체

---

### 4. Contact Info — DB 연동 및 인라인 에딧 기능

#### 데이터베이스 스키마 추가
*   **신규 테이블**: `contact_links`
    *   컬럼: `id`, `label`, `value`, `href`, `icon_key`, `is_copyable`, `sort_order`
    *   RLS: 공개 읽기 + 관리자만 수정
*   마이그레이션 파일: `src/utils/db/contact_links_migration.sql`
*   `src/types/supabase.ts`에 `contact_links` Row/Insert/Update 타입 추가
*   `src/types/contact.ts` 신규 생성 (`ContactLink`, `ActionResult` 편의 타입)

#### 아이콘 매핑 유틸리티
*   **신규 파일**: `src/utils/contact/iconMap.ts`
*   `ICON_MAP`: DB의 `icon_key` 문자열 → `react-icons` 컴포넌트 매핑 (`mail`, `phone`, `location`, `github`)
*   새 아이콘 추가 시 맵에만 항목 추가

#### 서버 액션
*   **신규 파일**: `src/actions/contact.ts`
*   `updateContactLink(id, data)`: 관리자 권한 검증 → DB 업데이트 → `revalidatePath('/contact')`

#### ContactInfo.tsx 완전 리팩토링
*   **Before**: 하드코딩 데이터, toast 없음
*   **After**: `initialData: ContactLink[]` + `isAdmin: boolean` props 기반
*   `useOptimistic` + `useTransition` 낙관적 UI: 저장 버튼 클릭 즉시 화면 반영
*   관리자 전용 인라인 에딧: 수정 아이콘 클릭 → Ghost Input 전환
*   `contact/page.tsx`: Server Component에서 `contact_links` fetch + `isAdmin` 전달

#### Contact Info 인라인 에딧 UI 개선 (Layout Shift 해결)
*   **Ghost Input** 적용 → border-b만 표시, padding 없음 → 기존 텍스트 자리 그대로 차지
*   **하단 버튼 제거** → 저장/취소 버튼을 헤더 우측 아이콘(`✕` / `✓`)으로 이동
*   **카드 높이 완전 고정** (`h-[350px]`): 에딧 모드 전환 시 height 변화 0
*   GitHub(href) 2줄 입력: `text-xs leading-4` 최소 공간으로 높이 증가 억제

---

### 5. 버그 수정

#### TypeScript 타입 불일치 해결 (`InquiryCard.tsx`)
*   **원인**: Supabase CLI 타입 재생성 후 `inquiries.is_public`이 `boolean | null`로 변경되었으나, `InquiryCardProps`는 `boolean` (non-nullable)로 선언되어 타입 에러 발생
*   **수정**: `InquiryCardProps.inquiry.is_public`을 `boolean | null`로 변경 → 런타임 동작 영향 없음 (`null`은 falsy 처리)

---

**주요 변경 파일:**
- `tailwind.config.ts` — 브랜드 컬러 + Pretendard 폰트 설정
- `src/app/globals.css` — Pretendard CDN, font-family 제거
- `src/app/layout.tsx` — font-sans 적용, Toaster 등록
- `src/utils/auth/serverAuth.ts` — 신규: 공통 인증 유틸리티
- `src/utils/contact/iconMap.ts` — 신규: 아이콘 매핑
- `src/utils/db/contact_links_migration.sql` — 신규: DB 마이그레이션
- `src/actions/contact.ts` — 신규: Contact 서버 액션
- `src/types/contact.ts` — 신규: Contact 편의 타입
- `src/types/supabase.ts` — contact_links 타입 추가
- `src/app/contact/page.tsx` — DB fetch + 권한 전달
- `src/components/contact/ContactInfo.tsx` — 전면 리팩토링 (DB 연동 + 인라인 에딧)
- `src/components/contact/InquiryCard.tsx` — is_public 타입 수정
- 전체 15개 파일 — 하드코딩 색상 → brand 변수 교체


## 🚀 2026-02-14 업데이트 내역

### 1. Contact 페이지 전면 리뉴얼 (트렌디 디자인 시스템)
*   **Silver SH 톤앤매너 기반 디자인**: 깔끔한 화이트 베이스에 Blue-Purple 그라데이션 포인트 컬러를 적용한 세련된 무드 연출
*   **2-Column 레이아웃 구조**:
    *   상단 섹션: Contact Info (좌측) + 문의 작성 폼 (우측)
    *   하단 섹션: 문의내역 리스트 (전체 너비)
*   **그라데이션 포인트 적용**:
    *   아이콘, 타이틀 바, 제출 버튼에 Blue-Purple 그라데이션 적용
    *   호버 시 부드러운 글로우 효과
    *   공개/비공개 토글 스위치에 그라데이션 적용

### 2. 문의 시스템 Full Stack 구현
*   **Supabase `inquiries` 테이블 연동**:
    *   제목, 내용, 비밀번호, 공개 여부, 답변 상태 관리
    *   SHA-256 기반 비밀번호 해싱
    *   `reply`, `replied_at` 컬럼 추가 (관리자 답변 기능 준비)
*   **비밀번호 보호 기능**:
    *   비공개 문의 클릭 시 비밀번호 모달 표시
    *   자물쇠 아이콘 및 '비공개' 배지 UI
    *   서버 사이드 비밀번호 검증 (`verify.ts`)
*   **Accordion UI 문의 내역**:
    *   클릭 시 내용이 펼쳐지는 아코디언 방식
    *   답변 상태 아이콘 (답변완료: 그라데이션 체크, 대기중: 회색 시계)
    *   문의 삭제 기능 (비밀번호 검증 후)

### 3. 미니멀리즘 디자인 최적화
*   **정보 밀도 증가 (70% 사이즈 축소)**:
    *   모든 카드 요소의 패딩, 폰트, 아이콘 사이즈 축소
    *   Contact Info와 문의 작성 카드 고정 높이 350px 적용
    *   내부 스크롤 제거, 콘텐츠가 카드 내에 딱 맞게 조정
*   **불필요한 장식 제거**:
    *   설명 문구, 지원 텍스트 최소화
    *   핵심 정보만 표시 (제목, 필수 입력 필드)
*   **공개 여부 토글 배치 최적화**:
    *   토글을 카드 타이틀 우측으로 이동
    *   그라데이션 스위치 디자인 적용

### 4. 전체 페이지 레이아웃 통일
*   **Container 폭 통일 (`max-w-4xl`)**:
    *   홈(`/`), About(`/about`), Projects(`/projects`), Contact(`/contact`) 페이지 모두 동일한 컨테이너 폭 적용
    *   일관된 시각적 경험 제공
*   **상단 여백 최적화**:
    *   전체 페이지 콘텐츠를 상단에 더 가깝게 배치
    *   `pt-24`로 헤더와의 간격 통일
*   **Title 및 설명 텍스트 사이즈 축소**:
    *   페이지 타이틀: `text-4xl` → `text-3xl`
    *   섹션 타이틀: `text-2xl` → `text-xl`
    *   설명 텍스트: `text-lg` → `text-sm`
    *   그라데이션 바 높이: `h-6` → `h-5`

### 5. Projects 페이지 카드 사이즈 조정
*   **Container 축소에 따른 슬라이더 최적화**:
    *   카드 크기: 350px×400px → 240px×300px
    *   카드 간격: 20px → 16px
    *   피크 비율: 18% → 20% (양옆 미리보기 강화)
*   **카드 내부 요소 축소**:
    *   썸네일 높이: 160px → 112px
    *   아이콘 크기: 64px → 40px
    *   패딩: 20px → 14px
    *   폰트 사이즈 전반적 축소
    *   버튼, 배지, 날짜 등 모든 요소 비례 축소

### 6. About 페이지 텍스트 사이즈 조정
*   **메인 타이틀**: `clamp(1rem, 3vw, 2rem)` → `clamp(0.875rem, 2.5vw, 1.5rem)`
*   **서브 텍스트**: `text-lg` → `text-sm`
*   **'About Me' 섹션 타이틀**: `text-3xl` → `text-2xl`
*   **스토리 카드**:
    *   타이틀: `text-xl` → `text-base`
    *   아이콘: `text-2xl` → `text-lg`
    *   내용: 기본 → `text-sm`

### 7. 버그 수정 및 트러블슈팅
*   **Supabase 스키마 불일치 해결**:
    *   코드에서 `password_hash` 사용 → 실제 DB는 `password` 컬럼
    *   모든 파일에서 컬럼명 통일 (`create.ts`, `delete.ts`, `verify.ts`, `supabase.ts`)
*   **Linter 오류 수정**:
    *   InquiryCard.tsx의 절대 경로 import → 상대 경로로 변경
    *   모든 편집 파일 린트 에러 해결 확인

---

**주요 변경 파일:**
- `src/app/contact/page.tsx` - Contact 페이지 메인 레이아웃
- `src/components/contact/ContactInfo.tsx` - 연락처 정보 카드
- `src/components/contact/InquiryForm.tsx` - 문의 작성 폼
- `src/components/contact/InquiryList.tsx` - 문의 목록 컨테이너
- `src/components/contact/InquiryCard.tsx` - 문의 아이템 (Accordion)
- `src/utils/inquiries/create.ts` - 문의 생성 유틸리티
- `src/utils/inquiries/verify.ts` - 비밀번호 검증 유틸리티
- `src/utils/inquiries/delete.ts` - 문의 삭제 유틸리티
- `src/types/supabase.ts` - Supabase 타입 정의 업데이트
- `supabase/migrations/20260213_create_inquiries.sql` - inquiries 테이블 생성
- `src/app/page.tsx` - 홈페이지 레이아웃 조정
- `src/app/about/page.tsx` - About 페이지 레이아웃 조정
- `src/app/projects/page.tsx` - Projects 페이지 레이아웃 조정
- `src/components/projects/ProjectList.tsx` - 프로젝트 슬라이더 상수 조정
- `src/components/projects/ProjectCard.tsx` - 프로젝트 카드 크기 축소
- `src/components/about/AboutContent.tsx` - About 페이지 텍스트 크기 조정

## 🚀 2026-02-13 업데이트 내역

### 1. UI/UX 디자인 고도화 (Apple 스타일 미니멀리즘)
*   **히어로 섹션 재구축**: `h-screen` 기반의 풀스크롤 레이아웃을 적용하여 첫 화면의 몰입감을 극대화했습니다.
*   **한 줄 미학(One-line Aesthetic)**: 메인 타이틀에 `whitespace-nowrap`과 `clamp` 폰트 시스템을 적용하여 모든 해상도에서 깨짐 없이 한 줄로 유지되도록 설계했습니다.
*   **프로필 인터랙션**: 인스타그램 스타일의 얇은 실선 테두리와 마우스 호버 시 부드럽게 확대되는 애니메이션을 추가했습니다.
*   **서브타이틀 최적화**: 자간(`letter-spacing`)을 넓게 설정하여 고급스러운 개방감을 구현하고 가독성을 높였습니다.

### 2. 브랜드 아이덴티티 강화
*   **신규 로고 시스템**: 기존의 아이콘 형태에서 탈피하여 **"Silver SH"** 텍스트와 그라데이션 아이콘 박스가 결합된 프로페셔널 로고를 적용했습니다.
*   **메인 컬러 시스템**: 프로젝트 전반에 파란색-보라색 그라데이션을 일관되게 적용하여 통일감을 부여했습니다.

### 3. 기술 스택 시각화 및 자동화
*   **아이콘 매핑 유틸리티 분리**: `src/utils/techIcons.ts`를 신설하여 100여 개의 기술 스택 아이콘(Simple Icons)을 중앙 관리하도록 구조화했습니다.
*   **지능형 매칭 로직**: 기술명에서 공백, 특수문자, 숫자를 제거하고 소문자로 정규화하여 "Next.js 15"와 같은 명칭도 "nextjs" 아이콘과 정확히 매칭되도록 개선했습니다.
*   **프로젝트 상세 모달**: 텍스트로만 나열되던 기술 스택에 브랜드 공식 컬러가 포함된 아이콘 뱃지를 추가하여 시각적 전달력을 높였습니다.

### 4. 레이아웃 버그 수정 및 최적화
*   **슬라이더 렌더링 수정**: 프로젝트 카드가 3개 미만일 때 hover 시 불필요한 세로 스크롤이 발생하거나 그림자가 잘리던 현상을 `overflow-x: clip` 설정을 통해 해결했습니다.
*   **여백 및 위계 조정**: 히어로 섹션과 하단 콘텐츠 간의 간격을 최적화하여 시각적 피로도를 줄였습니다.

---

**주요 변경 파일:**
- `src/components/about/AboutContent.tsx`
- `src/components/layout/Header.tsx`
- `src/utils/techIcons.ts`
- `src/components/projects/ProjectDetailModal.tsx`

### 2026-02-10 (화) 업데이트 내역

#### ✅ 완료된 작업
1. **프로젝트 리스트 UI 전면 개편: 가로 슬라이더 방식으로 변경**
   - 기존 그리드 레이아웃을 프리미엄 갤러리 스타일의 가로 슬라이더로 전환
   - 한 화면에 3개의 메인 카드를 표시하고, 양옆에 다음/이전 카드가 18%씩 피크(Peek) 효과로 노출
   - 피크 카드는 `opacity: 0.3`, `scale: 0.9`로 '보일락 말락'한 느낌 구현
   - 드래그 & 스와이프 제스처 지원 (모바일/데스크톱 모두 지원)
   - 피크 카드 클릭 시 해당 방향으로 슬라이드 이동 (화살표 버튼 제거로 더 직관적인 UX)

2. **카테고리 필터링 시스템 구축**
   - `src/store/filterAtom.ts` 생성: Jotai 기반 전역 필터 상태 관리
   - 필터 옵션: '전체', '업무', '개인', '팀'
   - 필터 필(Filter Pills) UI 구현:
     - 선택된 필터는 브랜드 그라데이션 배경색 (blue-600 → purple-600)
     - 호버 시 `y: -2` 애니메이션으로 떠오르는 효과
     - 활성 인디케이터 dot이 `layoutId`로 스프링 애니메이션
   - 필터 변경 시 슬라이더 자동 리셋 (첫 번째 카드로 이동)

3. **Framer Motion 기반 셔플 애니메이션**
   - `AnimatePresence mode="popLayout"`로 카드 추가/삭제 감지
   - 각 카드에 `layout` 속성 부여로 자동 위치 재배치
   - 스프링 물리 기반 애니메이션 (`stiffness: 250, damping: 25`)
   - 필터 변경 시 카드들이 '자석처럼 찰칵' 재배치되는 감성 구현

4. **카드 높이 균일화 및 레이아웃 최적화**
   - 모든 프로젝트 카드를 `h-[400px]`로 엄격하게 고정
   - 카드 내부를 `flex flex-col` 구조로 재구성
   - 설명 부분에 `flex-grow` 적용하여 가변 길이 흡수
   - 기술 스택 최대 3개만 표시 (컴팩트한 디자인)
   - 날짜/링크 버튼을 `mt-auto`로 항상 하단 고정
   - 내용이 적어도 모든 카드의 하단 정보가 동일한 라인에 정렬

5. **페이지네이션 도트 시스템**
   - 슬라이더 하단에 현재 페이지를 나타내는 도트 추가
   - 활성 도트는 가로로 길쭉하게 (`w-10 h-3`) 강조
   - `layoutId="activeDot"`로 도트 간 스프링 애니메이션
   - 도트 클릭 시 해당 페이지로 즉시 이동
   - 마지막 페이지 도트 동기화 버그 수정 (maxIndex 도달 시 올바른 페이지 표시)

6. **버그 수정 및 UX 개선**
   - 페이지네이션 도트 hover 시 Y 스크롤 발생 문제 해결:
     - `whileHover={{ scale: 1.2 }}` 제거 (framer-motion 애니메이션이 레이아웃에 영향)
     - CSS `hover:scale-110`로 변경하여 브라우저 최적화된 transform 사용
     - 컨테이너에 `py-2` 추가로 여유 공간 확보
   - 마지막 페이지 도트 동기화 로직 개선:
     - `currentIndex >= maxIndex`일 때 무조건 마지막 페이지로 처리
     - 프로젝트 개수가 3의 배수가 아닐 때도 정확한 페이지 표시

7. **기술 스택 추가**
   - Framer Motion: 고급 애니메이션 및 제스처 처리
   - Jotai: 경량 전역 상태 관리 (필터 상태)

8. **이미지 업로드 기능 구현 (Supabase Storage 연동)**
   - 클라이언트 Supabase 인스턴스 생성 (`src/utils/supabase/client.ts`):
     - `@supabase/ssr`의 `createBrowserClient`로 브라우저 환경에서 Storage API 사용
   - 이미지 업로드/삭제 유틸리티 함수 (`src/utils/storage/uploadImage.ts`):
     - `uploadImage()`: 파일을 `project-images` 버킷에 업로드하고 Public URL 반환
     - 타임스탬프 기반 고유 파일명 생성 (`Date.now() + '-' + sanitized_filename`)
     - `deleteImage()`: Public URL에서 파일 경로 추출 후 Storage에서 삭제
   - 프로젝트 등록/수정 폼 업로드 UI (`src/app/admin/projects/page.tsx`):
     - 파일 선택 input + 미리보기 기능
     - 이미지 타입/크기 검증 (이미지만 허용, 최대 5MB)
     - 미리보기 이미지에 hover 시 X 버튼으로 제거 가능
     - 수정 모드에서 기존 `thumbnail_url` 자동 로드 및 미리보기
     - `handleSubmit` 시 새 이미지가 선택되었으면 업로드 후 URL을 DB에 저장
     - 기존 URL 유지 로직 (이미지 미선택 시 기존 값 보존)
   - Next.js 이미지 최적화 설정 (`next.config.js`):
     - `images.remotePatterns`에 Supabase Storage 호스트 (`*.supabase.co`) 추가
     - `next/image`가 외부 이미지를 안전하게 로드할 수 있도록 설정

9. **Drag & Drop 이미지 업로드 추가**
   - 파일 처리 로직 공통화:
     - 기존 `handleFileSelect`의 검증/미리보기 코드를 `processSelectedFile(file)` 함수로 분리
     - 클릭 업로드와 드롭 업로드가 동일한 검증 흐름 사용
   - 드래그 상태 관리 추가:
     - `isDragging` state로 드롭존 강조 스타일 제어
     - `onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop` 이벤트 핸들러 구현
     - `preventDefault()`로 브라우저 기본 파일 열기 동작 차단
   - 드롭존 UI 구성:
     - 이미지 선택 영역을 드롭존 컨테이너로 확장
     - 드래그 중 `border-blue-500`, `bg-blue-50`로 시각적 피드백
     - "또는 이 영역으로 이미지를 드래그해서 놓아주세요" 안내 문구 추가
     - 기존 클릭 업로드 방식과 완전히 공존

10. **버그 수정 및 UX 개선**
    - `next/image` 외부 호스트 에러 해결:
      - 문제: Supabase Storage URL이 `next.config.js`에 미등록되어 이미지 로드 실패
      - 해결: `remotePatterns`에 와일드카드 패턴 (`*.supabase.co`) 추가
    - 이미지 제거 후 재선택 불가 버그 수정:
      - 문제: X 버튼으로 이미지 제거 후 동일 파일 재선택 시 `onChange` 이벤트 미발생
      - 원인: 브라우저는 `<input type="file">`의 `value`가 동일하면 이벤트를 무시
      - 해결: `handleRemoveImage`에서 `fileInput.value = ''`로 input 초기화

#### 🎯 주요 개선 사항
- **사용자 경험**: 그리드 → 슬라이더로 전환하여 더 몰입감 있는 프로젝트 탐색
- **시각적 피드백**: 피크 효과와 부드러운 애니메이션으로 프리미엄 느낌
- **직관적 네비게이션**: 화살표 없이도 피크 카드 클릭만으로 자연스러운 이동
- **일관된 디자인**: 모든 카드가 동일한 높이로 깔끔한 레이아웃 유지
- **완전한 이미지 관리**: Supabase Storage 연동으로 이미지 업로드/삭제/미리보기 기능 완성
- **향상된 업로드 UX**: 클릭 + Drag & Drop 동시 지원으로 더 편리한 파일 선택

### 2026-02-09 (월) 업데이트 내역

#### ✅ 완료된 작업
1. **UI 개선: 프로젝트 페이지 내비게이션 추가**
   - 프로젝트 페이지 상단에 '메인으로' 뒤로가기 버튼 추가
   - Lucide-react의 `ArrowLeft` 아이콘 사용
   - Next.js의 `Link` 컴포넌트로 서버 컴포넌트 구조 유지
   - Tailwind CSS로 호버 시 배경색 변화 및 좌측 이동 애니메이션 적용
   - 아이콘 pulse 애니메이션으로 직관적인 UX 제공
   - 에러, Empty State, 정상 상태 모든 케이스에서 뒤로가기 버튼 표시

2. **코드 리팩토링: 컴포넌트 구조 최적화**
   - 중복 코드 제거 (레이아웃 코드 4곳 → 1곳)
   - 단일 return 문으로 메인 페이지 로직 통합
   - 공통 컴포넌트 분리:
     - `src/components/common/BackButton.tsx` - 뒤로가기 버튼
     - `src/components/projects/ProjectCard.tsx` - 프로젝트 카드
   - 페이지 내부 서브 컴포넌트: `ErrorState`, `EmptyState`, `ProjectList`
   - 타입 안전성 유지 (Database 타입 활용)
   - 가독성 및 유지보수성 향상

3. **관리자 페이지 구조 생성**
   - 관리자 영역을 `src/app/admin/` 폴더로 구성
   - 관리자 전용 레이아웃 생성 (`src/app/admin/layout.tsx`):
     - 상단 헤더 (타이틀, 메인으로 이동, 로그아웃 버튼)
     - 사이드바 네비게이션 (대시보드, 프로젝트 관리)
     - 관리 도구 느낌의 깔끔한 디자인
   - 대시보드 메인 페이지 (`src/app/admin/dashboard/page.tsx`):
     - 통계 카드 3개 (전체 프로젝트, 기술 스택, 주요 프로젝트)
     - Supabase count 쿼리로 실시간 통계 표시
     - 빠른 액션 버튼 (프로젝트 관리, 기술 스택 관리)
   - 로그인 페이지 (`src/app/admin/login/page.tsx`):
     - 레이아웃이 적용되지 않는 독립적인 페이지
     - 사용자 ID/비밀번호 입력 폼
     - 비밀번호 표시/숨김 토글 기능
     - 로딩 상태 및 에러 처리
   - 모든 페이지 Next.js 15 규격 준수 및 한글 주석 작성

4. **Supabase Auth 기반 인증 시스템 구축**
   - 서버 액션 로그인 (`src/utils/auth/login.ts`):
     - `user_id`를 Virtual Email(`userId@portfolio.local`)로 변환하여 Supabase Auth 연동
     - `supabase.auth.signInWithPassword()`로 JWT 세션 자동 생성
     - `profiles` 테이블에서 role 조회 후 반환
     - role에 따른 리다이렉트 (admin → 대시보드, user → 메인)
   - **미들웨어 보안 체계** (`src/middleware.ts` → `src/utils/supabase/middleware.ts` 위임):
     - JWT 서버 검증: `supabase.auth.getUser()`로 토큰 위변조 원천 차단
     - DB 실시간 role 조회: `profiles` 테이블에서 최신 권한 확인
     - 정방향 가드: 비로그인 시 `/admin` 경로 → `/login` 리다이렉트
     - 역방향 가드: 로그인 상태에서 `/login` 접근 → `/` 리다이렉트 (중복 로그인 방지)
     - 권한 가드: `role !== 'admin'`인 유저의 `/admin` 접근 → `/` 차단
     - 한글 콘솔 로그로 디버깅 용이성 확보
   - 로그아웃 기능 (`src/utils/auth/logout.ts`):
     - `supabase.auth.signOut()`으로 JWT 세션 파기 후 `/login` 리다이렉트

5. **UI/UX 최적화**
   - `/projects` 페이지 Empty State 조건부 렌더링:
     - 관리자: "프로젝트 추가하기" 버튼 노출 → `/admin/projects` 연결
     - 일반 유저: "프로젝트가 곧 업데이트될 예정입니다" 안내 메시지
   - 불필요한 전역 상단 패널 제거, '메인으로' 버튼 중심의 깔끔한 네비게이션 유지
   - 플로팅 유저 메뉴 (`FloatingUserButton`) 도입:
     - 로그인한 모든 유저에게 화면 우측 하단 고정 표시
     - 관리자: 대시보드 바로가기 + 로그아웃
     - 일반 유저: 로그아웃만 표시
     - 클릭 시 펼쳐지는 메뉴 + 토글 애니메이션

6. **코드 정비 및 정리**
   - `middleware.ts`를 프로젝트 루트에서 `src/middleware.ts`로 이동
   - 로그인 입력 필드를 `email` → `userId`로 변경
   - 불필요한 파일/로직 제거 및 전체 프로젝트 감사 완료

### 2026-02-08 (토) 업데이트 내역

#### ✅ 완료된 작업
1. **Supabase CLI 설치 및 타입 시스템 구축**
   - Supabase CLI 설치 (`supabase` devDependency 추가)
   - TypeScript 타입 정의 자동 생성 (`src/types/supabase.ts`)
   - Database 타입을 Supabase 클라이언트에 주입하여 완벽한 타입 안정성 확보

2. **Supabase SSR 유틸리티 설정**
   - `@supabase/ssr` 기반의 서버/클라이언트/미들웨어 유틸리티 완성
   - Next.js 15의 async `cookies()` 처리 적용
   - 세션 자동 갱신 미들웨어 구현

3. **프로젝트 리스트 페이지 구현**
   - `/projects` 라우트 생성 및 기본 레이아웃 완성
   - Supabase `projects` 테이블과 DB 연동 성공
   - 카드 그리드 레이아웃, 기술 스택 배지, Empty State UI 구현
   - 반응형 디자인 적용 (모바일/태블릿/데스크탑)

4. **에러 처리 강화**
   - 에러 바운더리 컴포넌트 추가 (`src/app/error.tsx`)
   - try-catch 블록으로 런타임 오류 처리
   - 무한 새로고침 문제 해결

5. **프로젝트 구조 최적화**
   - `app/` 폴더를 `src/app/`으로 통합
   - 불필요한 파일 정리 (test 페이지, 구 lib 폴더 등)
   - Tailwind CSS 경로 설정 수정 (`src/app` 경로 추가)

6. **문서화**
   - README.md 전면 개편 (프로젝트 구조, 사용법, 트러블슈팅)
   - SUPABASE_CLI_SETUP.md 가이드 작성
   - 코드 주석 한글화

7. **GitHub 배포**
   - GitHub Private Repository 초도 배포 완료

#### 🎯 다음 작업 예정
- 프로젝트 상세 페이지 구현
- 프로젝트 CRUD 기능 (생성/수정/삭제)
- 사용자 인증 시스템 (로그인/회원가입)

---

## 🔧 트러블슈팅

### 무한 새로고침 문제
- **원인**: Next.js 15의 에러 컴포넌트 누락
- **해결**: `src/app/error.tsx` 파일 생성으로 해결

### Tailwind CSS 스타일 미적용
- **원인**: `src/app` 경로가 `tailwind.config.ts`에 없음
- **해결**: `content` 배열에 `"./src/app/**/*.{js,ts,jsx,tsx,mdx}"` 추가

### 타입 오류
- **원인**: Supabase 타입이 오래됨
- **해결**: `npx supabase gen types ...` 명령어로 타입 재생성

---

## 📚 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 용도로 제작되었습니다.

---

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ using Next.js 15 and Supabase**
