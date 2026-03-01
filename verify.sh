#!/bin/bash
# ================================================================
# verify.sh — Cursor 변경 자동 검증 파이프라인
# dev-log-portfolio | Claude Code + Cursor 협업 워크플로우
#
# 사용법:
#   ./verify.sh              # Cursor가 바꾼 파일 감지 + 전체 검증
#   ./verify.sh --ts-only    # TypeScript 검사만
#   ./verify.sh --ai         # Claude AI 분석 포함 (claude 필요)
#   ./verify.sh --staged     # staged 파일만 검사
# ================================================================

set -euo pipefail

# ── 옵션 파싱 ─────────────────────────────────────────────
TS_ONLY=false
AI_MODE=false
STAGED_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --ts-only) TS_ONLY=true ;;
    --ai)      AI_MODE=true ;;
    --staged)  STAGED_ONLY=true ;;
  esac
done

# ── 색상 ──────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

pass() { echo -e "  ${GREEN}✔${NC}  $*"; }
fail() { echo -e "  ${RED}✘${NC}  $*"; }
info() { echo -e "  ${BLUE}→${NC}  $*"; }
warn() { echo -e "  ${YELLOW}!${NC}  $*"; }
header() { echo -e "\n${BOLD}${CYAN}▶ $*${NC}"; }

FAIL_COUNT=0

# ================================================================
# 1. 변경 파일 감지
# ================================================================
header "변경 파일 감지 (git diff)"

if [ "$STAGED_ONLY" = true ]; then
  CHANGED=$(git diff --cached --name-only --diff-filter=ACMRT 2>/dev/null || true)
  info "대상: staged 파일"
else
  UNSTAGED=$(git diff --name-only --diff-filter=ACMRT 2>/dev/null || true)
  STAGED=$(git diff --cached --name-only --diff-filter=ACMRT 2>/dev/null || true)
  CHANGED=$(echo -e "$UNSTAGED\n$STAGED" | sort -u | grep -v '^$' || true)
  info "대상: staged + unstaged 전체"
fi

if [ -z "$CHANGED" ]; then
  warn "변경된 파일 없음 — Cursor가 아직 수정하지 않았거나 git add 전입니다."
  exit 0
fi

FILE_COUNT=$(echo "$CHANGED" | grep -c . || true)
info "감지된 파일: ${YELLOW}${FILE_COUNT}개${NC}"
echo ""
echo "$CHANGED" | while read -r f; do [ -n "$f" ] && echo "    $f"; done

# TS 전용 모드가 아니면 spec 체크
if [ "$TS_ONLY" = false ]; then

# ================================================================
# 2. Spec 패턴 검사 (CLAUDE.md 기반)
# ================================================================
header "Spec 패턴 검사"

SPEC_FAILS=0

while IFS= read -r file; do
  # .ts/.tsx 파일만 Spec 패턴 검사 (md, json, config 등 제외)
  [[ "$file" =~ \.(ts|tsx)$ ]] || continue
  [ -z "$file" ] || [ ! -f "$file" ] && continue

  # 2-1. any 타입 금지
  if grep -n ': any' "$file" 2>/dev/null | grep -v '// eslint-disable' | grep -q .; then
    fail "any 타입 발견: $file"
    grep -n ': any' "$file" | head -3 | while read -r line; do echo "       $line"; done
    ((SPEC_FAILS++)) || true
  fi

  # 2-2. Next.js 15 — await 없는 cookies() / params / searchParams
  if grep -n 'cookies()' "$file" 2>/dev/null | grep -v 'await' | grep -v '^[[:space:]]*//' | grep -q .; then
    fail "await 없는 cookies() 발견: $file"
    ((SPEC_FAILS++)) || true
  fi

  # 2-3. 서버/클라이언트 Supabase 혼용 감지
  if grep -q "use client" "$file" 2>/dev/null && grep -q "supabase/server" "$file" 2>/dev/null; then
    fail "클라이언트 컴포넌트에서 supabase/server 사용: $file"
    ((SPEC_FAILS++)) || true
  fi

  # 2-4. 불필요한 use client (이벤트/훅 없는 파일)
  if grep -q "^'use client'" "$file" 2>/dev/null; then
    if ! grep -qE 'useState|useEffect|useRef|onClick|onChange|onSubmit|useAtom|useRouter|usePathname|useSearchParams|motion' "$file" 2>/dev/null; then
      warn "불필요한 'use client' 가능성: $file (이벤트/훅 없음)"
    fi
  fi

done <<< "$CHANGED"

if [ "$SPEC_FAILS" -eq 0 ]; then
  pass "Spec 패턴 검사 통과"
else
  ((FAIL_COUNT += SPEC_FAILS)) || true
fi

fi  # end TS_ONLY check

# ================================================================
# 3. TypeScript 컴파일 검사
# ================================================================
header "TypeScript 컴파일 검사"

TS_OUTPUT=$(npx tsc --noEmit 2>&1 || true)

if [ -z "$TS_OUTPUT" ]; then
  pass "TypeScript 오류 없음"
else
  fail "TypeScript 오류 발견"
  echo ""
  echo "$TS_OUTPUT" | head -30 | while read -r line; do echo "    $line"; done
  TS_ERR_COUNT=$(echo "$TS_OUTPUT" | grep -c 'error TS' || true)
  warn "총 ${TS_ERR_COUNT}개 오류"
  ((FAIL_COUNT += TS_ERR_COUNT)) || true
fi

# ================================================================
# 4. ESLint 검사
# ================================================================
if [ "$TS_ONLY" = false ]; then
  header "ESLint 검사"

  CHANGED_TS=$(echo "$CHANGED" | grep -E '\.(ts|tsx)$' || true)

  if [ -z "$CHANGED_TS" ]; then
    info "TS/TSX 파일 없음 — 생략"
  else
    LINT_FILES=$(echo "$CHANGED_TS" | tr '\n' ' ')
    LINT_OUTPUT=$(npx eslint $LINT_FILES --max-warnings=0 2>&1 || true)

    if echo "$LINT_OUTPUT" | grep -qE 'error|warning'; then
      fail "ESLint 오류/경고 발견"
      echo "$LINT_OUTPUT" | grep -E 'error|warning' | head -20 | while read -r line; do
        echo "    $line"
      done
      LINT_ERRS=$(echo "$LINT_OUTPUT" | grep -c 'error' || true)
      ((FAIL_COUNT += LINT_ERRS)) || true
    else
      pass "ESLint 통과"
    fi
  fi
fi

# ================================================================
# 5. Claude AI 분석 (--ai 옵션)
# ================================================================
if [ "$AI_MODE" = true ]; then
  header "Claude AI 분석 (--ai)"

  if ! command -v claude &> /dev/null; then
    warn "claude (Claude Code CLI) 를 찾을 수 없습니다."
  else
    DIFF=$(git diff HEAD -- $CHANGED 2>/dev/null | head -400)
    SPEC=$(cat CLAUDE.md 2>/dev/null || echo "CLAUDE.md 없음")

    PROMPT=$(cat <<EOF
아래는 프로젝트 규칙(CLAUDE.md)이야:
---
$SPEC
---

Cursor가 방금 수정한 파일들의 git diff야:
---
$DIFF
---

다음을 분석해줘:
1. 규칙 위반 여부 (any 타입, use client 오남용, Supabase 혼용, await 누락 등)
2. 설계 의도 이탈 여부
3. 사이드이펙트 위험 (common 컴포넌트, atom 변경 등)
4. 최종 판정: ✅ 통과 / ⚠️ 주의 / ❌ 재작업 필요

3~5줄로 요약. 문제가 있으면 파일명과 라인 번호 포함.
EOF
)

    echo ""
    echo "$PROMPT" | claude --print
  fi
fi

# ================================================================
# 최종 결과
# ================================================================
header "검증 결과"

if [ "$FAIL_COUNT" -eq 0 ]; then
  echo -e "\n  ${GREEN}${BOLD}✅ 모든 검사 통과 — Cursor 변경이 spec과 일치합니다.${NC}\n"
  exit 0
else
  echo -e "\n  ${RED}${BOLD}❌ ${FAIL_COUNT}개 문제 발견 — Cursor에 수정 프롬프트가 필요합니다.${NC}\n"
  exit 1
fi
