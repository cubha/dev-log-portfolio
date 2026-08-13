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
- **좌**: ● SILVER.DEV (SUIT, 13px, accent 닷)
- **우(데스크톱)**: About · Projects · Writing · Contact + 다크 토글 버튼
- **우(모바일)**: 다크 토글 + 햄버거 → 우측 드로어 260px
- **어드민 숨김**: `/admin/*` 경로에서 null 반환

### 푸터 (`src/components/layout/Footer.tsx`)

- **형태**: `display: flex` · `justify-content: space-between` · `flex-wrap` 2블록 (그리드 아님)
- **패딩**: `20px clamp(20px, 4.4vw, 64px)`
- **좌**: ● SILVER.DEV (초록 닷 — 라이브 상태) + Seoul, KR
- **우**: © 2026 · ALL RIGHTS RESERVED
- **어드민 숨김**: `/admin/*` 경로에서 null 반환

> 링크 행(About·Contact·GitHub↗)과 기술스택 행(BUILT WITH …)은 **현재 구현에 없다.** 과거 브리프에
> 적혀 있었으나 실제로 만들어진 적이 없거나 제거됐다(2026-08-13 소스 실측).

### 공통 레이아웃 (`src/app/layout.tsx`)

- Provider 스택: `JotaiProvider` → `ThemeProvider` → `AuthStateInitializer`
- 폰트: **SUIT** + JetBrains Mono, 둘 다 **self-host** (`public/fonts/*.woff2`, `globals.css`의 `@font-face`)
  - ⚠️ SUIT의 `font-family` 이름은 `Pretendard Variable`로 **유지**돼 있다(의도적). 자세한 내용은 `DESIGN-TOKENS.md` 「폰트 패밀리」 참조
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
6. **어드민도 Silver V2 대상이다** (2026-08-13 예외 폐지)
   - 이전 규약은 "`/admin/*`는 별도 세션. Silver V2 패턴 강제 적용 금지"였다. 이 예외가
     **드리프트의 서식지**였다 — 실측 결과 어드민의 표준 클래스 채택률이 **0%**다
     (`.btn` 0 · `.tag` 0 · `.sv-label` 0 · `.sv-input` 0 · `.card` 0, 공개 페이지는 각각 6·6·13·4·7).
     대신 채움형 실버 버튼 8개·자체 알약 21개·손으로 쓴 라벨 17개가 따로 자라 있다.
   - **채움형 실버(`.bg-silver-metal`)는 금지가 아니라 제한 사용이다.** 공개 페이지에서의
     용법은 Logo 아이콘 배지·타임라인 닷·빈 상태 CTA·FloatingAdminButton 뿐이다.
     **주 버튼은 `.btn` / `.btn-primary`(테두리형)** 이며, 어드민은 이 비율이 뒤집혀 있다.
   - 신규 어드민 UI는 §5-3(커스텀 유틸 클래스 우선)을 그대로 따른다. 기존 화면의 이행은
     별도 과제로 남아 있다(아래 §7).
7. **서버/클라이언트 Supabase 혼용 금지**: `server.ts` / `client.ts` 구분 유지
8. **CLAUDE.md 기술 스택 고정값 준수**: Next.js 15, Supabase, TypeScript Strict, Tailwind 3.4

---

## 6. 디자인 토큰 요약

→ [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) 참조

---

## 7. 미이행 — 어드민 Silver V2 이행 (2026-08-13 기준)

§5-6의 예외가 폐지되면서 **기존 어드민 화면 전체가 이행 대상**이 됐다. 현황(실측):

| 표준 | 어드민 | 공개 | 어드민이 대신 쓰는 것 |
|---|---|---|---|
| `.btn` / `.btn-primary` | 0 | 6 / 4 | `bg-silver-metal animate-shine` 채움형 8곳 |
| `.tag` / `.tag.active` | 0 | 6 | `rounded-full` 자체 구현 21곳 |
| `.sv-label` | 0 | 13 | `block text-sm font-medium text-muted mb-2` 17회 반복 |
| `.sv-input` | 0 | 4 | 인라인 `style` + Tailwind 조합 |
| `.card` | 0 | 7 | 인라인 `style={{ background, border }}` |

**주의**: `src/components/blog/BlogEditForm.tsx`도 어드민 계열 스타일을 쓰고 있어
`/admin/*` 경로 밖이지만 같은 이행 대상이다.

**게이트 공백**: 이 드리프트는 verify.sh가 못 잡는다. 토큰은 정상적으로 쓰고 있고(하드코딩 0),
*어떤 컴포넌트 클래스를 골랐는지*는 grep으로 판정할 수 없기 때문이다. 렌더 결과를 보는
`/design-lint` 또는 사람의 눈이 유일한 검출 수단이다 — 실제로 이번 건도 사용자의 육안 검토로 발견됐다.

---

> 이 파일은 `/sh-dev-loop`·`/team-dev`의 UI 레이아웃·UX 결정 시 참조 기준이다.
> 신규 화면 추가 시 이 화면 맵과 레이아웃 원칙을 먼저 확인한다.
