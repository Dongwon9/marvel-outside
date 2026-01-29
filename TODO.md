# Marvel Outside - TODO List

## 🔐 Authentication & Authorization

### Backend

- [x] AuthModule 생성 및 설정 ✅
  - [x] JWT 전략 구현 (passport-jwt)
  - [x] Local 전략 구현 (로그인용)
  - [x] JWT 토큰 발급/검증 서비스
  - [x] AuthGuard 구현 (protected routes) - JwtAuthGuard 구현됨
  - [x] DTO: LoginDto, TokenResponseDto
  - [x] @Public() 데코레이터로 공개 엔드포인트 관리
- [x] User 비밀번호 검증 로직 (bcrypt) ✅
- [x] Refresh Token 구현 ✅
- [x] 로그아웃 엔드포인트 ✅

### Frontend

- [x] **로그인 페이지 만들기** ✅
  - [x] 로그인 폼 컴포넌트 (email, password)
  - [x] Tailwind CSS 스타일링
  - [x] 폼 validation
  - [x] 에러 메시지 표시
- [x] 회원가입 페이지 ✅
- [x] JWT 토큰 관리 ✅ (httpOnly 쿠키 기반)
- [x] API client 인증 헤더 설정 ✅ (axios interceptor 구현)
- [x] Protected Route 컴포넌트 (추가 필요 - 현재 redirect 방식)
- [x] 로그아웃 기능 ✅

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

- [x] Navigation Bar (로그인 상태 표시) ✅ (Header.tsx, HeaderRight.tsx 구현됨)
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

1. **API 연동 완성** 🔥🔥
   - [ ] User API (회원가입, 프로필 조회/수정)
   - [ ] Post API (CRUD, 페이지네이션)
   - [ ] Board API (목록 조회)
   - [ ] Follow API (팔로우/언팔로우)
   - [ ] Rate API (좋아요/싫어요)
2. **UI 컴포넌트 완성** 🔥
   - [ ] Post Card 컴포넌트
   - [ ] Comment 컴포넌트
   - [ ] Like/Dislike 버튼 컴포넌트
   - [ ] Follow 버튼 컴포넌트
   - [ ] Loading Spinner
3. **테스트 강화**
   - [ ] Auth Service 통합 테스트
   - [ ] Post Service 통합 테스트
   - [ ] Follow Service 통합 테스트
   - [ ] Rate Service 통합 테스트
4. **데이터베이스 모델 확장**
   - [ ] Comment 모델 추가
   - [ ] Image/Media 모델 추가
5. **보안 및 성능**
   - [ ] CORS 최종 설정
   - [ ] Rate Limiting 구현
   - [ ] 캐싱 전략 (Redis)

---

## 📅 Notes

- 첫 번째 풀스택 프로젝트이므로 단계별로 진행
- 고급 CI/CD는 필요할 때까지 미룸
- 코드 품질과 일관성 유지가 중요

---

## 🎉 Recent Progress

### 완료된 작업 (2026년 1월 28일)

#### 백엔드

- ✅ AuthModule 전체 구현 (JWT, Local 전략, AuthGuard)
- ✅ @Public() 데코레이터로 공개 엔드포인트 관리
- ✅ User, Post, Board, Follow, Rate 모듈 구현
- ✅ Prisma 마이그레이션 (User, Post, Board, Follow, Rate 모델)
- ✅ bcrypt 기반 비밀번호 해싱
- ✅ Refresh Token 시스템
- ✅ User Service 통합 테스트 완료

#### 프론트엔드

- ✅ 로그인/회원가입 페이지 완성 (UI + validation + 에러 처리)
- ✅ axios 기반 API client 구성
- ✅ httpOnly 쿠키를 활용한 토큰 관리
- ✅ axios interceptor로 자동 인증 헤더 설정
- ✅ Header 컴포넌트 (로그인 상태 표시)
- ✅ 모든 핵심 페이지 (Home, Board, Post, Profile 등)

### 다음 단계

1. **API 연동 완성** - 현재 우선순위
   - User API 연동 (회원가입, 프로필)
   - Post API 연동 (CRUD)
   - Board API 연동
   - Follow API 연동
   - Rate API 연동

2. **UI 컴포넌트 구현**
   - Post Card, Comment, Like/Dislike, Follow 버튼
   - Loading Spinner, Error Boundary

3. **테스트 커버리지 향상**
   - Auth, Post, Follow, Rate Service 통합 테스트
   - Frontend Component 테스트

---

**Last Updated**: 2026년 1월 28일
