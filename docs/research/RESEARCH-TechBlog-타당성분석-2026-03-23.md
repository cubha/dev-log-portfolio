# 리서치 보고서: 포트폴리오 TechBlog 기능 타당성 분석

> 생성일: 2026-03-23
> 프로젝트: dev-log-portfolio (Next.js 15 + Supabase)
> 기반 자료: 없음 (독립 리서치)

---

## 1. 리서치 배경

현재 dev-log-portfolio는 프로젝트 쇼케이스, 방명록, 관리자 대시보드 등 포트폴리오 핵심 기능이 완성된 상태(Phase 10)이다. 여기에 Notion/Velog 스타일의 **GUI 마크다운 에디터 기반 기술 블로그(TechBlog)** 를 추가하는 것이 목적에 부합하는지, 그리고 적절한 구현 범위는 어디까지인지 조사한다.

### 핵심 질문
1. 포트폴리오 사이트에 블로그가 목적에 맞는가?
2. 투머치하지 않으려면 어디까지가 MVP인가?
3. 에디터는 무엇을 써야 하는가?

---

## 2. 조사 결과

### 2-1. 포트폴리오 + 블로그 통합: 업계 트렌드

#### 통합이 일반적인 이유

| 근거 | 상세 |
|---|---|
| **Vercel 공식 템플릿** | "Next.js Portfolio with Blog" 템플릿을 공식 제공 — 포트폴리오+블로그를 하나의 표준 패턴으로 취급 |
| **Magic Portfolio** | Vercel의 Magic Portfolio 템플릿도 MDX 기반 블로그 섹션 포함 |
| **해외 유명 개발자 사이트** | leerob.io(Vercel VP), joshwcomeau.com, kentcdodds.com 등 대부분 포트폴리오+블로그 통합 |
| **한국 채용 시장** | F-Lab 면접관 분석: "블로그는 논리력 증명 + 커뮤니케이션 능력 검증 수단" |

#### 대표 사례 분석

| 사이트 | 기술 스택 | 특징 |
|---|---|---|
| **leerob.io** | Next.js + MDX + Vercel | 가장 많이 포크된 포트폴리오 템플릿. Blog + Portfolio + Dashboard 통합. Vercel 공식 채택 |
| **joshwcomeau.com** | Next.js + MDX | 인터랙티브 블로그 포스트로 기술력 증명. 블로그가 주력 채널 |
| **kentcdodds.com** | Remix + MDX | 블로그를 통한 퍼스널 브랜딩이 커리어의 핵심 |

> 크리에이티브 전문직의 **72%**가 채용 담당자가 개인 웹사이트를 통해 포트폴리오를 평가한다고 응답 (2025 기준)

#### 기존 블로그 플랫폼 vs 자체 블로그

| 항목 | Velog | Tistory | Notion 연동 | GitHub Pages | **자체 블로그 (통합)** |
|---|---|---|---|---|---|
| **초기 진입 장벽** | 매우 낮음 | 낮음 | 낮음 | 높음 | 높음 |
| **SEO** | 우수 (색인 자동) | 보통 | 미흡 | 직접 관리 | **완전 제어** |
| **커스터마이징** | 없음 | 제한적 | 없음 | 테마 수준 | **무제한** |
| **브랜드 일관성** | 불가 (velog.io/@) | 불가 | 불가 | 가능 | **완전 통합** |
| **콘텐츠 소유권** | 플랫폼 종속 | 플랫폼 종속 | 플랫폼 종속 | 완전 소유 | **완전 소유** |
| **유지보수 부담** | 없음 | 없음 | 없음 | 중간 | 높음 |
| **채용 인상** | "빠르게 썼구나" | 중립 | "내용 중심" | "기술력 있다" | **"브랜딩까지 신경 씀"** |

> 핵심 차이: 플랫폼 블로그는 즉시 시작 가능하지만, 자체 블로그는 **도메인 권위(DA)가 포트폴리오 전체에 누적**되고 콘텐츠 일관성이 퍼스널 브랜드로 직결된다.

#### 채용 효과 (한국 시장 기준)

- **면접관 관점**: 블로그의 글 하나하나가 "최소 수준의 커뮤니케이션 능력과 기술 깊이"를 검증하는 수단
- **차별화**: 비슷한 이력서 중 개발 블로그 + GitHub 링크가 있는 지원자가 더 높은 평가
- **이중 가치**: 블로그 자체가 포트폴리오이면서 동시에 기술 역량 증명 (글쓰기 = 논리력)
- **자체 블로그의 추가 가치**: "블로그를 직접 만들었다"는 것 자체가 풀스택 역량 증명

#### SEO 관점

- 온라인 경험의 68%가 검색 엔진에서 시작 — 블로그 콘텐츠는 포트폴리오 유입 트래픽의 핵심 동력
- 정적 프로필 페이지만으로는 검색 노출이 제한적 → 블로그 글이 long-tail 키워드 유입 경로

### 2-2. "투머치"가 되는 기준

| 상황 | 왜 역효과인가 |
|---|---|
| **빈 블로그** | 글이 0~2개인 블로그 섹션은 "미완성" 인상 → 오히려 감점 |
| **에디터 과잉 구현** | 실시간 협업, AI 자동완성, 댓글 시스템 등 1인 블로그에 불필요한 기능 |
| **유지보수 포기** | 에디터 라이브러리 메이저 업데이트 따라가기 부담 → 방치된 기능 |
| **디자인 불일치** | 에디터 UI가 포트폴리오 디자인 시스템과 동떨어진 경우 |

#### 결론: 투머치 여부 판단

**투머치가 아닌 이유:**
- 이미 관리자 대시보드(프로젝트 CRUD), MDX 렌더링 인프라(`@mdx-js/mdx`, `shiki`), Supabase Auth/RLS가 구축됨
- 기존 인프라를 재활용하면 추가 구현량이 "새 프로젝트"보다 훨씬 적음
- 포트폴리오+블로그 통합은 업계 표준 패턴

**투머치가 되는 조건:**
- Notion 수준의 블록 에디터 (드래그 리오더, 중첩 블록, 데이터베이스 뷰 등)
- 실시간 협업 편집
- AI 자동완성
- 댓글 시스템 (이미 방명록이 있음)

### 2-3. GUI 마크다운 에디터 비교

#### 후보 라이브러리 비교표

| 기준 | **Tiptap** | **BlockNote** | **Novel** | **MDXEditor** |
|---|---|---|---|---|
| **기반** | ProseMirror | Tiptap + ProseMirror | Tiptap + Vercel AI | ProseMirror |
| **스타일** | 헤드리스 (자유 UI) | Notion 스타일 (배터리 포함) | Notion 스타일 + AI | 마크다운 네이티브 |
| **GitHub Stars** | 35.8k | 9.3k | 16.1k | 3.3k |
| **npm 주간 DL** | 531만+ | 소규모 | 소규모 | 181,507 |
| **Unpacked Size** | ~2.3MB (core) | ~7.6MB (core) | ~40KB (래퍼) | gzip 851kB |
| **최신 버전** | 3.20.4 (2026-03-16) | 0.47.2 (2026-03-20) | 1.0.2 (2025-02-11) | 3.52.5 (2026-03-21) |
| **React 19 호환** | ✅ | ❌ (StrictMode 비호환) | ✅ | ❌ (SSR 미지원) |
| **Next.js App Router** | ✅ (`immediatelyRender: false`) | ⚠️ (`reactStrictMode: false` 필요) | ⚠️ (`dynamic(ssr:false)`) | ⚠️ (`dynamic(ssr:false)`) |
| **마크다운 I/O** | 확장으로 지원 | ✅ 내장 | Tiptap 통해 지원 | ✅ 네이티브 |
| **이미지 업로드** | 확장 제공 | 플러그인 | - | 플러그인 |
| **라이선스** | MIT | MPL 2.0 | Apache 2.0 | MIT |
| **커스터마이징** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **즉시 사용 가능** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

#### 각 에디터 심층 분석

**Tiptap (1순위 추천)**
- 장점: 가장 성숙한 생태계 (35.8k stars, 주간 531만 DL), 헤드리스라 Tailwind CSS와 완벽 통합, MIT 라이선스
- 단점: UI를 직접 구축해야 함 (툴바, 메뉴 등), 학습 곡선 존재
- Next.js 15 호환: `'use client'` + `immediatelyRender: false` 옵션 하나로 SSR 해결 (StrictMode 비활성화 불필요)
- 실제 사례: drylikov/CMS (Next.js + Supabase + Tiptap 블로그 CMS 오픈소스)

**BlockNote (2순위)**
- 장점: 즉시 사용 가능한 Notion 스타일 UI, 블록 기반 편집, 다크모드 내장
- 단점: **React 19 / Next 15 StrictMode 비호환** — `reactStrictMode: false` 설정 필요, unpacked 크기 대형 (core+react 합산 ~28MB)
- 버전 0.47.2로 아직 1.0 미만 — API 변경 리스크

**Novel (비추천)**
- 장점: Vercel 팀이 관리, Tiptap 기반 래퍼로 가벼움, AI 자동완성 내장
- 단점: **최신 릴리스가 2025-02-11로 유지보수 활성도 우려**, AI 기능이 핵심인데 1인 블로그에는 과잉

**MDXEditor (2순위 대안)**
- 장점: 마크다운 네이티브, MDX 전용 설계로 기존 `@mdx-js/mdx`와 철학 일치, 주간 181,507 DL
- 단점: **gzip 851kB로 번들 매우 무거움**, SSR 미지원으로 `dynamic(ssr:false)` 필수
- 참고: 관리자 대시보드처럼 트래픽이 적은 페이지라면 초기 로드 부담 감수 가능

### 2-4. 콘텐츠 저장 방식 비교

| 방식 | 장점 | 단점 | 추천 여부 |
|---|---|---|---|
| **마크다운 원문 (TEXT)** | 단순, 이식성 높음, 다른 플랫폼 이전 용이 | 리치 컨텐츠 표현 제한 | ✅ MVP 추천 |
| **Tiptap JSON (JSONB)** | 구조적, 부분 검색/수정 가능, 에디터 상태 보존 | 이식성 낮음, 렌더링 시 JSON→HTML 변환 필요 | ⚠️ 에디터 종속 |
| **HTML (TEXT)** | 렌더링 직접 가능 | XSS 위험, sanitize 필수, 편집 시 역변환 필요 | ❌ 보안 리스크 |

**권장**: 마크다운 원문 저장 + Tiptap 에디터 (마크다운 확장 사용)
- 저장: 에디터 → `editor.storage.markdown.getMarkdown()` → Supabase TEXT 컬럼
- 렌더링: 마크다운 → `@mdx-js/mdx` + `shiki` (기존 인프라 재활용)

---

## 3. 프로젝트 적합성 분석

### 호환성: ✅ 높음

| 항목 | 현재 상태 | 블로그 활용 |
|---|---|---|
| `@mdx-js/mdx` | 프로젝트 MDX 렌더링에 사용 중 | 블로그 글 렌더링에 그대로 활용 |
| `shiki` | 코드 하이라이팅 | 블로그 코드 블록 하이라이팅 |
| Supabase Auth + RLS | 관리자/일반 유저 구분 완료 | 블로그 작성 = 관리자만, 읽기 = 공개 |
| 관리자 대시보드 | 프로젝트/스킬 CRUD UI 존재 | 블로그 관리 페이지 추가 자연스러움 |
| React 18 | 현재 사용 중 | Tiptap, BlockNote 모두 호환 |

### 도입 비용: 중간

| 작업 | 예상 복잡도 |
|---|---|
| `blog_posts` 테이블 + RLS | 낮음 (기존 패턴 재사용) |
| Tiptap 에디터 통합 | 중간 (패키지 설치 + `'use client'` 컴포넌트) |
| 에디터 툴바 UI | 중간 (Tailwind로 직접 구현 or shadcn 활용) |
| 블로그 목록/상세 페이지 | 낮음 (기존 프로젝트 목록 패턴 재사용) |
| 이미지 업로드 (Supabase Storage) | 중간 (Storage 버킷 설정 + 업로드 API) |

### 아키텍처 정합성: ✅ 자연스러움

- 기존 `src/app/admin/` 하위에 `blog/` 라우트 추가
- 기존 `src/app/` 하위에 `blog/[slug]/` 공개 라우트 추가
- `src/utils/blog/` 에 CRUD 유틸리티
- `src/types/` 에 Blog 타입 정의
- 기존 패턴(Server Component 기본 + 필요시 `'use client'`)과 완전 일치

---

## 4. 권장안

### 1순위: Tiptap 기반 마크다운 블로그 (MVP 스코프)

**근거**: 가장 성숙한 생태계, 헤드리스 구조로 디자인 시스템 통합 용이, MIT 라이선스, React 18/19 모두 호환, 실제 Next.js+Supabase CMS 사례 존재

**MVP 범위 (Phase 11로 제안):**

```
Phase 11-A: 블로그 인프라 (DB + API)
├── blog_posts 테이블 (id, author_id, slug, title, description, content, status, tags, published_at, created_at, updated_at)
├── RLS 정책 (published = 공개 읽기, draft = 관리자만)
├── src/types/blog.ts 타입 정의
└── src/utils/blog/ CRUD 유틸리티

Phase 11-B: 에디터 (관리자 페이지)
├── Tiptap 설치 (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-markdown)
├── src/components/admin/BlogEditor.tsx ('use client')
├── src/app/admin/blog/ 관리 페이지 (목록 + 작성/수정)
└── 기본 툴바 (제목, 볼드, 이탤릭, 코드블록, 링크, 리스트)

Phase 11-C: 공개 블로그 페이지
├── src/app/blog/ 목록 페이지 (태그 필터)
├── src/app/blog/[slug]/ 상세 페이지 (마크다운 렌더링 — @mdx-js/mdx + shiki 재활용)
└── 홈페이지에 최근 글 섹션 추가
```

**명시적으로 제외하는 기능 (투머치 방지):**
- ❌ 실시간 협업 편집
- ❌ AI 자동완성
- ❌ 댓글 시스템 (방명록으로 대체)
- ❌ 드래그 앤 드롭 블록 리오더
- ❌ 이미지 업로드 (Phase 12로 분리)
- ❌ SEO 메타데이터 커스터마이징 (Phase 12로 분리)

### 2순위 (대안): BlockNote 기반 블록 에디터

**근거**: Notion과 동일한 UX로 즉시 사용 가능, UI 구현 비용 거의 없음

**주의**:
- `reactStrictMode: false` 설정 필요 — 프로젝트 전역에 영향
- 버전 0.47.x로 API 안정성 미보장
- unpacked 크기 대형 (~28MB)
- MPL 2.0 라이선스 (MIT보다 제약적)

### 주의사항

1. **빈 블로그 리스크**: 출시 전 최소 3~5개 글을 미리 준비해둘 것. 빈 블로그 섹션은 역효과
2. **이미지 업로드는 MVP 이후**: Supabase Storage 연동은 별도 Phase로 분리하여 스코프 관리
3. **기존 MDX 프로젝트 상세와의 관계**: `/projects/[slug]`의 MDX 인라인 뷰와 블로그는 별개 시스템으로 운영 (혼용 금지)

---

## 5. DB 스키마 제안 (참고용)

```sql
-- blog_posts 테이블
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,           -- 마크다운 원문 저장
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',        -- PostgreSQL 배열
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 공개: published 글만 읽기 가능
CREATE POLICY "Published posts are public"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- 관리자: 모든 CRUD
CREATE POLICY "Admin full access"
  ON blog_posts FOR ALL
  USING (auth.uid() = author_id);

-- 인덱스
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
```

---

## 6. 출처

### 포트폴리오+블로그 트렌드
- [Vercel: Next.js Portfolio with Blog 템플릿](https://vercel.com/templates/next.js/nextjs-portfolio)
- [Vercel: Magic Portfolio for Next.js](https://vercel.com/templates/next.js/magic-portfolio-for-next-js)
- [F-Lab: 면접관 관점에서 본 좋은 개발자 블로그](https://f-lab.ai/en/blog/developer-blog-tips)
- [Velog: 개발자 취업준비 포트폴리오/블로그](https://velog.io/@productuidev/PREV-Portfolio-1-ProjectBlog)
- [Fueler: SEO Strategies for Personal Brands 2025](https://fueler.io/blog/seo-strategies-for-personal-brands)
- [Josh Comeau: Building an Effective Dev Portfolio](https://www.joshwcomeau.com/effective-portfolio/)
- [jkettmann: Don't Waste Your Time on a Portfolio Website](https://jkettmann.com/dont-waste-your-time-on-a-portfolio-website/) — 역효과 사례 참고

### 에디터 비교
- [Liveblocks: Which Rich Text Editor Framework in 2025](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025)
- [Wisp: Top Notion-Style WYSIWYG Editors for React](https://www.wisp.blog/blog/top-notion-style-wysiwyg-editors-for-react)
- [Tiptap: BlockNote vs Tiptap 비교](https://tiptap.dev/alternatives/blocknote-vs-tiptap)
- [Tiptap: Next.js 공식 설치 문서](https://tiptap.dev/docs/editor/getting-started/install/nextjs)
- [BlockNote: Next.js 설정 가이드](https://www.blocknotejs.org/docs/getting-started/nextjs)
- [MDXEditor: Getting Started](https://mdxeditor.dev/editor/docs/getting-started)
- [Techolyze: Best Next.js WYSIWYG Editors 2026](https://techolyze.com/open/blog/best-nextjs-wysiwyg-editors/)

### Supabase + Next.js 블로그 CMS
- [MakerKit: Build a Production Supabase Blog](https://makerkit.dev/blog/tutorials/create-blog-supabase)
- [GitHub: drylikov/CMS (Next.js + Supabase + Tiptap)](https://github.com/drylikov/CMS)
- [DEV.to: Tiptap + Next.js + Supabase Full-Stack Rich Text Editing](https://dev.to/jqueryscript/tiptap-editor-nextjs-supabase-full-stack-rich-text-editing-with-backend-integration-40lj)
- [Bloggr: Build Your Own Self-Hosted Blog with Next.js & Supabase](https://bloggr.dev/blog/build-your-own-selfhosted-blog-with-nextjs-supabase)
- [Supabase Storage + Next.js 파일 업로드 가이드](https://supalaunch.com/blog/file-upload-nextjs-supabase)

---

> 이 보고서는 Claude Code `/research` 스킬로 자동 생성되었습니다.
