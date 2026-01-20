# Marvel Outside - TODO List

## 🔐 Authentication & Authorization

### Backend

- [ ] AuthModule 생성 및 설정
  - [ ] JWT 전략 구현 (passport-jwt)
  - [ ] Local 전략 구현 (로그인용)
  - [ ] JWT 토큰 발급/검증 서비스
  - [ ] AuthGuard 구현 (protected routes)
  - [ ] DTO: LoginDto, TokenResponseDto
- [ ] User 비밀번호 검증 로직 (bcrypt)
- [ ] Refresh Token 구현
- [ ] 로그아웃 엔드포인트

### Frontend

- [ ] **로그인 페이지 만들기**
  - [ ] 로그인 폼 컴포넌트 (email, password)
  - [ ] Tailwind CSS 스타일링
  - [ ] 폼 validation
  - [ ] 에러 메시지 표시
- [ ] 회원가입 페이지
- [ ] JWT 토큰 관리 (localStorage/sessionStorage)
- [ ] API client 인증 헤더 설정
- [ ] Protected Route 컴포넌트
- [ ] 로그아웃 기능

---

## 📱 Frontend Pages

### Core Pages
- [ ] 홈 페이지 (게시글 목록)
- [ ] 게시판 목록 페이지
- [ ] 게시판별 게시글 목록
- [ ] 게시글 상세 페이지
- [ ] 게시글 작성/수정 페이지
- [ ] 사용자 프로필 페이지
- [ ] 사용자 설정 페이지

### Components

- [ ] Navigation Bar (로그인 상태 표시)
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

- [ ] User Service 통합 테스트 완료 ✅
- [ ] Post Service 통합 테스트
- [ ] Follow Service 통합 테스트
- [ ] Rate Service 통합 테스트
- [ ] Board Service 통합 테스트
- [ ] Auth Service 통합 테스트
- [ ] E2E 테스트 (주요 플로우)

### Frontend

- [ ] Component 테스트 설정 (Vitest + Testing Library)
- [ ] 주요 컴포넌트 테스트
- [ ] API 호출 모킹 테스트

---

## 🗄️ Database & Schema

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

1. **로그인 페이지 및 인증 시스템 구현** 🔥
2. Frontend 핵심 페이지 구현
3. API 연동 완성
4. 테스트 커버리지 향상
5. 문서화

---

## 📅 Notes

- 첫 번째 풀스택 프로젝트이므로 단계별로 진행
- 고급 CI/CD는 필요할 때까지 미룸
- 코드 품질과 일관성 유지가 중요

---

**Last Updated**: 2026년 1월 20일
