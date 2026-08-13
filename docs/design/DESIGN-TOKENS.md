# Design Tokens

> 생성일: 2026-04-23
> 출처: /init-design 역추출 — src/ (Silver V2 기준)
> 프로젝트: dev-log-portfolio (SILVER.DEV 포트폴리오)
> 갱신 방법: /redesign (전면 교체) | /init-design --dry-run (재확인)

---

## ⚠️ 토큰 네임스페이스 2계층 — 소비 방법이 다르다 (최우선 규약)

`globals.css :root`에는 **형식이 다른 두 계열**이 공존한다. 섞어 쓰면 CSS가 조용히 죽는다.

| 계열 | 값 형식 | 소비 방법 | 알파 모디파이어 | 예 |
|---|---|---|---|---|
| **① hex/rgba 계열** | 완성 색값 (`#18181B`) | `var(--x)` **직접** | ❌ 불가 | `--bg` `--fg` `--border` `--accent` `--code-bg` |
| **② 채널삼중값 계열** | 채널값만 (`50 13% 96%`) | **`hsl(var(--x))`** 또는 Tailwind 유틸 | ✅ 가능 | `--background` `--foreground` `--surface` `--elevated` `--metal-start/mid/end` `--brand-secondary` |

**②를 `var(--x)`로 직접 쓰면 안 된다.** `background: var(--surface)` → `background: 50 13% 96%` → **유효한 `<color>`가 아니므로 선언이 통째로 폐기된다.** 에러도 경고도 나지 않고 배경만 사라진다.

```
✅  className="bg-surface"                    ← 권장 (Tailwind 유틸)
✅  className="text-foreground/60"            ← 알파 모디파이어. 이게 ② 계열이 존재하는 이유다
✅  style={{ background: 'hsl(var(--surface))' }}
❌  className="bg-[var(--surface)]"           ← 무효. 컴파일은 되지만 브라우저가 폐기
❌  style={{ background: 'var(--surface)' }}  ← 무효
```

> **왜 hex로 통합하지 않는가**: ② 계열은 알파 모디파이어(`text-foreground/60` 등 **소스에 122건**)를 위해 존재한다. `hsl()`의 슬래시 알파 문법은 채널값이어야 성립하므로, CSS 변수 기반 다크모드와 알파를 동시에 만족시키려면 이 형식이 **필수**다. 두 계열은 중복이 아니라 능력이 다른 계층이다.

**게이트**: `bash verify.sh`의 Spec 규칙 **2-5**가 이 위반을 탐지한다. 토큰 목록은 `:root`에서 값 형식으로 자동 수집되므로 새 토큰을 추가해도 손댈 필요 없다.

**이름 충돌 해소됨 (2026-08-13)** — `accent`라는 단어가 두 색을 가리키고 있었다:
- CSS `--accent` = `#64748B` (Cool Silver) — **유지**. 소스 64회 사용
- Tailwind `colors.accent` = `hsl(var(--brand-secondary))` = 시안 계열 — **삭제됨**

`colors.accent`는 사용 0건이면서 `brand.secondary`와 값이 100% 동일한 중복 별칭이었고, 같은 단어가 다른 색을 가리켜 오용 시 조용히 잘못된 색이 나오는 함정이었다. 강조색은 `var(--accent)`, 브랜드 시안은 `brand-secondary`를 쓴다.

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
| `--code-fg` | `#E8EAED` | `#E8EAED` | 코드 블록 전경 — **라이트에서도 밝은 값** |
| `--media-placeholder` | `#1E1E1E` | `#1E1E1E` | 이미지 없는 프로젝트 카드 플레이스홀더 배경 |
| `--card-hover` | `rgba(15,23,42,0.02)` | `rgba(255,255,255,0.025)` | 카드 호버 오버레이 ⚠️**미사용** |

> **`--code-fg`가 왜 `--fg`가 아닌가**: `--code-bg`는 라이트(`#1A1A1A`)·다크(`#0A0A0A`) **양쪽 다 어둡다.**
> 코드블록만 테마와 무관하게 항상 다크인 구조라, 전경에 `--fg`를 쓰면 라이트 모드에서
> `#18181B`(거의 검정)가 되어 **어두운 배경에 어두운 글씨**가 된다. 라이트/다크 값이 같은 건
> 실수가 아니라 이 구조의 결과다. `--media-placeholder`도 같은 이유로 양쪽 동일하다.

> ⚠️ **미사용 토큰 (2026-08-13 실측, 소스 참조 0건)**: `--card-hover` · `--accent-hover` · `--metal-fill` · `--elevated`.
> 역할은 위 표에 적혀 있지만 실제로 아무도 쓰지 않는다. 새 UI를 만들 때 **먼저 이 넷을 쓸 수 있는지 확인**하고,
> 끝내 쓰이지 않으면 다음 정리 때 삭제 후보다. "역할이 적혀 있다 = 살아 있다"가 아니다.

### 채널삼중값 계열 (② 계열 — `hsl(var(--x))` 필수)

Tailwind 유틸(`bg-surface` `text-foreground` `bg-background` `border-brand-primary` 등)의 실체다.
`tailwind.config.ts`의 `colors`가 이 값들을 `hsl()`로 감싸 소비한다.

| 토큰명 | 라이트 | 다크 | 역할 |
|---|---|---|---|
| `--background` | `50 20% 98%` | `215 5% 12%` | Tailwind `bg-background` |
| `--foreground` | `240 5% 11%` | `215 5% 87%` | Tailwind `text-foreground` (알파 모디파이어 최다 사용) |
| `--surface` | `50 13% 96%` | `215 5% 20%` | Tailwind `bg-surface` — 패널·행 호버·보조 버튼 배경 |
| `--elevated` | `50 13% 93%` | `215 5% 24%` | 1단계 상승 표면 ⚠️**미사용** |
| `--metal-start` | `215 16% 40%` | `215 20% 65%` | 실버 그라디언트 시작/끝 스톱. Tailwind `brand.primary` |
| `--metal-mid` | `214 20% 75%` | `214 32% 91%` | 실버 그라디언트 하이라이트 |
| `--metal-end` | `215 16% 40%` | `215 20% 65%` | `--metal-start`와 동일 (대칭 그라디언트) |
| `--brand-secondary` | `201 96% 40%` | `200 60% 45%` | 브랜드 시안. Tailwind `brand.secondary` |

> **다크 metal 3종은 2026-08-13에 추가됐다.** 그 전까지 `.dark`가 `--metal-start/mid/end`를 재정의하지
> 않아 **라이트 값이 다크로 새고 있었다.** 다크 값은 같은 `.dark` 블록의 `--metal-border` 그라디언트
> 스톱(`#94A3B8`·`#E2E8F0`)을 채널값으로 정확 변환한 것이다. 소비처가 이미 이 방향을 전제하고 있었다 —
> `SilverButton.tsx`·`BlogEditForm.tsx`가 `dark:text-slate-950`으로 전경색을 검정으로 뒤집는데,
> 이는 **다크에서 메탈 배경이 밝아야만** 성립한다.

### 시맨틱 컬러

| 토큰명 | 값 | 역할 |
|---|---|---|
| `--color-success` | `#22C55E` | 라이브/온라인 상태 (초록 닷) |
| `--color-success-glow` | `rgba(34,197,94,0.5)` | success 글로우 그림자 |
| `--color-error` | `#ef4444` | 에러·삭제·경고 텍스트 |
| `--color-error-border` | `rgba(239,68,68,0.4)` | 에러 박스 테두리 |
| `--color-error-bg` | `rgba(239,68,68,0.06)` | 에러 박스 배경 |
| `--color-warning` | `#F59E0B` | 관리자에게만 보이는 타인 비밀글 잠금 표시 (amber) |
| `--color-like` | `#F43F5E` | 방명록 좋아요 **활성** 상태 (rose). 비활성은 `--fg-muted` |

시맨틱 컬러는 **라이트/다크가 동일**하다 — 상태 신호는 테마와 무관하게 같은 의미를 가져야 하기 때문이다.
`.dark` 블록에도 같은 값으로 재선언돼 있다(파일의 기존 컨벤션).

> `--color-warning`·`--color-like`는 2026-08-13에 신설됐다. 그 전까지 `GuestbookListClient.tsx`가
> hex를 직접 박고 있었고, 이는 브랜드색도 드리프트도 아닌 **토큰이 없어서 생긴 하드코딩**이었다.
> `--color-success`/`--color-error`와 동일한 절차로 승격했다.
>
> ⚠️ **`--color-warning`의 실효성 주의**: 적용 대상이 `🔒` **이모지**라 대부분의 브라우저가 자체 색으로
> 렌더해 `color`가 보이지 않을 수 있다. 토큰화는 하드코딩 제거가 목적이며, 이 표시를 실제로 구분되게
> 하려면 이모지 대신 아이콘 컴포넌트(lucide `Lock`)로 바꿔야 한다 — 별도 과제.

### 메탈릭 그라디언트 (그대로 사용, 변경 금지)

| 토큰명 | 용도 |
|---|---|
| `--metal-border` | 버튼·카드·태그의 metallic 테두리 |
| `--metal-border-soft` | 카드·태그 기본 상태 |
| `--metal-border-strong` | 카드·태그 호버 상태 |
| `--metal-fill` | 버튼 호버 배경 ⚠️**미사용** |
| `--metal-hover` | 버튼·카드 호버 그라디언트 |
| `--metal-text` | `.metallic` 텍스트 그라디언트 (Hero·Assembly Line 단 2곳) |
| `--card-highlight` | 카드 좌상단 하이라이트 radial |

> 이 표의 토큰들은 **완성 그라디언트**(`linear-gradient(...)`)이므로 `var(--x)` 직접 소비가 정상이다.
> 위 「채널삼중값 계열」의 `--metal-start/mid/end`와 혼동하지 말 것 — 그쪽은 그라디언트의 **스톱 색**이다.

---

## Typography

> 소스: `src/app/globals.css`, `tailwind.config.ts`

### 폰트 패밀리

> ⚠️ **패밀리 이름과 실제 타입페이스가 다르다.** `#48`(2026-08-08)에서 Pretendard → **SUIT**로 전환하면서
> `font-family` 이름은 `Pretendard Variable`로 **유지**했다(호출부 일괄 수정을 피하려는 의도적 선택,
> `globals.css:3` 주석에 명시). `@font-face`의 `src`는 `/fonts/SUIT-*.woff2`를 가리킨다.
> **CSS의 이름만 보고 Pretendard라고 판단하지 말 것.** 폰트 파일 교체 시 `public/fonts/`를 확인한다.

| 역할 | `font-family` 이름 | 실제 타입페이스 | 용도 |
|---|---|---|---|
| Display / Body | `Pretendard Variable`, `Pretendard` | **SUIT** (self-host, `public/fonts/SUIT-*.woff2`) | 한국어+영문 본문·제목 **및 레이블·태그** |
| Mono | `JetBrains Mono` | JetBrains Mono (self-host) | **`.codeblock` 전용** |

> **Mono 역할이 축소됐다.** 과거 GT는 Mono를 "레이블·태그·코드·브랜드명"으로 규정했으나, 현재
> `.sv-mono` `.sv-eyebrow` `.sv-label` `.page-context`는 모두 **SUIT**를 쓴다. JetBrains Mono가
> 남아 있는 곳은 `.codeblock` 단 하나다. 폰트는 CDN이 아니라 **self-host** 방식이다(`#40`에서 전환).

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

> ⚠️ **Spacing은 토큰이 아니다.** `--space-*` 네임스페이스가 존재하지 않으며, 아래 값들은 소스에
> `clamp()`/px 리터럴로 산재한다. **기계로 강제할 수 없는 영역**이므로 표를 최신으로 유지하는 것 외에
> 방법이 없다. 아래는 2026-08-13 소스 실측으로 정정한 값이다.

| 용도 | 값 | 실체 |
|---|---|---|
| 헤더 높이 | `64px` | `Header.tsx:38` |
| 페이지 수평 패딩 | `clamp(20px, 5.5vw, 80px)` | `about`·`projects`·`contact`·`blog` 페이지 |
| 헤더 수평 패딩 | `clamp(20px, 4vw, 40px)` | `Header.tsx:40` — 페이지와 **다르다** |
| 푸터 패딩 | `20px clamp(20px, 4.4vw, 64px)` | `Footer.tsx:14` |
| 블로그 상세 수평 패딩 | `clamp(16px, 3.9vw, 56px)` | `blog/[slug]/page.tsx:84` |
| 카드 갭 | `24px` | `globals.css` `.project-grid` |
| 섹션 간격 | `80px ~ 120px` (페이지별 상이) | — |
| TOC 스크롤 오프셋 | `88px` | `TableOfContents.tsx:54,61` |
| MDX 헤딩 스크롤 오프셋 | `96px` | `MdxComponents.tsx:35,44` — TOC와 **8px 불일치** |

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
> **어드민 페이지(`/admin/*`)도 이 파일의 범위 안이다** — 과거 "범위 외" 선언이 무검증 상태를 만들어
> 어드민에 `--surface` 무효 소비 63줄이 축적됐다(2026-08-13 정상화 완료). 범위 예외를 다시 두지 않는다.

---

## 갱신 이력

- **2026-08-13** — GT 정합성 감사 후 전면 정정. ① 네임스페이스 2계층 규약 신설(최우선 섹션) ② 폰트를
  SUIT 실체로 정정(`#48` 미반영이었음) ③ 채널삼중값 8토큰 표 신설(그전까지 **0건 문서화**) ④ 다크 metal
  3종 추가 ⑤ Spacing 값 4건 실측 정정 ⑥ 미사용 토큰 4개 표기 ⑦ `colors.accent` 삭제 반영 ⑧ 어드민 범위 예외 폐지.
  > **이 문서는 2026-04-23 생성 후 3.5개월간 한 번도 갱신되지 않았다.** 그 사이 `globals.css`는 `#40`(폰트
  > self-host)·`#45`(반응형)·`#46`(metallic)·`#48`(SUIT 전환)로 계속 움직였다. GT가 코드를 못 따라가면
  > 이 파일을 읽고 작업하는 쪽이 **틀린 전제로 시작한다**. UI를 바꿨으면 이 파일도 같은 PR에서 갱신한다.
- **2026-04-23** — `/init-design` 역추출로 최초 생성.
