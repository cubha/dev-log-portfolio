---
name: plan
description: "dev-log-portfolio 신규 기능 구현 전 Task/SubTask 계획 수립. '계획 세워줘', 'SubTask 나눠줘' 등 언급 시 호출"
argument-hint: "[기능명 또는 작업 설명]"
---

# dev-log-portfolio Task / SubTask 계획 수립

$ARGUMENTS 에 대한 실행 계획을 수립한다.

> 공통 판단 기준은 글로벌 `/plan` skill과 동일. 이 파일은 프로젝트별 포맷과 페르소나를 추가 정의한다.

---

## ✂️ SubTask 분리 포맷

```
[Task] 기능명
  ├── SubTask 1: DB/타입 정의     → supabase/, src/types/
  ├── SubTask 2: 유틸/액션 구현   → src/utils/, src/actions/
  ├── SubTask 3: 컴포넌트 구현    → src/components/
  └── SubTask 4: 페이지 연동      → src/app/
```

---

## 🎭 페르소나 정의표

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

## 출력 형식

```
[판단 결과] 단일 Task / SubTask N개 분리

[Task] 기능명
  ├── SubTask 1: ...  → 파일경로
  └── SubTask N: ...  → 파일경로

[Cursor 프롬프트 작성 시 사용할 페르소나]
SubTask 1: [페르소나명]
SubTask 2: [페르소나명]
```
