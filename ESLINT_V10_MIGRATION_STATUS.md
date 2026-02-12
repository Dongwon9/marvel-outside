# ESLint v10 마이그레이션 상태 보고서

**작성 일자**: 2026년 2월 12일  
**현재 ESLint 버전**: 9.39.2  
**체크 결과**: 대부분 준비 완료, 몇 가지 선결 조건 필요

---

## 📊 현재 상태 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| **Node.js 버전** | ✅ 준비됨 | v24.12.0 (v20.19.0+ 필요) |
| **설정 형식** | ✅ 준비됨 | Flat config 완벽하게 마이그레이션됨 |
| **eslint-env 주석** | ✅ 준비됨 | node_modules의 외부 패키지에만 존재 |
| **구형 설정 파일** | ✅ 준비됨 | .eslintrc, .eslintrc.json 없음 |
| **현재 Lint 상황** | ⚠️ 개선 필요 | frontend의 test.setup.js에서 오류 발생 |

---

## 🔴 선결 조건: Frontend Lint 오류 해결

### 문제 현황
```
Error: Error while loading rule '@typescript-eslint/await-thenable': 
You have used a rule which requires type information, but don't have parserOptions 
set to generate type information for this file.

Occurred while linting /frontend/src/test.setup.js
```

### 원인
- `test.setup.js`는 JavaScript 파일이지만 TypeScript ESLint 규칙이 type checking을 시도함
- frontend의 eslint.config.js가 모든 파일에 TS 규칙을 적용하는 글로벌 설정을 사용 중

### 해결 방안

#### 방법 1: test.setup.js 제외 (권장)
```javascript
// frontend/eslint.config.js 수정
export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "eslint.config.js",
      "jest.config.js",
      "vitest.config.ts",
      "vite.config.ts",
      "tailwind.config.js",
      "src/test/mocks.ts",
      "src/test.setup.js",  // 👈 추가
    ],
  },
  // ...
];
```

#### 방법 2: JS 파일 별도 설정
```javascript
// 모든 TS 규칙을 TS/TSX 파일에만 적용
{
  files: ["**/*.{ts,tsx}"],  // ← 이미 있음
  rules: {
    // TypeScript 규칙들...
  },
},
{
  files: ["**/*.{js,jsx}"],
  rules: {
    // JS 전용 규칙들...
  },
},
```

---

## ✅ 마이그레이션 준비 상태

### 완벽히 준비된 항목
1. ✅ **노드 버전**: v24.12.0은 모든 요구사항 충족
2. ✅ **설정 형식**: Flat config (eslint.config.js) 형식으로 완벽하게 마이그레이션됨
3. ✅ **구형 설정**: 레거시 설정 파일 없음
4. ✅ **의존성**: 적절한 버전으로 설치됨
   - @eslint/js: 9.39.2
   - typescript-eslint: 8.54.0
   - eslint-plugin-prettier: 5.5.5
5. ✅ **플러그인**: 필수 플러그인 모두 설치
   - eslint-plugin-import
   - eslint-plugin-unused-imports
   - 백엔드: eslint-plugin-jest
   - 프론트엔드: eslint-plugin-react-hooks, eslint-plugin-react-refresh

### 선결 조건
1. ⚠️ **Frontend Lint 오류 해결** (위의 해결 방안 참고)
2. ⚠️ **테스트 상태 확인** (오류 해결 후)

---

## 🚀 예상 마이그레이션 영향도 분석

### 1. 새로운 권장 규칙 (3개)
```javascript
// ESLint v10에서 기본 활성화됨
"no-unassigned-vars": "warn"      // 할당되지 않은 변수
"no-useless-assignment": "warn"   // 불필요한 할당
"preserve-caught-error": "warn"   // catch error 처리
```

**대응 방법**:
- 현재 코드를 정리: 미사용 변수 제거, 불필요한 할당 제거
- 또는 설정에서 비활성화

### 2. JSX 참조 추적 개선
- 이전: JSX 요소의 참조가 추적되지 않음
- 현재: JSX 참조도 올바르게 추적됨
- **영향**: 불필요한 import 제거 시 경고가 정확해짐

### 3. Program AST 범위 확장
- 이전: 코드 부분만 포함
- 현재: 주석과 공백포함 전체 텍스트 포함
- **영향**: 일반적으로 사용자 코드에 영향 거의 없음

### 4. 기타 변경사항
- **POSIX character classes**: glob 패턴에서 사용 가능
- **colorized output**: NO_COLOR 환경변수 추가 존중
- **SourceCode 메서드 제거**: 커스텀 규칙이 없으므로 영향 없음

---

## 📋 마이그레이션 체크리스트

### 단계 0: 선결 조건 (현재)
- [ ] Frontend lint 오류 해결
  ```bash
  # frontend/eslint.config.js에 src/test.setup.js 추가
  ```
- [ ] 모든 변경사항 Git commit
- [ ] 현재 lint 상태 기록
  ```bash
  pnpm lint 2>&1 > lint-baseline-v9.txt
  ```

### 단계 1: ESLint 업그레이드
- [ ] 마이그레이션 브랜치 생성
  ```bash
  git checkout -b eslint-v10-migration
  ```
- [ ] 패키지 업데이트
  ```bash
  pnpm update eslint@^10 @eslint/js@^10
  ```
- [ ] 설정 검증
  ```bash
  pnpm eslint --inspect-config 2>&1 | head -50
  ```

### 단계 2: 새 규칙 대응
- [ ] Lint 실행
  ```bash
  pnpm lint 2>&1 > lint-baseline-v10.txt
  ```
- [ ] 변경사항 확인
  ```bash
  diff lint-baseline-v9.txt lint-baseline-v10.txt
  ```
- [ ] 새 규칙 문제 해결
  - `no-unassigned-vars`: 미사용 변수 제거
  - `no-useless-assignment`: 불필요한 할당 제거
  - `preserve-caught-error`: catch 변수 활용

### 단계 3: 검증 및 테스트
- [ ] Backend 테스트
  ```bash
  pnpm --filter backend test
  ```
- [ ] Frontend 테스트
  ```bash
  pnpm --filter frontend test
  ```
- [ ] 통합 테스트
  ```bash
  pnpm test:integration
  ```

### 단계 4: 최종 확인
- [ ] Docker 재빌드 (필요 시)
  ```bash
  docker compose down
  docker compose up --build
  ```
- [ ] PR 생성 및 검토

---

## 🎯 예상 시간 소요

| 단계 | 소요 시간 |
|-----|---------|
| 선결 조건 (Frontend 오류 해결) | 15분 |
| 패키지 업그레이드 | 5분 |
| 새 규칙 대응 | 30분-1시간 |
| 테스트 및 검증 | 30분 |
| **총 소요 시간** | **1.5-2시간** |

---

## 🔗 관련 문서

1. [ESLint v10 마이그레이션 계획](ESLINT_V10_MIGRATION_PLAN.md)
2. [ESLint v10 공식 마이그레이션 가이드](eslint10.0-migration-guide.txt)
3. [typescript-eslint 공식 문서](https://typescript-eslint.io/)

---

## 💡 추천 사항

1. **즉시 해결 필요**
   - Frontend lint 오류 해결 (아래 단계 참고)

2. **마이그레이션 전**
   - 현재 상태 백업 (Git branch)
   - Lint baseline 기록
   - 팀 공지

3. **마이그레이션 후**
   - 자동화된 테스트 실행 (GitHub Actions 활용)
   - 코드 리뷰 필수
   - 마이그레이션 완료 문서 작성

---

## 🔧 즉시 적용: Frontend Lint 오류 해결

```javascript
// frontend/eslint.config.js
// 11번째 줄의 ignores 배열에 "src/test.setup.js" 추가

{
  ignores: [
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "eslint.config.js",
    "jest.config.js",
    "vitest.config.ts",
    "vite.config.ts",
    "tailwind.config.js",
    "src/test/mocks.ts",
    "src/test.setup.js",  // ← 이 줄 추가
  ],
},
```

적용 후:
```bash
pnpm lint
```

---

## 📞 의문사항

- **Q: 언제 마이그레이션해야 하나?**  
  A: 선결 조건(Frontend lint 오류)을 해결한 후, 저장소가 안정적인 상태에서 진행하세요.

- **Q: 롤백이 가능한가?**  
  A: Git branch를 사용하므로 언제든지 이전 버전으로 롤백 가능합니다.

- **Q: 팀원들은 어떻게 하나?**  
  A: 마이그레이션 후 merge하면 자동으로 최신 설정이 적용됩니다.

- **Q: Node.js 버전 업그레이드는 필수인가?**  
  A: 현재 v24로 충분합니다. v20.19.0 이상이면 OK입니다.
