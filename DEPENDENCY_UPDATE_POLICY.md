# 의존성 업데이트 정책

## 1. 환경

- **Node.js**: 24.x LTS | **pnpm**: v10.28.2 (corepack) | **구조**: backend, frontend

## 2. 버전 정책

**프로덕션/개발**: Caret (^) 사용 | **pnpm**: Exact 고정으로 팀 동기화

| 패키지     | 패치 | 마이너 | 메이저   |
| ---------- | ---- | ------ | -------- |
| Node.js    | 즉시 | -      | 년 1회   |
| pnpm       | 월간 | 월간   | 분기별   |
| NestJS     | 월간 | 분기별 | 년 1-2회 |
| React      | 즉시 | 월간   | 년 1회   |
| Prisma     | 월간 | 월간   | 분기별   |
| TypeScript | 자동 | 월간   | 분기별   |
| Jest       | 월간 | 월간   | 분기별   |

## 3. 정기 일정

**주간**: `pnpm audit` (심각도: CRITICAL 24시간, HIGH 1주일, MODERATE/LOW 월간)
**월간**: `pnpm upgrade --latest` + 테스트 (linting, unit, integration)
**분기별**: 메이저 버전 검토 (프레임워크, Node.js, pnpm)

## 4. 업데이트 절차

```bash
# 1단계: 사전 준비
git pull origin main && node --version && pnpm --version

# 2단계: 의존성 업그레이드
pnpm upgrade --latest  # 전체
# 또는 특정 워크스페이스
pnpm --filter backend upgrade
pnpm --filter frontend upgrade

# 3단계: 테스트 및 검증
pnpm lint && pnpm test && pnpm test:integration && pnpm build

# 4단계: 롤백 (필요시)
git checkout origin/main -- pnpm-lock.yaml && pnpm install

# 5단계: 커밋 및 PR
git add pnpm-lock.yaml package.json
git commit -m "chore: update dependencies - Tests: ✅"
git push origin feature/update-deps
```

## 5. pnpm 버전 관리 (corepack)

```bash
# 버전 설정
corepack use pnpm@10.29.0  # 또는 pnpm@latest

# 팀원 동기화: git pull → pnpm install
# (corepack이 자동으로 올바른 버전 다운로드)
```

## 6. 워크스페이스 특이사항

```bash
# 모든 워크스페이스 업데이트
pnpm -r upgrade --latest

# 의존성 충돌 해결
pnpm install --force

# 버전 불일치
pnpm store prune
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

## 7. 보안 & 긴급 대응

```bash
pnpm audit       # 취약점 확인
pnpm audit fix   # 자동 수정
git revert <hash> && pnpm install  # 롤백
```

## 8. 주의사항

❌ 모든 의존성 한번에 최신으로 | 메이저 버전 업그레이드 후 테스트 없이 병합  
❌ 보안 취약점 외면 | 개발/프로덕션 버전 불일치

✅ 주간 보안 점검 | 월간 마이너/패치 업데이트  
✅ 메이저 업그레이드 전 계획 | 모든 업데이트 후 전체 테스트

## 9. 최신 버전 확인

```bash
npm view node version              # Node.js 최신 버전
npm view pnpm version              # pnpm 최신 버전
pnpm outdated --depth=0            # 현재 프로젝트 업데이트 가능 패키지
```

## 10. FAQ

| Q                        | A                                                   |
| ------------------------ | --------------------------------------------------- |
| Caret (^) 자동 업데이트? | 아니요. `pnpm upgrade` 주기실행 필수                |
| 특정 패키지만?           | `pnpm update react@latest`                          |
| 메이저 버전 주기?        | 주요 프레임워크 연 1-2회, 기타 분기별               |
| pnpm 버전 변경?          | `corepack use pnpm@10.29.0` → 팀원이 `pnpm install` |
| Node.js 업그레이드?      | 신규 LTS 릴리즈 후 2-3개월 대기 → 개발환경 테스트   |
| Node.js + pnpm 동시?     | 고위험 (2주 준비, 48시간 테스트) - 별도 PR          |
| 버전 불일치?             | `pnpm install` → `pnpm store prune` → Docker 재빌드 |
| corepack이란?            | Node.js 내장 도구 - pnpm 버전 관리 자동화           |
| 취약점 발견시?           | CRITICAL 24시간, HIGH 1주일, 나머지 월간            |

---

**마지막 업데이트**: 2026년 2월 24일
