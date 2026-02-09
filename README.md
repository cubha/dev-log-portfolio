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
│   │   ├── projects/
│   │   │   └── page.tsx              # 프로젝트 리스트 (/projects)
│   │   └── (admin)/                  # 🔐 라우트 그룹 (관리자 영역)
│   │       ├── login/
│   │       │   └── page.tsx          # 로그인 페이지 (/login)
│   │       └── admin/
│   │           ├── layout.tsx        # 관리자 전용 레이아웃 (헤더+사이드바)
│   │           └── dashboard/
│   │               └── page.tsx      # 대시보드 (/admin/dashboard)
│   │
│   ├── components/                   # 🧩 재사용 컴포넌트
│   │   ├── common/
│   │   │   ├── BackButton.tsx        # '메인으로' 뒤로가기 버튼
│   │   │   └── FloatingAdminButton.tsx # 플로팅 유저 메뉴 (로그아웃 등)
│   │   ├── admin/
│   │   │   └── LogoutButton.tsx      # 로그아웃 버튼 (variant 지원)
│   │   └── projects/
│   │       └── ProjectCard.tsx       # 프로젝트 카드 UI
│   │
│   ├── utils/                        # 🔧 유틸리티 함수
│   │   ├── supabase/
│   │   │   ├── server.ts             # 서버 컴포넌트용 Supabase 클라이언트
│   │   │   ├── client.ts             # 클라이언트 컴포넌트용 Supabase 클라이언트
│   │   │   └── middleware.ts         # JWT 검증 + 권한 검사 로직
│   │   └── auth/
│   │       ├── login.ts              # 서버 액션: 로그인 처리
│   │       └── logout.ts             # 서버 액션: 로그아웃 처리
│   │
│   ├── types/                        # 📝 TypeScript 타입 정의
│   │   ├── supabase.ts               # Supabase CLI로 생성된 DB 타입
│   │   └── database.ts               # 커스텀 타입 정의
│   │
│   └── middleware.ts                 # 🔒 전역 미들웨어 (경로 보호 엔트리)
│
├── supabase/                         # 🗄️ Supabase 관련 파일
│   └── schema.sql                    # 데이터베이스 스키마
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
  - [x] 카드 레이아웃
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

### 🚧 개발 예정

- [ ] 프로젝트 상세 페이지
- [ ] 프로젝트 CRUD (생성/수정/삭제)
- [ ] 프로필 관리
- [ ] 기술 스택 관리
- [ ] 마크다운 에디터
- [ ] 이미지 업로드
- [ ] 검색 & 필터링

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
   - Next.js 라우트 그룹 `(admin)` 활용한 관리자 영역 구성
   - 관리자 전용 레이아웃 생성 (`src/app/(admin)/admin/layout.tsx`):
     - 상단 헤더 (타이틀, 메인으로 이동, 로그아웃 버튼)
     - 사이드바 네비게이션 (대시보드, 프로젝트 관리)
     - 관리 도구 느낌의 깔끔한 디자인
   - 대시보드 메인 페이지 (`src/app/(admin)/admin/dashboard/page.tsx`):
     - 통계 카드 3개 (전체 프로젝트, 기술 스택, 주요 프로젝트)
     - Supabase count 쿼리로 실시간 통계 표시
     - 빠른 액션 버튼 (프로젝트 관리, 기술 스택 관리)
   - 로그인 페이지 (`src/app/(admin)/login/page.tsx`):
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
