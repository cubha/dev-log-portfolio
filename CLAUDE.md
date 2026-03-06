# Claude Code 운영 규칙: dev-log-portfolio

> 전역 공통 규칙(개발 역할, 워크플로우, Skills)은 `~/.claude/CLAUDE.md`를 따른다.
> 이 파일은 프로젝트 고유 내용만 기술한다.

---

## 🛠️ 프로젝트 기술 스택 (고정값 — 변경 금지)

- **Framework**: Next.js 15 (App Router)
- **Backend/Auth**: Supabase (`@supabase/ssr`)
- **Language**: TypeScript Strict Mode (`any` 타입 금지)
- **Styling**: Tailwind CSS 3.4.1
- **State**: Jotai 2.17.1
- **Animation**: Framer Motion 12.34.0
- **Theme**: next-themes 0.4.6

---

## 📁 프로젝트 핵심 구조

```
src/
├── app/                # Next.js App Router 페이지
│   ├── admin/          # 관리자 대시보드 (dashboard, profile, projects, skills)
│   ├── about/          # 소개 페이지
│   ├── contact/        # 문의 페이지
│   ├── projects/       # 프로젝트 목록
│   └── login/          # 인증
├── components/         # React 컴포넌트
│   ├── admin/          # 관리자 전용 컴포넌트
│   ├── common/         # 공통 컴포넌트 (수정 시 전체 영향도 주의)
│   ├── home/           # 홈 전용
│   ├── about/          # 소개 전용
│   ├── contact/        # 문의 전용
│   ├── projects/       # 프로젝트 전용
│   └── layout/         # Header, Footer
├── utils/              # 유틸 함수 (supabase/, auth/, profile/, projects/ 등)
├── actions/            # Server Actions
├── store/              # Jotai atoms (authAtom, filterAtom, projectAtom)
└── types/              # TypeScript 타입 정의
```

---

## 📐 핵심 구현 원칙

- **최소 유추**: 확정되지 않은 기능을 자의적으로 유추하여 복잡하게 구현하지 않는다.
- **영향도 최소화**: 수정 전 연계 모듈을 분석하고 사이드이펙트 가능성을 먼저 보고한다.
- **CoT (Chain of Thought)**: 복잡한 로직은 구현 전 단계별 설계를 한글로 설명 후 구현한다.
- **불확실성 명시**: 근거가 불확실한 경우 '불확실함'을 명시하고 추측성 구현을 지양한다.
- **SubTask 순서 준수**: Task 분리 시 반드시 순서대로 하나씩 구현한다.

---

## ⚙️ Next.js 15 필수 패턴

- `cookies()`, `params`, `searchParams` → 반드시 `await` 비동기 처리
  ```ts
  // ✅ 올바른 방법
  const cookieStore = await cookies()
  const { id } = await params

  // ❌ 금지
  const cookieStore = cookies()
  ```
- 서버 컴포넌트가 기본값 — 클라이언트 상태/이벤트가 필요할 때만 `'use client'`
- `next/image` 필수 사용 (동적 URL은 `unoptimized` + `onError` 처리)
- 절대 경로(`@/...`) 우선 사용

---

## 🗄️ Supabase 클라이언트 규칙

```ts
// 서버 컴포넌트 / Server Action / Route Handler
import { createClient } from '@/utils/supabase/server'

// 클라이언트 컴포넌트
import { createClient } from '@/utils/supabase/client'
```

- 서버/클라이언트 혼용 절대 금지
- RLS 정책 영향도 항상 고려

---

## 🔷 TypeScript 규칙

- `any` 타입 **절대 금지** — `unknown` 또는 `src/types/` 내 정의된 타입 사용
- Strict Mode 준수 — null 체크 필수
- 새로운 타입은 반드시 `src/types/` 에 정의하고 재사용
  - `contact.ts`, `profile.ts`, `skill.ts`, `supabase.ts`

---

## ⚛️ Jotai 상태 관리

- 전역 상태는 반드시 `src/store/` 에 atom 정의
  - `authAtom.ts`, `filterAtom.ts`, `projectAtom.ts`
- atom 변경 시 연관 컴포넌트 영향도 반드시 확인
- 로컬 UI 상태는 `useState` 사용 (atom 남용 금지)

---

## 📦 디렉토리 규칙

```
src/components/common/   → 전체 영향. 수정 시 사이드이펙트 필수 확인
src/components/admin/    → 관리자 전용
src/actions/             → Server Actions만
src/utils/supabase/      → server.ts / client.ts 분리 유지
src/types/               → 타입 정의 전용. 기존 타입 재사용 우선
src/store/               → Jotai atom 전용
```

---

## 🚫 프로젝트 추가 금지 사항

- `any` 타입 사용
- 불필요한 `'use client'` 선언
- `components/common/` 무분별한 수정
- 기존 API 인터페이스 임의 변경
- 실제 API 응답 확인 없이 응답 필드 구조 가정
- 인증 토큰을 클라이언트 컴포넌트 또는 `NEXT_PUBLIC_` 환경변수에 노출
