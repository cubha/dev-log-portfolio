# UX Brief — SILVER.DEV 포트폴리오

> 생성일: 2026-04-23
> 출처: /init-design 역추출 (기존 코드 기반, Silver V2 기준)
> 브랜치: feature/silver_sh
> 주의: 신규 기획 브리프가 아닌 현행 구현 문서화

---

## 1. 화면 맵 (라우트 구조)

```
/ (홈)                     ← Silver V2 완료
├── /about                 ← Silver V2 완료
├── /projects              ← Silver V2 완료
│   └── /projects/[slug]   ← 프로젝트 상세 (모달 방식)
├── /blog                  ← Silver V2 완료
│   ├── /blog/[slug]       ← Silver V2 완료 (3컬럼 레이아웃)
│   ├── /blog/new          ← 어드민 전용 (V1 유지)
│   └── /blog/edit/[id]    ← 어드민 전용 (V1 유지)
├── /contact               ← Silver V2 완료
├── /login                 ← Silver V2 완료
└── /admin/*               ← V1 유지 (별도 세션 예정)
    ├── /admin/dashboard
    ├── /admin/profile
    ├── /admin/projects
    └── /admin/skills
```

---

## 2. 글로벌 레이아웃

### 헤더 (`src/components/layout/Header.tsx`)

- **형태**: sticky, 높이 64px, 수평 `clamp(20px, 4vw, 40px)` 패딩
- **배경**: `color-mix(in srgb, var(--bg) 78%, transparent)` + `backdrop-filter: blur(14px)` (frosted glass)
- **좌**: ● SILVER.DEV (JetBrains Mono, 13px, accent 닷)
- **우(데스크톱)**: About · Projects · Writing · Contact + 다크 토글 버튼
- **우(모바일)**: 다크 토글 + 햄버거 → 우측 드로어 260px
- **어드민 숨김**: `/admin/*` 경로에서 null 반환

### 푸터 (`src/components/layout/Footer.tsx`)

- **형태**: 2컬럼 그리드 + 하단 전폭 copyright 행
- **좌**: ● SILVER.DEV (초록 닷 — 라이브 상태) + 연락처
- **우**: About · Contact · GitHub↗
- **하단**: © 2026 SILVER.DEV / BUILT WITH NEXT.JS 15 · SUPABASE · TYPESCRIPT
- **어드민 숨김**: `/admin/*` 경로에서 null 반환

### 공통 레이아웃 (`src/app/layout.tsx`)

- Provider 스택: `JotaiProvider` → `ThemeProvider` → `AuthStateInitializer`
- 폰트: Pretendard (CDN) + JetBrains Mono (Google Fonts)
- `CursorGlow` 컴포넌트: 커서 추적 radial gradient 글로우

---

## 3. 페이지별 레이아웃 원칙

### Home (`/`)
- 풀스크린 Hero → 섹션 순서: MenuPreview → AIWorkflow (The Assembly Line) → BufferPhilosophy → TechStack → RecentBlog → Footer
- Hero: `h-hero + metallic` 이름, `cursor-glow`, 풀 뷰포트 높이
- 수평 패딩: `clamp(16px, 3.9vw, 56px)` (전 섹션 통일)

### About (`/about`)
- 페이지 라벨(`.page-context`) + `.h-1` 제목
- 순서: 에세이 → Skills → ExperienceTabs (경력/학력/교육 탭)
- 타임라인 기반 레이아웃, 관리자 토글(show_experience 등) 연동

### Projects (`/projects`)
- 비대칭 에디토리얼 카드 그리드 (Featured 1개 큰 카드 + 나머지)
- 모달 방식 상세 (`ProjectDetailModal`) — 별도 라우트 없음
- 기술 스택 태그 필터 (`.tag.active`)

### Blog 목록 (`/blog`)
- 텍스트 우선 `.row-link` 행 리스트
- 상단 태그 필터 (`.tag`)
- 관리자: 인라인 CRUD (삭제 버튼 노출)

### Blog 상세 (`/blog/[slug]`)
- **3컬럼 레이아웃** (xl 이상): `240px | minmax(0,1fr) | 260px`, gap 56px
  - 좌: 메타 사이드바 (← ALL POSTS, PUBLISHED, READ TIME, TAGS, SHARE, 편집)
  - 중: 본문 (MDX) + PostNavigation + Giscus 댓글
  - 우: TableOfContents
- **모바일**: 단일 컬럼, 상단 바(뒤로가기+편집)
- 스크롤 오프셋: 88px (헤더 64px + 여유)

### Contact (`/contact`)
- 2컬럼 auto-fit 그리드 (`minmax(300px, 1fr)`)
- 좌: CONTACT INFO + LiveStatusWidget / 우: 방명록 폼
- `.sv-input` underline 인풋, `.btn.btn-primary` 제출

### Login (`/login`)
- 중앙 정렬, 최대 380px
- ● SILVER.DEV 브랜드 + `.page-context` + `.h-2.metallic` 제목
- `.sv-label` + `.sv-input` 폼 필드
- `.btn.btn-primary` 로그인 버튼

---

## 4. 핵심 인터랙션 패턴

| 패턴 | 구현 | 적용처 |
|---|---|---|
| 커서 글로우 | `CursorGlow` + `mousemove` → `--mx, --my` CSS var | Hero |
| 메탈릭 테두리 | `background-image` 더블 레이어 (base + gradient) | `.btn`, `.card`, `.tag` |
| row hover indent | `padding-left 16px` + left `scaleY(1)` accent 바 | `.row-link` (블로그 목록) |
| TOC active | `borderLeft: 1px solid var(--accent)` vs `var(--border)` | TableOfContents |
| 다크 모드 | `next-themes` `class` 전략 | 전체 |
| 키보드 네비 | `ArrowLeft / ArrowRight` | PostNavigation |
| 인라인 편집 | 관리자 로그인 시 수정 버튼 노출 | Blog 목록·상세 |

---

## 5. 구현 시 준수 원칙

1. **DESIGN-TOKENS.md 최우선**: 컬러·타이포·간격은 이 파일의 토큰 값을 그대로 사용
2. **임의 컬러 추가 금지**: 신규 컬러 필요 시 DESIGN-TOKENS.md에 먼저 등록 후 globals.css에 추가
3. **커스텀 유틸 클래스 우선**: `.btn`, `.tag`, `.card`, `.sv-label`, `.h-*` 등 기존 클래스 우선 사용
4. **신규 인라인 스타일 최소화**: 이미 CSS 클래스로 정의된 패턴은 className으로 사용
5. **메탈릭 텍스트 제한**: `.metallic` 클래스는 Hero 이름 + "The Assembly Line" 단 2곳만
6. **어드민 분리**: `/admin/*`는 별도 세션. Silver V2 패턴 강제 적용 금지
7. **서버/클라이언트 Supabase 혼용 금지**: `server.ts` / `client.ts` 구분 유지
8. **CLAUDE.md 기술 스택 고정값 준수**: Next.js 15, Supabase, TypeScript Strict, Tailwind 3.4

---

## 6. 디자인 토큰 요약

→ [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) 참조

---

> 이 파일은 `/sh-dev-loop`·`/team-dev`의 UI 레이아웃·UX 결정 시 참조 기준이다.
> 신규 화면 추가 시 이 화면 맵과 레이아웃 원칙을 먼저 확인한다.
