# ESLint v10 마이그레이션 계획

**작성 일자**: 2026년 2월 12일  
**현재 ESLint 버전**: 9.39.2  
**목표 버전**: 10.0.0+

---

## 📋 현재 상태 분석

### ✅ 이미 준비된 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| **설정 형식** | ✓ 완료 | Flat config (`eslint.config.js`) 이미 사용 중 |
| **eslint-env 주석** | ✓ 완료 | 코드베이스에 없음 |
| **radix 규칙 옵션** | ✓ 완료 | deprecated 옵션 설정 없음 |
| **TypeScript 설정** | ✓ 대부분 준비 | typescript-eslint 8.54.0 사용 |

### ⚠️ 점검 필요 항목

| 항목 | 상태 | 조치 사항 |
|------|------|----------|
| **Node.js 버전** | ⚠️ 확인 필요 | v20.19.0+ 또는 v22.13.0+ 필요 |
| **JSX 참조 추적** | ⚠️ 관찰 필요 | 새로운 경고 발생 가능 |
| **규칙 추가됨** | ⚠️ 대응 필요 | `no-unassigned-vars`, `no-useless-assignment`, `preserve-caught-error` |

---

## 🚀 마이그레이션 단계

### Phase 1: 사전 준비 (현재)

#### 1.1 Node.js 버전 확인
```bash
node --version
# v20.19.0 이상 또는 v22.13.0 이상 필요
```

#### 1.2 의존성 버전 검토
```json
{
  "devDependencies": {
    "@eslint/js": "^9.39.2" → "^10.0.0",
    "eslint": "^9.39.2" → "^10.0.0",
    "typescript-eslint": "^8.54.0",
    "@eslint/eslintrc": "필요 시 최신 버전"
  }
}
```

#### 1.3 주요 변경 사항 검토
- **new config lookup algorithm**: 기본 동작으로 변경됨 (우리는 이미 flat config 사용)
- **JSX references tracking**: 이제 JSX 참조가 추적됨
- **New recommended rules**: 3개 새로운 규칙이 권장됨

---

### Phase 2: ESLint 업그레이드

#### 2.1 패키지 업데이트
```bash
pnpm update eslint@^10 @eslint/js@^10

# 필요한 경우:
pnpm add -D @eslint/eslintrc@^3 (FlatCompat 사용 시)
```

#### 2.2 설정 파일 검증
```bash
# 각 설정 파일 문법 확인
pnpm eslint --inspect-config
```

---

### Phase 3: 코드 및 설정 조정

#### 3.1 새로운 권장 규칙 처리
기본 활성화될 규칙:
- `no-unassigned-vars` - 할당되지 않은 변수 감지
- `no-useless-assignment` - 불필요한 할당 감지  
- `preserve-caught-error` - catch 블록의 에러 본인 사용

**조치**: 아래 중 선택
```javascript
// 옵션 1: 규칙 비활성화
rules: {
  "no-unassigned-vars": "off",
  "no-useless-assignment": "off",
  "preserve-caught-error": "off"
}

// 옵션 2: 수정 (권장)
// 코드를 규칙에 맞게 수정하고 활성 상태 유지
```

#### 3.2 JSX 참조 추적 대응
Frontend에서 새로운 경고 발생 가능:
```javascript
// 가능한 경고:
// - <Card /> 사용 후 Card 미정의
// - 미사용 import 경고 변경

// 현재 설정 확인:
// frontend/eslint.config.js에서 JSX 관련 규칙 없음 (문제 없을 가능성 높음)
```

#### 3.3 설정 파일 최적화
```javascript
// ✓ 이미 적용된 항목
- Flat config 형식
- languageOptions 올바른 사용
- plugins 올바른 등록

// ⚠️ 확인 항목
- 모든 rule은 문자열 타입 텍스트 수용 (Fixer 메서드)
- Program AST node range 처리
```

---

### Phase 4: 테스트 및 검증

#### 4.1 Linting 실행
```bash
# 순차 실행
pnpm lint

# 개별 실행
pnpm lint:be
pnpm lint:fe
```

#### 4.2 예상 변화 관찰
- 새 규칙 위반 사항 확인
- 라인 번호 위치 변화 가능 (Program range 확장)
- rule 결과 다양화 가능

#### 4.3 테스트 실행
```bash
pnpm test
pnpm test:integration
pnpm test:all
```

---

## 📝 Configuration 체크리스트

### root: `eslint.config.js`
- [x] Flat config 형식 ✓
- [x] tsconfig 경로 올바름 ✓
- [ ] 새 권장 규칙에 대한 정책 수립
- [ ] JSX 처리 확인

### backend: `backend/eslint.config.mjs`
- [x] Flat config 형식 ✓
- [x] Jest 플러그인 포함 ✓
- [ ] NestJS 데코레이터 처리 확인
- [ ] 새 권장 규칙에 대한 정책 수립

### frontend: `frontend/eslint.config.js`
- [x] Flat config 형식 ✓
- [x] React 플러그인 포함 ✓
- [ ] JSX 참조 추적 영향도 분석
- [ ] 새 권장 규칙에 대한 정책 수립

---

## ⚠️ 주요 Breaking Changes

| 변경 사항 | 영향도 | 대응 방안 |
|---------|--------|---------|
| Node.js v20.19+ 필수 | 🔴 높음 | 버전 확인 후 업그레이드 |
| 새 권장 규칙 활성화 | 🟡 중간 | 규칙별 검토 후 정책 결정 |
| JSX 참조 추적 | 🟡 중간 | Frontend 코드 리뷰 |
| no-shadow-restricted-names 확대 | 🟢 낮음 | globalThis 사용 확인 |
| Function/SourceCode 메서드 제거 | 🟢 낮음 | 커스텀 규칙 없으므로 영향 없음 |
| POSIX character classes | 🟢 낮음 | glob 패턴 검토 |

---

## 🔍 마이그레이션 체크사항

### 업그레이드 전
- [ ] Node.js 버전 확인 (v20.19.0 이상)
- [ ] 현재 lint 상태 기록 (`pnpm lint 2>&1 | tee lint-baseline.txt`)
- [ ] Git 변경 사항 모두 커밋
- [ ] 마이그레이션 브랜치 생성

### 업그레이드
- [ ] `pnpm update eslint@^10 @eslint/js@^10`
- [ ] 설정 파일 검증 (`pnpm eslint --inspect-config 2>&1 | head -50`)
- [ ] 초기 lint 실행 및 결과 기록

### 업그레이드 후
- [ ] 새 경고/에러 분석
- [ ] 규칙 정책 결정 (fix vs disable)
- [ ] 코드 수정 또는 설정 조정
- [ ] `pnpm lint` 통과 확인
- [ ] `pnpm test:all` 통과 확인
- [ ] PR 생성 및 리뷰

---

## 📚 참고 자료

- [ESLint v10 마이그레이션 가이드](eslint10.0-migration-guide.txt)
- [ESLint 공식 마이그레이션 페이지](https://eslint.org/docs/latest/use/migrate-to-10.x)
- [typescript-eslint 문서](https://typescript-eslint.io/)

---

## 🎯 예상 일정

| 단계 | 예상 소요 시간 |
|-----|--------------|
| Phase 1: 사전 준비 | 30분 |
| Phase 2: 업그레이드 | 10분 |
| Phase 3: 조정 | 1-2시간 |
| Phase 4: 테스트 | 30분 |
| **총 소요 시간** | **2-3시간** |

---

## 📌 주의사항

1. **Docker 환경**: 마이그레이션 후 Docker 이미지 재빌드 필수
   ```bash
   docker compose down
   docker compose up --build
   ```

2. **CI/CD**: 마이그레이션 후 GitHub Actions 등에서 자동으로 테스트됨

3. **팀원 동기화**: 마이그레이션 완료 후 팀원들에게 공지

4. **ESLint 캐시**: 필요 시 캐시 삭제
   ```bash
   rm -rf .eslintcache
   pnpm lint
   ```
