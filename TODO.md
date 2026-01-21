# Marvel Outside - TODO List

## 🔐 Authentication & Authorization

### Backend

- [x] AuthModule 생성 및 설정
  - [x] JWT 전략 구현 (passport-jwt)
  - [ ] Local 전략 구현 (로그인용)
  - [x] JWT 토큰 발급/검증 서비스
  - [ ] AuthGuard 구현 (protected routes)
  - [x] DTO: LoginDto, TokenResponseDto
- [x] User 비밀번호 검증 로직 (bcrypt)
- [x] Refresh Token 구현
- [ ] 로그아웃 엔드포인트

### Frontend

- [x] **로그인 페이지 만들기**
  - [x] 로그인 폼 컴포넌트 (email, password)
  - [x] Tailwind CSS 스타일링
  - [ ] 폼 validation
  - [ ] 에러 메시지 표시
- [x] 회원가입 페이지
- [ ] JWT 토큰 관리 (localStorage/sessionStorage) 🔥
- [ ] API client 인증 헤더 설정 🔥
- [ ] Protected Route 컴포넌트
- [ ] 로그아웃 기능

---

## 📱 Frontend Pages

### Core Pages

- [x] 홈 페이지 (게시글 목록)
- [x] 게시판 목록 페이지
- [x] 게시판별 게시글 목록
- [x] 게시글 상세 페이지
- [x] 게시글 작성/수정 페이지
- [x] 사용자 프로필 페이지
- [x] 사용자 설정 페이지

### Components

- [ ] Navigation Bar (로그인 상태 표시) 🔥
- [ ] Post Card 컴포넌트
- [ ] Comment 컴포넌트
- [ ] Like/Dislike 버튼
- [ ] Follow 버튼
- [ ] Loading Spinner
- [ ] Error Boundary

---

## 🔌 API Integration

### User API

- [ ] 회원가입 API 연동
- [ ] 프로필 조회 API
- [ ] 프로필 수정 API
- [ ] 사용자 검색

### Post API

- [ ] 게시글 목록 조회 (페이지네이션)
- [ ] 게시글 상세 조회
- [ ] 게시글 작성
- [ ] 게시글 수정
- [ ] 게시글 삭제
- [ ] 게시글 검색

### Board API

- [ ] 게시판 목록 조회
- [ ] 게시판별 게시글 조회
- [ ] 게시판 생성 (관리자)

### Follow API

- [ ] 팔로우/언팔로우
- [ ] 팔로워 목록
- [ ] 팔로잉 목록

### Rate API

- [ ] 좋아요/싫어요
- [ ] 좋아요 수 조회

---

## 🧪 Testing

### Backend

- [x] User Service 통합 테스트 완료 ✅
- [ ] Post Service 통합 테스트
- [ ] Follow Service 통합 테스트
- [ ] Rate Service 통합 테스트
- [ ] Board Service 통합 테스트
- [ ] Auth Service 통합 테스트 🔥
- [ ] E2E 테스트 (주요 플로우)

### Frontend

- [ ] Component 테스트 설정 (Vitest + Testing Library)
- [ ] 주요 컴포넌트 테스트
- [ ] API 호출 모킹 테스트

---

## 🗄️ Database & Schema

- [x] User 모델 (완료)
- [x] Post 모델 (완료)
- [x] Board 모델 (완료)
- [x] Follow 모델 (완료)
- [x] Rate 모델 (완료)
- [ ] Comment 모델 추가 (댓글 기능)
- [ ] Image/Media 모델 추가 (첨부파일)
- [ ] Notification 모델 추가 (알림)
- [ ] 인덱스 최적화
- [ ] 데이터베이스 시딩 스크립트

---

## 🎨 UI/UX

- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)
- [ ] 다크 모드 지원
- [ ] 접근성 (a11y) 개선
- [ ] 로딩 상태 표시
- [ ] 에러 페이지 (404, 500)
- [ ] 토스트/알림 시스템

---

## 🔒 Security

- [ ] CORS 설정
- [ ] Rate Limiting (API 호출 제한)
- [ ] XSS 방어
- [ ] CSRF 방어
- [ ] Input Sanitization
- [ ] 민감 정보 환경 변수 관리

---

## 📝 Documentation

- [ ] API 문서 (Swagger/OpenAPI)
- [ ] README 업데이트
  - [ ] 프로젝트 소개
  - [ ] 설치 가이드
  - [ ] 실행 방법
  - [ ] 환경 변수 설정
- [ ] 기여 가이드라인
- [ ] 아키텍처 다이어그램

---

## 🚀 DevOps & Deployment

- [ ] Production Dockerfile 작성
- [ ] Docker Compose (production)
- [ ] CI/CD 파이프라인 (선택 사항)
- [ ] 환경 변수 관리 (.env.production)
- [ ] 데이터베이스 백업 전략
- [ ] 모니터링/로깅 설정

---

## 🐛 Bug Fixes & Improvements

- [ ] 에러 핸들링 통일
- [ ] Validation 에러 메시지 개선
- [ ] 코드 중복 제거
- [ ] 성능 최적화
  - [ ] N+1 쿼리 해결
  - [ ] 캐싱 전략
- [ ] 타입 안정성 개선

---

## 📦 Features (추가 기능)

- [ ] 댓글 시스템
- [ ] 대댓글 (nested comments)
- [ ] 게시글 검색 (ElasticSearch 고려)
- [ ] 태그 시스템
- [ ] 북마크/저장 기능
- [ ] 이메일 인증
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 실시간 알림 (WebSocket)
- [ ] 이미지 업로드 (S3 등)
- [ ] 마크다운 에디터

---

## 🎯 Current Priority

1. **JWT 토큰 관리 및 API 인증 헤더 설정** 🔥🔥
   - localStorage/sessionStorage에 토큰 저장
   - API client에 Authorization 헤더 자동 추가
   - 토큰 만료 시 refresh 로직
2. **Navigation Bar 구현** 🔥
   - 로그인 상태 표시
   - 로그아웃 버튼
   - 사용자 프로필 링크
3. **Local 전략 및 AuthGuard 완성**
   - 백엔드 로그인 엔드포인트 보호
   - Protected routes 구현
4. **Auth Service 통합 테스트**
5. API 연동 완성
6. 테스트 커버리지 향상

---

## 📅 Notes

- 첫 번째 풀스택 프로젝트이므로 단계별로 진행
- 고급 CI/CD는 필요할 때까지 미룸
- 코드 품질과 일관성 유지가 중요

---

## 🎉 Recent Progress

### 완료된 작업 (2026년 1월 21일)

- ✅ AuthModule 생성 및 JWT 전략 구현
- ✅ Refresh Token 기능 추가
- ✅ 로그인/회원가입 페이지 UI 완성
- ✅ 모든 핵심 페이지 컴포넌트 생성
- ✅ bcrypt를 사용한 비밀번호 해싱

### 다음 단계

현재 인증 시스템의 프론트엔드 통합이 필요합니다:

1. JWT 토큰을 localStorage에 저장
2. API 호출 시 Authorization 헤더에 토큰 자동 포함
3. Navigation Bar에서 로그인 상태 표시
4. Protected Route 컴포넌트로 인증 필요 페이지 보호

---

**Last Updated**: 2026년 1월 21일
