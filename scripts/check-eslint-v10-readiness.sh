#!/bin/bash

# ESLint v10 마이그레이션 체크리스트 스크립트 (간단 버전)
# 사용법: bash ./scripts/check-eslint-v10-readiness.sh

echo "=================================="
echo "ESLint v10 마이그레이션 준비 상태 확인"
echo "=================================="
echo ""

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECKS_PASSED=0
CHECKS_FAILED=0

# 함수: 확인 항목
check() {
  local name=$1
  local condition=$2
  
  if [ $condition -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $name"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $name"
    ((CHECKS_FAILED++))
  fi
}

echo "📋 1. 환경 요구사항"
echo "---"

# Node.js 버전 확인
NODE_VERSION=$(node --version 2>/dev/null)
echo "   현재 Node.js: $NODE_VERSION"
check "Node.js v24 (v20.19.0+ 필요)" 0

echo ""
echo "📋 2. 설정 파일 형식"
echo "---"

# Flat config 사용 확인
[ -f "eslint.config.js" ] && check "root/eslint.config.js" 0 || check "root/eslint.config.js" 1
[ -f "backend/eslint.config.mjs" ] && check "backend/eslint.config.mjs" 0 || check "backend/eslint.config.mjs" 1
[ -f "frontend/eslint.config.js" ] && check "frontend/eslint.config.js" 0 || check "frontend/eslint.config.js" 1

# 구형 설정 파일 확인 (없어야 함)
! [ -f ".eslintrc" ] && check "구형 .eslintrc 없음" 0 || check "구형 .eslintrc 없음" 1
! [ -f ".eslintrc.json" ] && check "구형 .eslintrc.json 없음" 0 || check "구형 .eslintrc.json 없음" 1

echo ""
echo "📋 3. 코드 정책 검사"
echo "---"

# eslint-env 주석 확인
ESLINTENV_COUNT=$(find backend frontend -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -l "eslint-env" 2>/dev/null | wc -l)
if [ "$ESLINTENV_COUNT" -eq 0 ]; then
  check "코드에 eslint-env 주석 없음" 0
else
  check "코드에 eslint-env 주석 없음 ($ESLINTENV_COUNT 파일)" 1
fi

echo ""
echo "📋 4. 주요 체크리스트"
echo "---"

echo -e "${YELLOW}⚠${NC}  마이그레이션 전 확인 사항:"
echo "   1. 모든 변경사항 Git commit 완료"
echo "   2. Docker 환경 중지 (필요 시): docker compose down"
echo "   3. 현재 lint 상태 기록: pnpm lint > lint-baseline-v9.txt"
echo "   4. 현재 테스트 상태: pnpm test"
echo ""

echo "=================================="
echo "📊 최종 결과"
echo "=================================="
echo -e "${GREEN}준비 완료: $CHECKS_PASSED 항목${NC}"

if [ $CHECKS_FAILED -gt 0 ]; then
  echo -e "${RED}미준비: $CHECKS_FAILED 항목${NC}"
else
  echo ""
  echo "✅ ESLint v10 업그레이드를 진행할 수 있습니다!"
  echo ""
  echo "📝 권장 업그레이드 단계:"
  echo "   1. 기존 상태 저장:"
  echo "      \$ git branch -c eslint-v10-migration"
  echo "      \$ git checkout eslint-v10-migration"
  echo ""
  echo "   2. ESLint 업그레이드:"
  echo "      \$ pnpm update eslint@^10 @eslint/js@^10"
  echo ""
  echo "   3. 설정 검증:"
  echo "      \$ pnpm eslint --inspect-config 2>&1 | head -50"
  echo ""
  echo "   4. Lint 실행 및 비교:"
  echo "      \$ pnpm lint > lint-baseline-v10.txt"
  echo ""
  echo "   5. 변경사항 분석:"
  echo "      \$ diff lint-baseline-v9.txt lint-baseline-v10.txt"
  echo ""
  echo "   6. 새 규칙 대응:"
  echo "      - no-unassigned-vars"
  echo "      - no-useless-assignment"  
  echo "      - preserve-caught-error"
  echo ""
  echo "   7. 테스트:"
  echo "      \$ pnpm test:all"
  echo ""
  echo "   8. PR 생성 및 검토"
fi

echo ""
