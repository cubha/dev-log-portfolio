# Claude Code 운영 규칙: dev-log-portfolio

> 전역 공통 규칙(3-AI 협업 구조, 워크플로우, SubTask 판단, Cursor 프롬프트 작성 원칙)은
> `~/.claude/CLAUDE.md`를 따른다. 이 파일은 프로젝트 고유 내용만 기술한다.

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

## 🚫 프로젝트 추가 금지 사항

- 직접 코드 구현 및 파일 수정 (검증·분석 목적 제외)
- 실제 API 응답 확인 없이 응답 필드 구조 가정
- 인증 토큰을 클라이언트 컴포넌트 또는 `NEXT_PUBLIC_` 환경변수에 노출
