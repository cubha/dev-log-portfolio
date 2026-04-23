# Design Tokens

> 생성일: 2026-04-23
> 출처: /init-design 역추출 — src/ (Silver V2 기준)
> 프로젝트: dev-log-portfolio (SILVER.DEV 포트폴리오)
> 갱신 방법: /redesign (전면 교체) | /init-design --dry-run (재확인)

---

## Color

> 소스: `src/app/globals.css` `:root` / `.dark` 블록

| 토큰명 | 라이트 | 다크 | 역할 |
|---|---|---|---|
| `--bg` | `#FAFAF8` | `#0D0D0D` | 페이지 기본 배경 |
| `--bg-1` | `#F4F4F0` | `#121212` | 1단계 상승 표면 |
| `--bg-2` | `#EDEDE8` | `#171717` | 2단계 상승 표면 |
| `--fg` | `#18181B` | `#E8EAED` | 주 텍스트 |
| `--fg-muted` | `#64748B` | `#8A8F98` | 보조 텍스트 |
| `--fg-subtle` | `#94A3B8` | `#5A5F68` | 약한 텍스트 (레이블·플레이스홀더) |
| `--border` | `rgba(15,23,42,0.08)` | `rgba(255,255,255,0.08)` | 기본 테두리 |
| `--border-strong` | `rgba(15,23,42,0.14)` | `rgba(255,255,255,0.14)` | 강조 테두리 |
| `--accent` | `#64748B` | `#C8D1DC` | 핵심 강조색 (Cool Silver) |
| `--accent-hover` | `#475569` | `#E2E8F0` | 강조색 호버 |
| `--accent-dim` | `rgba(100,116,139,0.08)` | `rgba(200,209,220,0.12)` | 강조색 배경 (딤) |
| `--accent-line` | `rgba(100,116,139,0.35)` | `rgba(200,209,220,0.35)` | 강조색 라인/그림자 |
| `--code-bg` | `#1A1A1A` | `#0A0A0A` | 코드 블록 배경 |
| `--card-hover` | `rgba(15,23,42,0.02)` | `rgba(255,255,255,0.025)` | 카드 호버 오버레이 |

### 시맨틱 컬러 (신규 토큰 — globals.css 등록 필요)

| 토큰명 | 값 | 역할 | 현재 상태 |
|---|---|---|---|
| `--color-success` | `#22C55E` | 라이브/온라인 상태 (초록 닷) | ✅ globals.css 등록 완료 |
| `--color-success-glow` | `rgba(34,197,94,0.5)` | success 글로우 그림자 | ✅ globals.css 등록 완료 |
| `--color-error` | `#ef4444` | 에러·삭제·경고 텍스트 | ✅ globals.css 등록 완료 |
| `--color-error-border` | `rgba(239,68,68,0.4)` | 에러 박스 테두리 | ✅ globals.css 등록 완료 |
| `--color-error-bg` | `rgba(239,68,68,0.06)` | 에러 박스 배경 | ✅ globals.css 등록 완료 |

### 메탈릭 그라디언트 (그대로 사용, 변경 금지)

| 토큰명 | 용도 |
|---|---|
| `--metal-border` | 버튼·카드·태그의 metallic 테두리 |
| `--metal-border-soft` | 카드·태그 기본 상태 |
| `--metal-border-strong` | 카드·태그 호버 상태 |
| `--metal-fill` | 버튼 호버 배경 |
| `--metal-text` | `.metallic` 텍스트 그라디언트 (Hero·Assembly Line 단 2곳) |
| `--card-highlight` | 카드 좌상단 하이라이트 radial |

---

## Typography

> 소스: `src/app/globals.css`, `tailwind.config.ts`

### 폰트 패밀리

| 역할 | 폰트 | 용도 |
|---|---|---|
| Display / Body | `Pretendard Variable`, `Pretendard` | 한국어+영문 본문·제목 |
| Mono | `JetBrains Mono` | 레이블·태그·코드·브랜드명 |

### Body 기본값

```
font-size: 15px
line-height: 1.6
letter-spacing: -0.005em
```

### 타입 스케일 (커스텀 유틸 클래스)

| 클래스 | font-size | weight | letter-spacing | line-height | 용도 |
|---|---|---|---|---|---|
| `.h-hero` | `clamp(64px, 10.5vw, 152px)` | 700 | -0.05em | 0.95 | 최대 히어로 제목 |
| `.h-section` | `clamp(44px, 6.1vw, 88px)` | 700 | -0.045em | 1 | 섹션 대형 제목 |
| `.h-1` | `clamp(32px, 4.4vw, 64px)` | 700 | -0.04em | 1.05 | 페이지 주제목 |
| `.h-2` | `clamp(24px, 2.8vw, 40px)` | 600 | -0.03em | 1.1 | 섹션 소제목 |
| `.h-3` | `22px` | 600 | -0.015em | 1.3 | 블록 제목 |
| `.h-4` | `17px` | 600 | -0.01em | — | 카드·리스트 제목 |

---

## Spacing

> 패딩·간격은 대부분 `clamp()` 또는 `px` 단위 직접 사용. 주요 패턴:

| 용도 | 값 |
|---|---|
| 헤더 높이 | `64px` |
| 글로벌 수평 패딩 | `clamp(20px, 4vw, 40px)` |
| 푸터 패딩 | `clamp(40px, 5vw, 56px) clamp(20px, 4.4vw, 64px)` |
| 블로그 상세 수평 패딩 | `clamp(16px, 3.9vw, 56px)` |
| 카드 갭 | `40px` |
| 섹션 간격 | `80px ~ 120px` (페이지별 상이) |
| TOC 스크롤 오프셋 | `88px` |

---

## Border Radius / Shadow

| 토큰명 / 값 | 용도 |
|---|---|
| `999px` | 태그 (`.tag`) pill 형태 |
| `50%` | 아이콘 버튼·브랜드 닷 |
| `border: 1px solid var(--border)` | 카드·입력·헤더 기본 테두리 |
| `.shadow-sharp` (light) | `0 1px 3px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)` |
| `.shadow-sharp` (dark) | `0 1px 1px rgba(0,0,0,0.50), 0 2px 4px rgba(0,0,0,0.20)` |

---

## Motion / Animation

| 값 | 용도 |
|---|---|
| `transition: color 0.2s` | 텍스트 컬러 기본 전환 |
| `transition: background-color 0.2s, color 0.2s` | 테마 전환 (body) |
| `transition: transform 0.18s` | 버튼 화살표·카드 transform |
| `transition: padding-left 0.2s` | `.row-link` 호버 들여쓰기 |
| `transition: transform 0.3s cubic-bezier(.4,0,.2,1)` | `.row-link::before` 언더라인 |
| `transition: transform 0.28s cubic-bezier(.4,0,.2,1)` | `.btn-ghost::after` 언더라인 |
| `@keyframes shine` | 메탈릭 버튼 shine 애니메이션 |
| `@keyframes spin` | 로딩 스피너 |

---

## 커스텀 유틸 클래스

> 이 프로젝트 전용 클래스. 신규 구현 시 Tailwind 조합보다 이 클래스를 **우선** 사용한다.

| 클래스 | 역할 | 대표 적용처 |
|---|---|---|
| `.metallic` | 메탈릭 그라디언트 텍스트 | Hero 이름, "The Assembly Line" — 단 2곳만 사용 |
| `.sv-mono` | JetBrains Mono 폰트 적용 | 코드·모노 텍스트 |
| `.sv-eyebrow` | JetBrains Mono, 11px, 대문자, `--fg-muted` | 섹션 아이레벨 레이블 (WRITING 등) |
| `.sv-label` | JetBrains Mono, 10px, 대문자, `--fg-subtle`, block | 사이드바·섹션 소레이블 |
| `.page-context` | JetBrains Mono, 11px, 대문자, `--fg-subtle` | 페이지 상단 경로 표시 |
| `.h-hero` ~ `.h-4` | 타입 스케일 (상단 표 참조) | 제목 위계 |
| `.text-muted` | `color: var(--fg-muted)` | 보조 텍스트 단축 |
| `.text-subtle` | `color: var(--fg-subtle)` | 약한 텍스트 단축 |
| `.cursor-glow` | 커서 추적 radial gradient 글로우 | HeroSection |
| `.btn` | 메탈릭 테두리 버튼 (화살표 포함) | CTA 버튼 전반 |
| `.btn-primary` | `.btn` + 주 컬러 강조 | 주요 액션 버튼 |
| `.btn-ghost` | 테두리 없음, 호버 시 metallic 언더라인 | 보조 네비게이션 |
| `.tag` | pill 형태 메탈릭 테두리 태그 | 기술 스택·카테고리 |
| `.card` | 메탈릭 테두리 카드 + 호버 하이라이트 | 프로젝트 카드 |
| `.row-link` | 상단 테두리 + 호버 accent 사이드바 | 블로그 목록 행 |
| `.sv-input` | underline 스타일 입력 | Contact·Login 폼 |
| `.codeblock` | 코드 블록 래퍼 | 인라인 코드 영역 |
| `.admin-input` | 어드민 전용 입력 스타일 | /admin/* 페이지 |
| `.custom-scrollbar` | 커스텀 스크롤바 | 긴 목록 영역 |

### Legacy V1 유틸 (어드민 전용 — Silver V2 범위 외)

| 클래스 | 용도 |
|---|---|
| `.glass-card`, `.border-rim-light`, `.bg-card-surface`, `.shadow-sharp` | V1 ThemeCard·어드민 compat |
| `.ambient-glow`, `.effects-fade`, `.bg-silver-metal`, `.text-silver-metal`, `.animate-shine` | V1 홈 섹션 레거시 |
| `--background`, `--foreground`, `--surface`, `--elevated` (HSL) | Tailwind color utilities → 어드민 |

---

## 레이아웃 상수

| 상수 | 값 | 용도 |
|---|---|---|
| 헤더 높이 | `64px` | TOC 스크롤 오프셋, sticky 기준 |
| 블로그 3컬럼 | `xl:grid-cols-[240px_minmax(0,1fr)_260px]` | 블로그 상세 레이아웃 |
| 모바일 기준 | `md:` (768px), `xl:` (1280px) | 헤더 nav, 블로그 사이드바 |
| 다크모드 | `class` 전략 (`next-themes`) | `.dark` 클래스로 토글 |

---

> 이 파일은 `/sh-dev-loop`·`/team-dev`의 UI 작업 시 **최우선 참조 기준**이다.
> 신규 토큰 추가는 이 파일에 먼저 등록 후 `globals.css`에 추가한다.
> 어드민 페이지(`/admin/*`)는 별도 세션에서 Silver V2 적용 예정이므로 이 파일 범위 외.
