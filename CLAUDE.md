# Claude Code 운영 규칙: dev-log-portfolio

## 🤖 3-AI 협업 구조 및 역할

| AI | 역할 |
|------|------|
| **Claude Code (나)** | 프로젝트 분석, SubTask 분리, Cursor 프롬프트 작성, 코드 검증 — **메인 컨트롤러** |
| **Cursor AI** | 실제 코드 구현 전담 |
| **Gemini** | 외부 리서치 전용 (최신 라이브러리 비교, 트렌드 조사, 레퍼런스 탐색) |

> ⚠️ Claude Code는 **직접 코드를 구현하지 않는다.** 분석, 설계, 지시문 작성, 검증에만 집중한다.

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

## 🔁 표준 워크플로우

```
1. 사용자 → Claude에게 Task 설명
2. Claude → 프로젝트 파일 직접 분석
3. Claude → Task / SubTask 자동 판단 후 Cursor 프롬프트 작성
4. 사용자 → Cursor에 프롬프트 전달 → 구현
5. 사용자 → Claude에게 결과 코드/경로 공유
6. Claude → 검증 체크리스트 기반 리뷰
7. 문제 발견 시 → 수정 프롬프트 재작성 후 4번 반복
※ 외부 리서치 필요 시 → Gemini 호출 후 결과를 Claude에 전달
```

---

## ✂️ SubTask 자동 판단 원칙

Claude는 아래 기준을 보고 **자동으로** 단일 Task 또는 SubTask 분리를 결정한다.

### 단일 Task로 처리
- 수정 파일 2개 이하
- 단일 레이어(컴포넌트만, 또는 API Route만) 변경
- 기존 로직의 버그 수정 또는 소규모 개선

### SubTask로 분리
아래 조건 중 하나라도 해당하면 자동 분리한다.

- 수정 파일 3개 이상
- DB 스키마 변경 + 컴포넌트 구현이 동시에 필요한 경우
- 신규 컴포넌트 생성 + 기존 파일 연동이 함께 필요한 경우
- 서로 다른 레이어(DB → 타입 → 유틸 → 컴포넌트)를 순서대로 작업해야 하는 경우

**SubTask 분리 포맷:**
```
[Task] 기능명
  ├── SubTask 1: DB/타입 정의     → supabase/, src/types/
  ├── SubTask 2: 유틸/액션 구현   → src/utils/, src/actions/
  ├── SubTask 3: 컴포넌트 구현    → src/components/
  └── SubTask 4: 페이지 연동      → src/app/
```

---

## 🎭 페르소나 정의표

Cursor 프롬프트 작성 시 작업 유형에 맞는 페르소나를 선택해 첫 줄에 명시한다.

| 작업 유형 | 페르소나 |
|---|---|
| UI 컴포넌트 구현 | 시니어 React/Tailwind CSS 프론트엔드 개발자 |
| API Route / Route Handler | 시니어 Next.js 서버사이드 개발자 |
| Server Action | 시니어 Next.js 풀스택 개발자 |
| DB 스키마 / 타입 정의 | 시니어 Supabase + TypeScript 아키텍트 |
| 외부 API 연동 | 시니어 백엔드 개발자 (서버사이드 보안 우선) |
| Jotai 상태 관리 | 시니어 React 상태관리 아키텍트 |
| 버그 수정 | 시니어 디버거 (최소 변경 원칙) |
| 성능 최적화 | 시니어 React 렌더링 최적화 전문가 |

---

## 📝 Cursor 프롬프트 작성 원칙

### 컨텍스트 범위 (필수 명시)
```
컨텍스트 범위: [@파일경로 2~3개만 지정 권장]
```
> Cursor는 컨텍스트가 넓을수록 노이즈가 증가함. 관련 파일만 지정.

### 프롬프트 내부 필수 구성 요소 (순서 고정)

1. **페르소나**: 위 정의표에서 작업 유형에 맞는 페르소나 1줄 명시
2. **형식 제약**: "코드 블록 형식으로만 출력해"
3. **수정 대상**: 참조할 `@파일경로` 명시
4. **작업 내용**: 구현/수정할 내용을 섹션(`##`)으로 명확히 구분
5. **완료 조건**: ⚠️ **항상 출력** — 구현 완료 상태를 구체적으로 기술
6. **금지 사항**: 건드리면 안 되는 파일/로직/타입 명시

### 프롬프트 템플릿

````
컨텍스트 범위: @파일경로1 @파일경로2

[작업 유형에 맞는 페르소나]로서, 아래 요구사항을 구현해줘.
코드 블록 형식으로만 출력해.

## 수정 대상
@파일경로

## 작업 내용
(구체적인 구현 내용)

## 완료 조건
- (완료 상태를 구체적으로 기술)

## 금지 사항
- (건드리면 안 되는 파일/로직)
- any 타입 사용 금지
````

---

## ✅ 코드 검증 체크리스트

### Next.js 15
- [ ] `cookies()`, `params`, `searchParams` → `await` 처리 여부
- [ ] 서버/클라이언트 컴포넌트 구분 적절성
- [ ] `next/image` 사용 (동적 URL은 `unoptimized` + `onError` 처리)
- [ ] 환경변수 변경 후 dev 서버 재시작 여부 (`.env.local` 수정 시 필수)

### Supabase
- [ ] 서버 컴포넌트: `src/utils/supabase/server.ts` 사용
- [ ] 클라이언트 컴포넌트: `src/utils/supabase/client.ts` 사용
- [ ] RLS 정책 영향도 확인

### TypeScript
- [ ] `any` 타입 미사용
- [ ] `src/types/` 기존 타입 재사용 여부
- [ ] Strict Mode 위반 없음

### 외부 API 연동
- [ ] 실제 API 응답 필드 구조 검증 (Public/Private 응답 차이 확인)
- [ ] 인증 토큰은 서버사이드에서만 사용 (`NEXT_PUBLIC_` 접두사 절대 금지)
- [ ] API 응답 필드가 없을 경우의 폴백 처리 여부
- [ ] 루프 내 break 조건이 시간/비즈니스 기준으로 설정되어 있는지 확인

### 사이드 이펙트
- [ ] Jotai atom 변경 시 연관 컴포넌트 영향도
- [ ] `components/common/` 수정 시 전체 영향도
- [ ] 기존 API 인터페이스 변경 여부

### 성능
- [ ] 불필요한 `use client` 선언 여부
- [ ] 과도한 리렌더링 유발 가능성
- [ ] Framer Motion 애니메이션 최적화 여부

---

## 🌐 외부 API 연동 규칙

외부 API 연동 작업 시 아래 규칙을 반드시 따른다.

### 응답 검증 우선 원칙
코드 구현 전에 반드시 실제 API 응답 구조를 확인한다.
- Public/Private 인증 상태에 따라 응답 필드가 달라질 수 있음
- `curl` 또는 브라우저로 직접 응답을 확인한 뒤 타입 정의
- 가정으로 타입을 정의하지 않는다

```bash
# 검증 예시 (GitHub Events API)
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.github.com/users/{username}/events?per_page=5" \
  | grep -E '"type"|"created_at"|"size"|"commits"'
```

### 보안 규칙
- API 토큰/시크릿은 반드시 서버사이드에서만 호출 (`route.ts`, `actions/`, `utils/supabase/server.ts`)
- 클라이언트 컴포넌트에서 외부 API 직접 호출 금지
- 환경변수는 `NEXT_PUBLIC_` 없이 서버 전용으로 선언

### 알려진 API 특이사항
| API | 주의사항 |
|---|---|
| GitHub REST Events (`/users/{username}/events`) | Private 레포 PushEvent는 `payload.size`, `payload.commits` 모두 없음 (payload stripped). **커밋 수 집계 불가 → GraphQL API로 대체 필수** |
| GitHub GraphQL (`/graphql` — `viewer.contributionsCollection`) | Private 포함 정확한 커밋 수 반환. 필요 scope: `repo` + `read:user` |
| Spotify Now Playing | Access Token 만료 시 Refresh Token으로 재발급 로직 필요 |

---

## 🚫 금지 사항

- 직접 코드 구현 및 파일 수정 (검증·분석 목적 제외)
- 확정되지 않은 기능 자의적 추가 제안
- 기술 스택 고정값 임의 변경 제안
- 실제 API 응답 확인 없이 응답 필드 구조 가정
- 인증 토큰을 클라이언트 컴포넌트 또는 `NEXT_PUBLIC_` 환경변수에 노출
