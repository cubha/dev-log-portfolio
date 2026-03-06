---
name: verify
description: "구현한 코드를 검증할 때 사용. '검증해줘', '체크리스트 확인', '코드 리뷰' 등 언급 시 호출"
argument-hint: "[검증할 파일경로 또는 기능명]"
---

# dev-log-portfolio 코드 검증

$ARGUMENTS 에 대해 아래 체크리스트를 순서대로 확인하고 결과를 보고한다.

---

## ✅ 검증 체크리스트

### Next.js 15
- [ ] `cookies()`, `params`, `searchParams` → `await` 처리 여부
- [ ] 서버/클라이언트 컴포넌트 구분 적절성 (`'use client'` 불필요한 선언 없음)
- [ ] `next/image` 사용 (동적 URL은 `unoptimized` + `onError` 처리)
- [ ] `.env.local` 수정 시 dev 서버 재시작 안내

### Supabase
- [ ] 서버 컴포넌트: `src/utils/supabase/server.ts` 사용
- [ ] 클라이언트 컴포넌트: `src/utils/supabase/client.ts` 사용
- [ ] RLS 정책 영향도 확인

### TypeScript
- [ ] `any` 타입 미사용 (`unknown` 또는 명시적 타입)
- [ ] `src/types/` 기존 타입 재사용 여부
- [ ] Strict Mode 위반 없음

### 외부 API 보안
- [ ] API 토큰/시크릿은 서버사이드에서만 (`route.ts`, `actions/`, `utils/supabase/server.ts`)
- [ ] `NEXT_PUBLIC_` 접두사에 시크릿 노출 금지
- [ ] 실제 API 응답 필드 확인 없이 타입 정의 금지
- [ ] API 응답 필드 없을 경우 폴백 처리 여부

### 사이드 이펙트
- [ ] Jotai atom 변경 시 연관 컴포넌트 영향도
- [ ] `components/common/` 수정 시 전체 영향도
- [ ] 기존 API 인터페이스 변경 여부

### 성능
- [ ] 과도한 리렌더링 유발 가능성
- [ ] Framer Motion 애니메이션 최적화 여부

---

## 🌐 외부 API 알려진 이슈

| API | 주의사항 |
|---|---|
| GitHub REST Events | Private 레포 PushEvent — `payload.size`, `payload.commits` 없음 → **GraphQL API 대체 필수** |
| GitHub GraphQL | `viewer.contributionsCollection` — scope: `repo` + `read:user` |
| Spotify Now Playing | Access Token 만료 시 Refresh Token 재발급 로직 필요 |

---

## 보고 형식

```
## 검증 결과: [기능명]

### ✅ 통과
- ...

### ⚠️ 경고
- ...

### ❌ 문제
- ...

### 종합 판정: ✅ 통과 / ⚠️ 수정 권장 / ❌ 수정 필요
```
