# 📚 Dev Log Portfolio

> 개인 포트폴리오 및 경력 관리 시스템

Next.js 15와 Supabase를 활용한 풀스택 포트폴리오 웹 애플리케이션입니다. 프로젝트, 기술 스택, 경력 등을 체계적으로 관리하고 공유할 수 있습니다.

---

## 🚀 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database & Auth** | Supabase |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Type Safety** | Supabase CLI Generated Types |

---

## 📁 프로젝트 구조

```
dev-log-portfolio/
├── src/
│   ├── app/                        # 📄 Next.js App Router 페이지
│   │   ├── layout.tsx              # 전역 레이아웃
│   │   ├── page.tsx                # 홈페이지 (/)
│   │   ├── error.tsx               # 에러 바운더리
│   │   └── projects/
│   │       └── page.tsx            # 프로젝트 리스트 (/projects)
│   │
│   ├── utils/                      # 🔧 유틸리티 함수
│   │   └── supabase/
│   │       ├── server.ts           # 서버 컴포넌트용 Supabase 클라이언트
│   │       ├── client.ts           # 클라이언트 컴포넌트용 Supabase 클라이언트
│   │       └── middleware.ts       # 미들웨어용 세션 갱신 함수
│   │
│   └── types/                      # 📝 TypeScript 타입 정의
│       ├── supabase.ts             # Supabase CLI로 생성된 DB 타입
│       └── database.ts             # 커스텀 타입 정의
│
├── supabase/                       # 🗄️ Supabase 관련 파일
│   └── schema.sql                  # 데이터베이스 스키마
│
├── middleware.ts                   # 🔒 세션 체크 및 쿠키 갱신 미들웨어
├── .env.local                      # 🔐 환경 변수 (Git에서 제외됨)
└── package.json                    # 📦 의존성 관리
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

### 4. `middleware.ts` - 보안 게이트
모든 요청을 가로채서 사용자 세션을 확인하고 쿠키를 갱신합니다.

- 만료된 인증 토큰 자동 갱신
- 정적 파일 제외 (성능 최적화)
- 세션 상태 유지

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
  - [x] Empty State UI
  - [x] 반응형 디자인

### 🚧 개발 예정

- [ ] 프로젝트 상세 페이지
- [ ] 프로젝트 CRUD (생성/수정/삭제)
- [ ] 사용자 인증 (로그인/회원가입)
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

### Phase 4: 핵심 기능 구현 🚧
- 진행 예정...

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
