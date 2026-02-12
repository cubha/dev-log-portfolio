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
│   │   ├── projects/
│   │   │   └── page.tsx              # 프로젝트 리스트 (/projects)
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
│   │   └── auth/
│   │       ├── login.ts              # 서버 액션: 로그인 처리
│   │       └── logout.ts             # 서버 액션: 로그아웃 처리
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
