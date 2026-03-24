---
name: plan
description: "dev-log-portfolio 신규 기능 구현 전 Task/SubTask 계획 수립. '계획 세워줘', 'SubTask 나눠줘' 등 언급 시 호출"
argument-hint: "[기능명 또는 작업 설명]"
---

# dev-log-portfolio Task / SubTask 계획 수립

$ARGUMENTS 에 대한 실행 계획을 수립한다.

---

## ✂️ SubTask 분리 기준

레이어 간 의존성 방향을 지키며 아래 순서로 분리한다. 한 번에 하나의 SubTask씩 구현한다.

```
[Task] 기능명
  ├── SubTask 1: DB/타입 정의     → supabase/, src/types/
  ├── SubTask 2: 유틸/액션 구현   → src/utils/, src/actions/
  ├── SubTask 3: 컴포넌트 구현    → src/components/
  └── SubTask 4: 페이지 연동      → src/app/
```

---

## 출력 형식

```
[판단 결과] 단일 Task / SubTask N개 분리

[Task] 기능명
  ├── SubTask 1: [설명]  → 파일경로
  └── SubTask N: [설명]  → 파일경로

[구현 순서 및 의존성]
- SubTask 1 완료 후 SubTask 2 진행
- ...
```
