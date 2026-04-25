# 📚 Dev Log Portfolio

> 개인 포트폴리오 및 경력 관리 시스템

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://dev-log-portfolio-y2sl.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)

Next.js 15와 Supabase를 활용한 풀스택 포트폴리오 웹 애플리케이션입니다.
프로젝트, 기술 스택, 경력, 방명록, Live Status 등을 통합 관리합니다.

🌐 **배포 URL**: [https://dev-log-portfolio-y2sl.vercel.app](https://dev-log-portfolio-y2sl.vercel.app)

---

## 🚀 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript Strict Mode |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (JWT + Virtual Email + GitHub OAuth) |
| **Middleware** | Next.js Middleware (경로 보호 + 역방향 가드) |
| **Styling** | Tailwind CSS 3.4.1 |
| **Icons** | Lucide React + Simple Icons |
| **Animation** | Framer Motion |
| **State Management** | Jotai |
| **Theme** | next-themes |
| **Toast** | Sonner |
| **Rich Text Editor** | Tiptap 3 (StarterKit + Table + Link + Markdown) |
| **MDX** | @mdx-js/mdx 3 + remark-gfm + rehype-shiki |
| **Deployment** | Vercel (GitHub main 브랜치 자동 배포) |
| **Type Safety** | Supabase CLI Generated Types |

---

## 📁 프로젝트 구조

> **참고**: 본 프로젝트는 `src/` 폴더 기반 구조를 사용합니다. 미들웨어를 포함한 모든 소스 코드가 `src/` 내부에 위치합니다.

```
dev-log-portfolio/
├── src/
│   ├── app/                          # 📄 Next.js App Router 페이지
│   │   ├── layout.tsx                # 루트 레이아웃 (Toaster, Provider 포함)
│   │   ├── page.tsx                  # 홈페이지 (/)
│   │   ├── template.tsx              # 페이지 트랜지션 (fade-up)
│   │   ├── error.tsx                 # 에러 바운더리 (무한 새로고침 방지)
│   │   ├── loading.tsx               # 전역 로딩 스켈레톤
│   │   ├── about/
│   │   │   └── page.tsx              # About 페이지 (/about)
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact 페이지 (/contact) — 방명록 + 댓글
│   │   ├── projects/
│   │   │   └── page.tsx              # 프로젝트 리스트 (/projects)
│   │   ├── login/
│   │   │   └── page.tsx              # 로그인 페이지 (/login)
│   │   ├── auth/
│   │   │   └── callback/route.ts     # GitHub OAuth 콜백 처리
│   │   ├── api/                      # 🔌 Route Handlers
│   │   │   ├── github/stats/         # GitHub 30일 커밋 통계 (GraphQL)
│   │   │   ├── spotify/now-playing/  # Spotify 현재 재생 트랙
│   │   │   ├── mdx/[slug]/           # MDX → HTML 변환 (모달 인라인 뷰)
│   │   │   └── page-view/route.ts    # 방문 기록 수집 (POST, visitor_id + path)
│   │   └── admin/                    # 🔐 관리자 영역
│   │       ├── layout.tsx            # 관리자 전용 레이아웃 (AdminHeader + 사이드바)
│   │       ├── dashboard/page.tsx    # 대시보드 (/admin/dashboard)
│   │       ├── projects/page.tsx     # 프로젝트 CRUD (/admin/projects)
│   │       ├── skills/page.tsx       # 기술 스택 관리 (/admin/skills)
│   │       └── profile/page.tsx      # 프로필 관리 (/admin/profile)
│   │
│   │   ├── blog/                     # 📝 기술 블로그
│   │   │   ├── page.tsx              # 블로그 목록 (/blog) — 관리자: 전체 포스트 + 인라인 CRUD
│   │   │   ├── [slug]/page.tsx       # 블로그 상세 (/blog/[slug])
│   │   │   ├── new/page.tsx          # 새 글 작성 (/blog/new, 관리자 전용)
│   │   │   └── edit/[id]/page.tsx    # 글 수정 (/blog/edit/[id], 관리자 전용)
│   │
│   ├── components/                   # 🧩 재사용 컴포넌트
│   │   ├── common/
│   │   │   ├── AuthPanel.tsx         # 인증 패널 (로그인/OAuth 상태 표시)
│   │   │   ├── DynamicToaster.tsx    # SSR 호환 Sonner Toaster (useState+useEffect)
│   │   │   ├── FloatingAdminButton.tsx # 플로팅 유저 메뉴 (대시보드 바로가기·로그아웃)
│   │   │   ├── Logo.tsx              # Silver SH 브랜드 로고
│   │   │   ├── PageViewTracker.tsx   # 방문 자동 기록 (useEffect → /api/page-view)
│   │   │   ├── ScrollToTop.tsx       # 스크롤 상단 이동 버튼
│   │   │   ├── SilverButton.tsx      # 실버 메탈 공통 버튼 (size, fullWidth prop)
│   │   │   ├── SkillIcon.tsx         # 기술 스택 아이콘 (Simple Icons 기반)
│   │   │   ├── StatusBadge.tsx       # 상태 뱃지 공통 컴포넌트 (서버 컴포넌트)
│   │   │   ├── ThemeCard.tsx         # 그라데이션 기반 미니멀 카드
│   │   │   └── ThemeToggle.tsx       # 다크/라이트 모드 토글
│   │   ├── admin/
│   │   │   ├── AdminHeader.tsx       # 관리자 헤더 + 사이드바 (클라이언트)
│   │   │   ├── LogoutButton.tsx      # 로그아웃 버튼
│   │   │   ├── TrainingManager.tsx   # 교육/자격증 관리
│   │   │   └── ...                  # (InquiryReplyCard 제거됨)
│   │   ├── blog/                     # 블로그 UI 컴포넌트
│   │   │   ├── BlogList.tsx          # 목록 + 검색/태그 필터 + 관리자 상태 필터/액션
│   │   │   ├── BlogEditForm.tsx      # 글 작성/수정 폼 (편집·미리보기 탭)
│   │   │   ├── MarkdownPreview.tsx   # MDX 클라이언트 미리보기 (@mdx-js/mdx evaluate)
│   │   │   ├── PostNavigation.tsx    # 이전/다음글 + 전체 글 목록 패널
│   │   │   ├── TableOfContents.tsx   # TOC 사이드바 (IntersectionObserver)
│   │   │   ├── ReadingProgressBar.tsx # 읽기 진행바
│   │   │   └── GiscusComments.tsx    # Giscus GitHub 댓글
│   │   ├── home/                     # 홈페이지 섹션 컴포넌트
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AIWorkflowSection.tsx
│   │   │   └── ...
│   │   ├── about/                    # About 페이지 컴포넌트
│   │   │   ├── AboutContent.tsx
│   │   │   ├── ExperienceTabsSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   └── ...
│   │   ├── contact/
│   │   │   ├── ContactInfo.tsx       # 연락처 정보 (DB 연동 + 인라인 에딧)
│   │   │   ├── LiveStatusWidget.tsx  # Spotify·GitHub 라이브 상태 위젯
│   │   │   ├── GuestbookForm.tsx     # 방명록 작성 폼 (익명/GitHub OAuth)
│   │   │   ├── GuestbookList.tsx     # 방명록 목록 (서버, 서버사이드 페이지네이션)
│   │   │   ├── GuestbookListClient.tsx # 방명록 항목 + 페이지 번호 UI (클라이언트)
│   │   │   └── GuestbookCommentSection.tsx # 방명록 댓글 + 좋아요 (클라이언트)
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx       # 프로젝트 카드 UI
│   │   │   ├── ProjectList.tsx       # 프로젝트 Grid + 필터
│   │   │   ├── ProjectDetailModal.tsx # 프로젝트 상세 모달 + MDX 인라인 뷰
│   │   │   └── ProjectCardActions.tsx # 관리자 전용 카드 액션 (수정/삭제)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── mdx/                      # MDX 렌더링 컴포넌트
│   │   ├── providers/
│   │   │   └── AuthStateInitializer.tsx # 서버 권한 → Jotai atom 동기화
│   │   └── ui/                       # 기타 UI 원자 컴포넌트
│   │
│   ├── actions/                      # ⚡ Server Actions
│   │   ├── blog.ts                   # 블로그 CRUD + 발행 토글 (관리자 전용)
│   │   ├── contact.ts                # Contact 링크 업데이트
│   │   └── guestbook.ts              # 방명록 CRUD + 댓글/좋아요
│   │
│   ├── utils/                        # 🔧 유틸리티 함수
│   │   ├── supabase/
│   │   │   ├── server.ts             # 서버 컴포넌트용 Supabase 클라이언트
│   │   │   ├── client.ts             # 클라이언트 컴포넌트용 Supabase 클라이언트
│   │   │   └── middleware.ts         # JWT 검증 + 권한 검사 로직
│   │   ├── analytics/
│   │   │   └── getPageViewStats.ts   # 방문자 통계 집계 (오늘/주간/누적/차트/TOP5)
│   │   ├── auth/
│   │   │   ├── login.ts              # 서버 액션: 로그인 처리
│   │   │   ├── logout.ts             # 서버 액션: 로그아웃 처리
│   │   │   └── serverAuth.ts         # 공통 인증 유틸 (getCurrentUserRole)
│   │   ├── contact/
│   │   │   └── iconMap.ts            # icon_key → lucide-react 컴포넌트 매핑
│   │   ├── nickname/
│   │   │   └── generateNickname.ts   # 비회원 닉네임 자동생성 (localStorage UUID 기반)
│   │   ├── storage/
│   │   │   └── uploadImage.ts        # 이미지 업로드/삭제 (Supabase Storage)
│   │   ├── mdx.ts                    # MDX → HTML 변환 유틸
│   │   └── techIcons.ts              # 기술 스택 아이콘 매핑 (Simple Icons)
│   │
│   ├── types/                        # 📝 TypeScript 타입 정의
│   │   ├── supabase.ts               # Supabase CLI로 생성된 DB 타입
│   │   ├── database.ts               # 커스텀 타입 정의
│   │   ├── contact.ts                # Contact 편의 타입
│   │   └── profile.ts                # 프로필 관련 타입
│   │
│   ├── store/                        # 🗄️ 전역 상태 관리 (Jotai)
│   │   ├── authAtom.ts               # 인증 상태 (isAdmin, editingProject)
│   │   ├── filterAtom.ts             # 프로젝트 필터 상태 (카테고리)
│   │   └── projectAtom.ts            # 프로젝트 편집 상태
│   │
│   └── middleware.ts                 # 🔒 전역 미들웨어 (경로 보호 엔트리)
│
├── content/                          # 📝 MDX 콘텐츠
│   └── projects/
│       └── dev-log-portfolio.mdx     # 포트폴리오 개발 회고
│
├── docs/                             # 📊 문서
│   ├── analysis/
│   │   └── ANALYSIS-dev-log-portfolio-2026-04-23.md  # 전체 프로젝트 분석 보고서
│   ├── design/                       # 🎨 디자인 Ground Truth (Silver V2)
│   │   ├── DESIGN-TOKENS.md          # 디자인 토큰 canonical (컬러·타이포·간격·유틸 클래스)
│   │   └── UX-BRIEF.md               # 화면 맵·레이아웃 원칙·인터랙션 패턴
│   └── research/
│       └── RESEARCH-*.md             # 기술 리서치 보고서
│
├── supabase/                         # 🗄️ Supabase 관련 파일
│   ├── schema.sql                    # 데이터베이스 스키마
│   └── migrations/
│       ├── 20260213_create_inquiries.sql
│       ├── 20260214_alter_inquiries_add_columns.sql
│       ├── 20260220_trainings_add_date_range.sql
│       ├── 20260226_create_guestbook.sql
│       ├── 20260305_create_guestbook_comments_and_likes.sql
│       └── 20260307_create_page_views.sql
│
├── verify.sh                         # 🔍 Cursor 변경 자동 검증 스크립트
├── .env.local                        # 🔐 환경 변수 (Git에서 제외됨)
└── package.json                      # 📦 의존성 관리
```

---

## 🎯 핵심 파일 설명

### 1. `src/middleware.ts` + `src/utils/supabase/middleware.ts` — 보안 게이트

2계층 구조로 모든 요청을 가로채 인증 및 권한을 검증합니다.

- **`src/middleware.ts`** (사령관): Next.js 엔트리 포인트, matcher 정의, `updateSession()` 호출
- **`src/utils/supabase/middleware.ts`** (실무자): JWT 검증, DB role 조회, 리다이렉트 처리

**보안 정책:**
- 정방향 가드: 비로그인 시 `/admin` 경로 차단 → `/login`
- 역방향 가드: 로그인 상태에서 `/login` 접근 → `/` (중복 로그인 방지)
- 권한 가드: `role !== 'admin'`인 유저의 `/admin` 접근 → `/`
- JWT 서버 검증: `supabase.auth.getUser()`로 토큰 위변조 불가
- DB 실시간 검증: `profiles` 테이블에서 실제 role 재조회

### 2. `src/utils/supabase/` — Supabase 연결 설정

SSR(서버 사이드 렌더링)을 위한 Supabase 클라이언트입니다.

- **`server.ts`**: 서버 컴포넌트, 서버 액션, Route Handler에서 사용
- **`client.ts`**: 클라이언트 컴포넌트에서 사용 (`'use client'` 필요)
- **`middleware.ts`**: 세션 갱신 + 권한 검사 로직

```typescript
// 서버 컴포넌트에서 사용 예시
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*')
}
```

### 3. `verify.sh` — Cursor 변경 자동 검증 스크립트

Claude Code + Cursor 협업 워크플로우에서 Cursor가 수정한 코드를 자동으로 검증합니다.

```bash
./verify.sh              # git diff 감지 + 전체 검증 (Spec + TS + ESLint)
./verify.sh --ts-only    # TypeScript 검사만 실행
./verify.sh --staged     # staged 파일만 검사
./verify.sh --ai         # Claude AI 분석 포함 (Claude Code CLI 필요)
```

---

## 🗃️ 데이터베이스 스키마

### 주요 테이블

| 테이블 | 설명 |
|--------|------|
| `profiles` | 사용자 프로필 (역할, GitHub·LinkedIn 링크) |
| `projects` | 프로젝트 (제목, 설명, 기술 스택, 기간, 상태) |
| `skills` | 기술 스택 (카테고리별 분류, 아이콘) |
| ~~`inquiries`~~ | ~~문의 내역~~ (v1.1.0에서 제거 — 댓글 시스템으로 대체) |
| `guestbook` | 방명록 (익명·GitHub OAuth, 비밀글, 서버사이드 페이지네이션) |
| `guestbook_comments` | 방명록 댓글 (익명·로그인 허용, FK → guestbook) |
| `guestbook_comment_likes` | 댓글 좋아요 (로그인 유저 전용, UNIQUE 제약) |
| `page_views` | 방문 기록 (path, visitor_id, 타임스탬프 — 관리자 전용 조회) |
| `contact_links` | 연락처 정보 (관리자 인라인 에딧) |
| `trainings` | 교육/자격증 이력 (날짜 범위 지원) |

---

## 🛠️ 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub (GraphQL API — repo + read:user 스코프 필요)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username

# Spotify (Premium 계정 전용)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

> **Spotify**: Free 계정은 Web API가 비활성화되어 있습니다. 위젯은 자동으로 숨겨집니다.

### 3. 데이터베이스 스키마 적용

**방법 1: Supabase Dashboard (권장)**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → SQL Editor
3. `supabase/schema.sql` 내용을 복사하여 실행

**방법 2: Supabase CLI**
```bash
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
npx supabase gen types typescript \
  --project-id krnuicpyqlqhqeehdprd \
  --schema public \
  > src/types/supabase.ts
```

### Cursor 변경 검증 (`verify.sh`)

> Claude Code + Cursor 협업 워크플로우에서 Cursor가 수정한 코드를 자동 검증합니다.

```bash
# 실행 권한 부여 (최초 1회)
chmod +x verify.sh

# 전체 검증 (Spec 패턴 + TypeScript + ESLint)
./verify.sh

# TypeScript 컴파일 검사만 빠르게 실행
./verify.sh --ts-only

# staged 파일만 검사 (git add 이후)
./verify.sh --staged

# Claude AI 분석 포함 (Claude Code CLI 설치 필요)
./verify.sh --ai
```

**검증 항목:**
- `any` 타입 사용 여부
- Next.js 15 `await cookies()` / `params` / `searchParams` 누락
- 클라이언트 컴포넌트에서 `supabase/server` 혼용
- 불필요한 `'use client'` 선언
- TypeScript 컴파일 오류
- ESLint 오류/경고

---

## 🎨 주요 기능

### ✅ 완료된 기능

- [x] **홈페이지**: Hero 섹션, AI 워크플로우 섹션
- [x] **About 페이지**: 스토리, 경력 타임라인, 기술 스택 (Collapsed/Expanded)
- [x] **프로젝트 리스트**
  - [x] CSS Grid 레이아웃 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
  - [x] 카테고리 필터링 (전체/업무/개인/팀)
  - [x] 키워드 검색 (제목·기술스택·회사명, `searchQueryAtom` 기반)
  - [x] Framer Motion `whileInView` 애니메이션
  - [x] 진행중/주요 태그 (카드 좌상단 고정)
  - [x] `is_ongoing DESC` + `end_date DESC` 정렬
- [x] **프로젝트 상세 모달**
  - [x] MDX 인라인 렌더링 (`/api/mdx/[slug]`)
  - [x] Portal 기반 렌더링 (부모 overflow/transform 영향 제거)
  - [x] 업무 프로젝트 상세보기 숨김
- [x] **관리자 CRUD**
  - [x] 프로젝트 등록/수정/삭제 (이미지 업로드 + Drag & Drop)
  - [x] 기술 스택 관리 (자동완성 드롭다운)
  - [x] 프로필 관리
  - [x] 교육/자격증 관리 (날짜 범위 지원)
- [x] **인증 시스템**
  - [x] ID(Virtual Email) + 비밀번호 로그인
  - [x] GitHub OAuth 로그인 (방명록 비밀글용)
  - [x] JWT 서버 검증 + DB role 실시간 조회
  - [x] 역할 기반 접근 제어 (admin/user)
  - [x] 역방향 가드 (로그인 시 `/login` 접근 차단)
- [x] **Contact 페이지**
  - [x] 방명록 (익명·GitHub OAuth·관리자, 비밀글, 아바타)
  - [x] 방명록 서버사이드 페이지네이션 (Supabase range + count, URL searchParams, 페이지 번호 UI)
  - [x] 방명록 댓글 시스템 (익명·로그인 허용, 인라인 펼침형 UI)
  - [x] 댓글 좋아요 (로그인 유저 토글, 낙관적 업데이트, DB 저장)
  - [x] 연락처 정보 (DB 연동 + 관리자 인라인 에딧)
  - [x] Live Status 위젯 (GitHub 30일 커밋, Spotify 현재 재생)
  - ~~문의 시스템 (v1.1.0에서 제거 — 댓글 시스템으로 대체)~~
- [x] **UI/UX**
  - [x] 다크/라이트 모드 (next-themes)
  - [x] Silver SH 브랜드 로고 + 컬러 시스템
  - [x] 공통 컴포넌트 (SilverButton, StatusBadge, ThemeCard, SkillIcon)
  - [x] Sonner 토스트 알림 (SSR 호환 DynamicToaster)
  - [x] 페이지 트랜지션 (fade-up, Hydration 블랭크 방지)
  - [x] 반응형 디자인 (모바일/태블릿/데스크탑)
  - [x] ThemeCard variant 시스템 (default/featured/minimal) + THEME_CARD_CLASS static export
  - [x] Surface 토큰 계층 (`--surface` / `--elevated`) + ambient-glow 단색 통합
  - [x] 전 페이지 컴포넌트 디자인 통일 (HeroSection, AIWorkflowSection, AboutContent, ProjectCard, GuestbookListClient)
- [x] **방명록 원글 좋아요**
  - [x] `guestbook_likes` 테이블 (RLS: 조회=공개, 생성/삭제=인증 유저)
  - [x] `toggleEntryLike` Server Action + 낙관적 업데이트 + 실패 시 롤백
- [x] **배포**
  - [x] Vercel 배포 (GitHub main 브랜치 자동 배포)
  - [x] 환경변수 7개 설정 완료
  - [x] CVE-2026-0969 취약점 제거 (next-mdx-remote 미사용 패키지 삭제)
- [x] **TechBlog 시스템**
  - [x] 블로그 DB 테이블 + Supabase 연동 + 관리자 CRUD
  - [x] Tiptap 기반 MDX 에디터 (GFM 테이블 지원 — `@tiptap/extension-table`)
  - [x] 공개 블로그 목록 페이지 (페이지네이션, 태그 필터)
  - [x] 블로그 상세 페이지 (`remark-gfm` + shiki 코드 하이라이팅 + 커스텀 MDX 컴포넌트)
  - [x] TOC (목차) 사이드바, 읽기 진행바, Giscus 댓글
  - [x] 이전/다음글 네비게이션 (키보드 ← → 방향키 지원, 발행일 표시)
  - [x] GFM 마크다운 테이블 렌더링 (Tailwind 스타일 커스텀 컴포넌트)
  - [x] 블로그 인라인 관리 — 리스트 페이지에서 직접 수정/삭제/발행 토글 (관리자 전용)
  - [x] 관리자 상태 필터 — 전체/발행됨/임시저장/보관됨 + 상태 뱃지
  - [x] 전용 작성/수정 페이지 (`/blog/new`, `/blog/edit/[id]`)
  - [x] 마크다운 미리보기 — 편집/미리보기 탭 토글 (`@mdx-js/mdx` evaluate 기반)
  - [x] 글 작성/수정 폼 검증 에러 UX 개선 — 에러 배너 상단 노출 + 해당 필드 자동 포커스

- [x] **Silver V2 전면 리디자인** (feature/silver_sh)
  - [x] globals.css Silver V2 디자인 토큰 전면 교체 (Pretendard + JetBrains Mono, Cool Silver 액센트)
  - [x] Header · Footer Silver V2 교체 (sticky frosted glass, 브랜드 닷, 모바일 드로어)
  - [x] CursorGlow 컴포넌트 신규 (커서 추적 radial gradient 글로우)
  - [x] Home: Hero (메탈릭 이름) · AIWorkflow · BufferPhilosophy · TechStack · RecentBlog
  - [x] About: 페이지 라벨 + 에세이 · Skills · ExperienceTabs 타임라인
  - [x] Projects: 비대칭 에디토리얼 카드 그리드 + `.card` 메탈릭 테두리
  - [x] Blog 목록: `.row-link` 행 리스트 + `.tag` 필터
  - [x] Blog 상세: 3컬럼 레이아웃 (좌 메타 · 중 본문 · 우 TOC), BlogShareLinks 신규
  - [x] Contact: 2컬럼 그리드 + `.sv-input` underline 폼
  - [x] Login: 중앙 정렬 380px, `.metallic` 제목
  - [x] 디자인 Ground Truth 수립 (`/init-design --deep`): DESIGN-TOKENS.md · UX-BRIEF.md 생성
  - [x] 시맨틱 토큰 추가 (`--color-success`, `--color-error` 계열) + 하드코딩 7건 CSS 변수 교체
- [x] **Silver V2 고도화** (v2.1.0)
  - [x] 어드민 13개 파일 Silver V2 CSS 변수 일괄 적용 (`dark:` 프리픽스 제거)
  - [x] `useDeleteConfirm<T>` 커스텀 훅 추출 — BlogManager · skills · experience · education · training 공통 적용
  - [x] `revalidateAboutPage` Server Action — ISR 캐시 무효화 (skills/experience/education/training mutations 후)
  - [x] `/about` · `/projects` ISR 전환 (`revalidate 3600`)
  - [x] `AuthStateInitializer` try-catch 에러 핸들링 추가
  - [x] `.skeleton` shimmer 유틸 클래스 + `TopProgressBar` metallic 페이지 전환 진행바
  - [x] `loading.tsx` 5개 Silver V2 콘텐츠 인식 스켈레톤 전면 교체
  - [x] `ProjectDetailModal` Silver V2 전환 — 960px 사각형 패널, 주요업무/담당역할/개발환경 레이블 구조, 컬러 아이콘 기술 칩
  - [x] `ContactInfo` · `GuestbookForm` · `GuestbookList` Silver V2 전환
  - [x] `PageHeader` 공통 컴포넌트화 — 전 페이지 제목 구조 통일
  - [x] 각 페이지 헤더 텍스트 정비 (Home V1 문구 복원, 페이지별 목적에 맞게 정리)

### 🚧 개발 예정

- [x] ~~`/projects`, `/about` ISR 전환 — `revalidate 3600` + `revalidateAboutPage` Server Action (v2.1.0 완료)~~
- [x] ~~어드민 페이지 `/admin/*` Silver V2 리디자인 (v2.1.0 완료)~~
- [x] ~~**블로그 관리 진입점 개선**: `/admin/blog` 제거 → `/blog` 리스트에서 직접 인라인 관리 (v1.6.0에서 완료)~~

**Silver V2 디자인 고도화 (진행 예정)**

- [ ] **HeroSection 리디자인** — 레이아웃·텍스트·비주얼 전반 재검토, Buffer Progress 위젯 개선
- [ ] **버튼 시스템 정비** — `.btn` / `.btn-primary` / `.btn-ghost` 크기·간격·hover 상태 일관성 점검
- [ ] **카드 디자인 정비** — `.card` 메탈릭 테두리 강도, hover 애니메이션, 그림자 레벨 조정
- [ ] **태그 디자인 정비** — `.tag` 크기·패딩·필터 active 상태 시각 개선
- [ ] **폰트 위계 점검** — Pretendard + JetBrains Mono 혼용 구간 정리, 본문 가독성 개선
- [ ] **Selected / Active 상태 디자인** — 필터 태그 active, 네비게이션 현재 메뉴, 체크박스·토글 선택 상태 통일

---

## 📌 진행 상태

### Phase 1: 초기 설정 ✅
- Next.js 15 프로젝트 생성, Tailwind CSS, 기본 폴더 구조

### Phase 2: Supabase 연동 ✅
- `@supabase/ssr` 설치, 서버/클라이언트/미들웨어 유틸리티

### Phase 3: 데이터베이스 스키마 ✅
- `profiles`, `projects`, `skills`, `inquiries`, `guestbook`, `contact_links`, `trainings` 테이블

### Phase 4: 인증 및 보안 시스템 ✅
- Supabase Auth 기반 로그인, GitHub OAuth, 미들웨어 경로 보호

### Phase 5: 핵심 기능 구현 ✅
- 프로젝트 CRUD, 방명록, Live Status, Contact, MDX 모달, 관리자 대시보드

### Phase 6: 배포 및 최적화 ✅ (2026-03-01)
- Vercel 배포 완료, 공통 컴포넌트 리팩토링, 보안 취약점 제거

### Phase 7: 방명록 댓글/좋아요 + 페이지네이션 ✅ (2026-03-05)
- 문의내역(Inquiry) 시스템 제거 → 방명록 댓글 시스템으로 대체
- 방명록 댓글 + 좋아요(Like 토글) 기능 추가
- 서버사이드 페이지네이션 (Supabase range + count, URL searchParams)

### Phase 8: 닉네임 체계 + 방문자 통계 ✅ (2026-03-07)
- 닉네임 결정 우선순위 통합 (Admin → GitHub OAuth → 이메일 → 비회원 자동생성)
- 비회원 자동생성 닉네임 UX (localStorage 기반, 재롤링 지원)
- `page_views` 테이블 기반 방문 추적 인프라 구축
- 관리자 대시보드 Visitor Analytics 통합 카드 (수치·7일 바차트·인기페이지 TOP5)

### Phase 9: UI/UX 전면 개편 + 방명록 원글 좋아요 ✅ (2026-03-07)
- 디자인 시스템 정립: Surface 토큰 계층(`--surface`/`--elevated`), ThemeCard variant 시스템 (default/featured/minimal)
- HeroSection·AIWorkflowSection·AboutContent·ProjectCard·GuestbookListClient 전 페이지 디자인 통일
- ambient-glow 3색 → 단색 통합, 불필요한 CSS 클래스 제거 (role-pill, gradient-ring, bento-grid 등)
- 방명록 원글 좋아요: `guestbook_likes` 테이블 + Server Action + 낙관적 업데이트
- About Me 카드 ThemeCard default variant 통일

### Phase 11: TechBlog 시스템 구축 ✅ (2026-03-24)
- `blog_posts` DB 테이블 설계 + Supabase 연동 + 관리자 CRUD (BlogManager + BlogEditor)
- Tiptap 기반 마크다운 에디터 — `@tiptap/extension-table` 추가로 GFM 테이블 붙여넣기/직렬화 지원
- 공개 블로그 목록 페이지 (태그 필터, 검색, 페이지네이션)
- 블로그 상세 페이지 — `@mdx-js/mdx` + `remark-gfm` + rehype-shiki 렌더링
- TOC 사이드바, 읽기 진행바(ReadingProgressBar), Giscus 댓글 통합
- PostNavigation — 키보드 ← → 방향키 이동, 이전/다음글 발행일 표시, 카드 디자인 개선
- 관리자 전용 블로그 수정 진입 버튼 (블로그 상세 페이지 상단, `isAdmin` 조건부 노출)
- 커스텀 MDX 컴포넌트 — GFM 테이블(table/thead/tbody/tr/th/td), GitHub Dark 코드블록 스타일

### Phase 14: Silver V2 고도화 ✅ (2026-04-26)
- 어드민 Silver V2 CSS 변수 일괄 적용, `useDeleteConfirm` 훅 추출
- ISR 전환 (`revalidate 3600`) + `revalidateAboutPage` Server Action으로 캐시 무효화 보강
- `.skeleton` shimmer + `TopProgressBar` + `loading.tsx` 5개 V2 스켈레톤 교체
- `ProjectDetailModal` · `ContactInfo` · `GuestbookForm` · `GuestbookList` Silver V2 전환
- `PageHeader` 공통 컴포넌트화, 각 페이지 헤더 텍스트 정비

### Phase 13: Silver V2 전면 리디자인 + 디자인 시스템 수립 ✅ (2026-04-23)
- 전 공개 페이지 Silver V2 테마 교체 — Pretendard + JetBrains Mono, Cool Silver 액센트(`#64748B` / `#C8D1DC`)
- 메탈릭 그라디언트 시스템: `.btn`, `.card`, `.tag`, `.metallic` 텍스트 그라디언트
- 커서 추적 Radial Gradient 글로우 (`CursorGlow` 컴포넌트), 다크/라이트 모드 완전 지원
- Blog 상세 3컬럼 레이아웃 (좌 메타 사이드바 240px · 중 본문 · 우 TOC 260px)
- `BlogShareLinks` 컴포넌트 신규 (트위터 공유 + 클립보드 복사, SSR 안전)
- `/init-design --deep` 실행 — `docs/design/DESIGN-TOKENS.md` · `UX-BRIEF.md` Ground Truth 생성
- 시맨틱 토큰 신규 등록: `--color-success`, `--color-success-glow`, `--color-error`, `--color-error-border`, `--color-error-bg`
- 하드코딩 컬러 7건 CSS 변수 교체 (Footer, login, BlogList)
- TypeScript 타입 개선: `as any` / `as unknown as AboutProfile` 제거, `satisfies` 패턴 적용
- `/api/mdx/[slug]` slug allowlist 검증 추가 (path traversal 방어)

### Phase 12: 블로그 관리 인라인화 ✅ (2026-03-26)
- `/admin/blog` 관리 페이지 제거 → 블로그 리스트(`/blog`)에서 직접 인라인 CRUD
- 관리자 접근 시 전체 포스트(draft/archived 포함) 표시 + 상태 필터(전체/발행/임시저장/보관)
- 블로그 카드에 수정/삭제/발행토글 아이콘 (관리자 전용, hover 시 표출)
- 전용 작성/수정 페이지 (`/blog/new`, `/blog/edit/[id]`) + 우측 상단 버튼 배치
- 마크다운 미리보기 탭 (`@mdx-js/mdx` evaluate + remarkGfm, 300ms 디바운스)

### Phase 10: 성능 분석 및 핵심 병목 리팩토링 ✅ (2026-03-14)
- 성능 분석 보고서 작성 (`docs/analysis/ANALYSIS-2026-03-14.md`)
- `getCurrentUserRole()` React.cache() 래핑 — 동일 요청 범위 내 `auth.getUser()` 중복 호출 제거 (Contact 페이지 3회→1회)
- `GuestbookList` 댓글수·좋아요·auth 조회 `Promise.all()` 병렬화 — 순차 대기 제거
- `getGuestbookComments()` `auth.getUser()` ‖ `comments.select()` 병렬 실행
- `SkillsSection` stagger delay `0.06→0.02` 축소, `whileInView→animate` 전환 — IntersectionObserver 제거

---

## 🗒️ 릴리즈 노트

### v2.1.0 — 2026-04-26 (Silver V2 고도화 — 어드민 V2 · 로딩 UI · Modal · Contact)

**어드민 Silver V2 적용:**
- 어드민 13개 파일(`dashboard`, `layout`, `profile`, `projects`, `skills`, `AdminHeader` 등) CSS 변수 일괄 교체 — `dark:` 프리픽스 제거, Silver V2 토큰 통일
- `useDeleteConfirm<T>` 커스텀 훅 추출 (BlogManager · skills · experience · education · training 중복 제거)

**ISR + 캐시 무효화:**
- `/about` · `/projects` ISR 전환 (`export const revalidate = 3600`)
- `revalidateAboutPage` Server Action 신규 — skills/experience/education/training CRUD 완료 후 `/about` ISR 캐시 즉시 무효화
- `AuthStateInitializer` try-catch 추가 (Supabase 오류 시 로그인 상태 안전 초기화)

**로딩 UI Silver V2:**
- `.skeleton` shimmer 유틸 클래스 (`@keyframes skeleton-shimmer`, `--bg-1/--bg-2` 기반)
- `TopProgressBar` 신규 — 클릭 감지 + `usePathname` 기반 metallic 진행바, Suspense 래핑 (SSR 블로킹 방지)
- `loading.tsx` 5개 (`/`, `/about`, `/blog`, `/contact`, `/projects`) Silver V2 콘텐츠 인식 스켈레톤 전면 교체
- `ProjectListSkeleton` V2 토큰 + shimmer + PageHeader 영역 포함

**Modal · Contact Silver V2:**
- `ProjectDetailModal` 전면 재작성 — 960px 사각형 패널, sv-label 헤더, 주요업무/담당역할/개발환경 레이블 섹션, 컬러 아이콘 기술 칩, `whitespace-pre-line` 적용
- `ContactInfo` — 3열 행 그리드(120px 1fr auto), sv-mono 라벨, border-top 구분선
- `GuestbookForm` — sv-input 언더라인 입력, 이모지 border 선택 버튼, `.btn .btn-primary` 제출
- `GuestbookList` · `GuestbookListClient` — sv-eyebrow 헤더, 4열 행 그리드 (이모지·닉네임·메시지·카운트)

**텍스트 정비:**
- Home Hero 소제목 V1 문구 복원 ("속도로 얻은 여유를, 완성도에 투자하는 개발자")
- About · Blog · Contact · Projects 페이지 헤더 텍스트 목적에 맞게 정리

**신규 파일:**
- `src/actions/revalidate.ts` — `revalidateAboutPage` Server Action
- `src/components/common/TopProgressBar.tsx` — 페이지 전환 진행바
- `src/hooks/useDeleteConfirm.ts` — 2단계 삭제 확인 커스텀 훅
- `src/components/common/PageHeader.tsx` — 공통 페이지 헤더 컴포넌트

### v2.0.0 — 2026-04-23 (Silver V2 전면 리디자인)

**디자인 전면 교체:**
- 전 공개 페이지 Silver V2 테마 적용 — Pretendard + JetBrains Mono, Cool Silver 액센트 팔레트
- 메탈릭 그라디언트 버튼(`.btn`), 카드(`.card`), 태그(`.tag`), 텍스트(`.metallic`) 시스템 구축
- 커서 추적 Radial Gradient 글로우 (`CursorGlow`), 다크/라이트 모드 완전 지원
- 글로벌 헤더: sticky frosted glass (color-mix + backdrop-filter), 모바일 드로어 260px
- Blog 상세 3컬럼 레이아웃 (좌 메타 240px · 중 본문 · 우 TOC 260px, xl 이상)

**디자인 시스템 수립:**
- `/init-design --deep` 실행 — `docs/design/DESIGN-TOKENS.md` · `UX-BRIEF.md` Ground Truth 생성
- 시맨틱 토큰 신규 등록: `--color-success`, `--color-error` 계열 5개
- 하드코딩 컬러 7건 CSS 변수(`var(--)`) 교체

**코드 품질 개선 (Quick Win):**
- `getTrainings.ts`, `getProfile.ts`, `getProfileClient.ts`: `as any` / `as unknown as` 제거, `satisfies` 패턴 적용
- `/api/mdx/[slug]`: slug allowlist 정규식 검증 추가 (path traversal 방어)

**신규 파일:**
- `BlogShareLinks.tsx` — 트위터 공유 + 클립보드 복사 (SSR 안전, `useEffect` window 접근)
- `docs/design/DESIGN-TOKENS.md` — 디자인 토큰 canonical
- `docs/design/UX-BRIEF.md` — 화면 맵 · 레이아웃 원칙

### v1.6.2 — 2026-04-16 (TOC 안정화 + 비발행 접근 제어)

**버그 수정:**
- 블로그 TOC `IntersectionObserver` 안정화 — 스크롤 오프셋 88px 보정, 헤딩 ID 중복 처리 개선
- 비발행(`draft`/`archived`) 글 직접 URL 접근 시 관리자 외 403 처리

### v1.6.1 — 2026-04-16 (블로그 폼 검증 UX 개선)

**버그 수정:**
- `BlogEditForm` 필수 항목(제목·슬러그) 미입력 시 에러 배너가 화면 하단에 표시되어 무반응으로 보이던 문제 수정
  - 에러 배너를 헤더 바로 아래(폼 상단)으로 이동
  - `scrollIntoView({ behavior: 'smooth' })`로 에러 배너 자동 스크롤
  - 오류 필드(`titleRef` / `slugRef`)로 자동 포커스 이동
  - 서버 액션 실패 에러도 동일 UX 경로로 통합

### v1.6.0 — 2026-03-26 (블로그 관리 인라인화)

**UX 개선:**
- `/admin/blog` 관리 페이지 제거 — 블로그 리스트(`/blog`)에서 직접 인라인 관리로 전환
- 관리자 접근 시 전체 포스트(draft/published/archived) 표시 + 상태 필터 버튼(전체/발행됨/임시저장/보관됨)
- 블로그 카드에 수정·삭제·발행토글 아이콘 추가 (관리자 전용, hover 시 표출)
- 전용 작성/수정 페이지 신설 (`/blog/new`, `/blog/edit/[id]`) — 우측 상단에 취소+저장 버튼 배치, 하단 중복 취소 제거

**에디터 개선:**
- 마크다운 미리보기 탭 — 편집/미리보기 토글, `@mdx-js/mdx` evaluate + remarkGfm 기반 클라이언트 렌더링 (300ms 디바운스)

**신규 파일:**
- `BlogEditForm.tsx` — 블로그 작성/수정 공통 폼 컴포넌트
- `MarkdownPreview.tsx` — MDX 클라이언트 미리보기 컴포넌트
- `/blog/new/page.tsx`, `/blog/edit/[id]/page.tsx` — 전용 라우트

### v1.5.0 — 2026-03-24 (TechBlog 시스템 구축)

**신규 기능:**
- `blog_posts` 테이블 기반 TechBlog 인프라 — Supabase 연동, 관리자 CRUD (BlogManager + BlogEditor)
- 공개 블로그 목록 페이지: 태그 필터, 검색, 페이지네이션
- 블로그 상세 페이지: `@mdx-js/mdx` + `remark-gfm` + rehype-shiki 코드 하이라이팅 렌더링
- TOC 사이드바 (h2/h3 자동 추출), 읽기 진행바, Giscus GitHub 댓글 통합
- GFM 마크다운 테이블 렌더링 — `remark-gfm` 플러그인 + 커스텀 MDX table 컴포넌트 (Tailwind 스타일)
- 관리자 전용 "수정" 버튼 — 블로그 상세 페이지 상단 (`isAdmin` 조건부 노출, `/admin/blog` 이동)

**UX 개선:**
- PostNavigation 개선: 이전/다음글 카드에 발행일 표시, 키보드 ← → 방향키 이동, 카드 디자인 개선 (ThemeCard 적용, 아이콘 박스, 호버 애니메이션)
- GitHub Dark 테마 코드블록 스타일 적용

**에디터 개선:**
- Tiptap BlogEditor에 `@tiptap/extension-table` 등록 — 마크다운 테이블 붙여넣기 및 직렬화 정상 동작

**신규 패키지:**
- `remark-gfm` ^4.0.1
- `@tiptap/extension-table` ^3.20.4 (TableRow, TableHeader, TableCell 포함)

### v1.4.0 — 2026-03-14 (성능 최적화 — 핵심 병목 리팩토링)

**성능 개선:**
- `getCurrentUserRole()` `React.cache()` 래핑: 동일 요청 범위 내 `supabase.auth.getUser()` 중복 호출 제거 — Contact 페이지 기준 네트워크 왕복 3→1회
- `GuestbookList` 병렬 쿼리: 댓글 수·좋아요·auth 정보를 `Promise.all()`로 동시 조회 — 순차 대기 시간 제거
- `getGuestbookComments()` 병렬화: `auth.getUser()`와 댓글 목록 조회를 `Promise.all()`로 동시 실행
- `SkillsSection` 애니메이션 최적화: stagger delay `idx×0.06→idx×0.02` 축소, `whileInView` 제거 → IntersectionObserver 0개 (펼침 즉시 반응)

**분석 리포트:**
- `docs/analysis/ANALYSIS-2026-03-14.md` 성능 분석 보고서 추가

### v1.3.0 — 2026-03-07 (UI/UX 전면 개편 + 방명록 원글 좋아요)

**UI/UX 개편:**
- 디자인 시스템 정립: `--surface`(다크 20%/라이트 100%) · `--elevated`(24%/97%) CSS 변수, `@layer utilities` 직접 정의로 Tailwind JIT 미생성 이슈 해결
- ThemeCard variant 시스템 (`default` / `featured` / `minimal`) + `THEME_CARD_CLASS` static export (Framer Motion 호환)
- HeroSection: role-pill 제거, 3색 ambient-orb → 단색 ambient-glow, 수직 중앙 레이아웃
- AIWorkflowSection: bento grid → 수직 타임라인 (좌측 step number + 연결선)
- AboutContent: gradient-ring → 단순 border, story 카드 vertical stack + ThemeCard(minimal → default)
- ProjectCard: THEME_CARD_CLASS 적용, hover spring 애니메이션
- GuestbookListClient: 각 항목 ThemeCard(default) 카드 형태
- 불필요한 CSS 제거: `.role-pill`, `.gradient-ring`, `@keyframes gradient-rotate`, `.bento-grid`, `.ambient-orb-*`

**기능 추가:**
- 방명록 원글 좋아요: `guestbook_likes` 테이블 (RLS: 조회=공개, 생성/삭제=인증 유저), `toggleEntryLike` Server Action, 낙관적 업데이트 + 실패 시 롤백

**DB 변경:**
- `guestbook_likes` 테이블 추가 (guestbook_id FK, user_id, UNIQUE 제약)

### v1.2.0 — 2026-03-07 (닉네임 체계 정리 + 방문자 분석)

**기능 추가:**
- 방문자 추적 인프라: `page_views` 테이블 (RLS: 삽입=공개, 조회=인증 유저), `PageViewTracker` 클라이언트 컴포넌트 (루트 레이아웃 연결, `/admin·/login·/api` 경로 제외)
- 관리자 대시보드 Visitor Analytics 통합 카드: 오늘/이번주/누적 방문 수치 + 최근 7일 SVG 바차트 + 인기페이지 TOP5
- 비회원 닉네임 자동생성 UX: localStorage UUID 기반 닉네임 생성·복원, 재롤링 버튼, 직접 수정 모드
- GitHub 로그인 버튼 독립 배치: 방명록 폼 닉네임 우측 + 댓글 폼 하단

**버그 수정:**
- 이메일 로그인 유저가 'GitHub User'로 잘못 표시되던 닉네임 버그 수정 (서버에서 계산 후 props 전달)

**DB 변경:**
- `page_views` 테이블 추가 (path, visitor_id, created_at, 복합 인덱스)

### v1.1.0 — 2026-03-05 (방명록 댓글/좋아요 + 페이지네이션)

**기능 변경:**
- 문의내역(Inquiry) 시스템 전체 제거 — InquiryForm, InquiryList, InquiryCard, InquiryReplyCard, inquiries 액션/유틸 삭제
- 방명록 댓글 시스템 신규 구축 (`guestbook_comments` 테이블, 익명·로그인 댓글 허용)
- 댓글 좋아요(Like) 기능 (`guestbook_comment_likes` 테이블, 로그인 유저 토글, 낙관적 업데이트)
- 방명록 서버사이드 페이지네이션 (기존 클라이언트 slice → Supabase `range()` + `count`)
- URL 기반 페이지 상태 관리 (`?guestbookPage=N`, `useTransition` 로딩 처리)
- 페이지 번호 UI (ellipsis 포함, 기존 prev/next + 페이지 번호 버튼)

**DB 변경:**
- `guestbook_comments` 테이블 추가 (FK → guestbook, RLS: 공개 읽기/쓰기, 관리자·본인 삭제)
- `guestbook_comment_likes` 테이블 추가 (UNIQUE 제약, RLS: 인증 유저만 생성/삭제)
- `inquiries` 테이블 — 코드에서 참조 제거 (DB 마이그레이션 파일은 히스토리로 유지)

### v1.0.0 — 2026-03-01 (초기 배포)

**🎉 Vercel 배포 완료**
- 배포 URL: https://dev-log-portfolio-y2sl.vercel.app
- GitHub `main` 브랜치 push → 자동 빌드 및 배포

**주요 기능 포함:**
- 홈, About, Projects, Contact 페이지 완성
- 관리자 대시보드 (프로젝트·기술스택·프로필·교육 CRUD)
- Supabase Auth 기반 이메일 로그인 + GitHub OAuth
- 방명록 (익명·OAuth, 비밀글 지원)
- Live Status 위젯 (GitHub GraphQL, Spotify)
- 프로젝트 상세 MDX 인라인 뷰

**버그 수정 및 최적화:**
- `react-icons` 제거 → `lucide-react` + `simple-icons` 직접 사용 (번들 최적화)
- `next-mdx-remote` 미사용 패키지 제거 (CVE-2026-0969 대응)
- `DynamicToaster`: `dynamic({ ssr: false })` 대신 `useState + useEffect` 패턴으로 교체 (BailoutToCSRError 방지)
- 페이지 트랜지션 개선: blur 제거 → fade-up, 첫 진입 Hydration 블랭크 이슈 해결
- 관리자 방명록 닉네임 `GitHub User` → `Admin` 고정

### v1.0.1 — 2026-03-02

**번들 최적화**
- `techIcons.ts`: `import * as si from 'simple-icons'` 제거 → ICON_MAP에 사용 중인 아이콘 59개만 개별 named import
- First Load JS 대폭 감소 (simple-icons 3,000+ 아이콘 전체 번들 제외)

**Live Status 위젯**
- GitHub 섹션 하드코딩 mock 데이터 제거 (FORCE_MOCK_GITHUB, MOCK_REPOS 등)
- `/api/github/stats` API 응답만 사용, `repos` 없을 시 섹션 숨김

**빌드 안정화**
- `projects`, `contact`, `admin/dashboard` 페이지에 `export const dynamic = 'force-dynamic'` 추가
- 빌드 타임 `DYNAMIC_SERVER_USAGE` 에러 노이즈 제거

---

## 🔧 트러블슈팅

### BailoutToCSRError (Toaster 렌더링 실패)
- **원인**: Next.js 15.5.x + `dynamic({ ssr: false })`를 root layout에서 사용 시 에러가 전파되어 화면 전체 미렌더링
- **해결**: `useState + useEffect` 패턴으로 교체 (`DynamicToaster.tsx` 참고)

### GitHub Private 커밋 집계 불가
- **원인**: REST Events API의 Private PushEvent는 `payload.size`, `payload.commits` 없음
- **해결**: GraphQL `contributionsCollection` API로 대체 (`repo` + `read:user` 스코프 필요)

### Spotify 위젯 미표시
- **원인**: Spotify Free 계정은 Web API 자체가 비활성화됨 (Premium 전용)
- **해결**: API 호출 실패 시 `isPlaying: false` 반환 → 위젯 자동 숨김

### Supabase RLS 정책 충돌
- **원인**: SELECT 정책은 OR로 합산되어, `USING(true)` 정책이 하나라도 있으면 모든 제한 무효화
- **해결**: RLS 정책 간 우선순위 및 조건을 꼼꼼히 검토

### 무한 새로고침 문제
- **원인**: Next.js 15 에러 컴포넌트 누락
- **해결**: `src/app/error.tsx` 파일 생성

### Tailwind CSS 스타일 미적용
- **원인**: `src/app` 경로가 `tailwind.config.ts`에 없음
- **해결**: `content` 배열에 `"./src/app/**/*.{js,ts,jsx,tsx,mdx}"` 추가

### TypeScript 타입 오류
- **원인**: Supabase 스키마 변경 후 타입 미갱신
- **해결**: `npx supabase gen types ...` 명령어로 타입 재생성

---

## 📚 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Jotai Documentation](https://jotai.org)

---

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE)로 배포됩니다.

---

**Made with ❤️ using Next.js 15 and Supabase**
