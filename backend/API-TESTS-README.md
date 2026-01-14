# REST Client API Tests

이 파일은 VS Code의 REST Client 확장을 사용하여 백엔드 API를 테스트하는 방법을 설명합니다.

## 사전 요구사항

1. **VS Code REST Client 확장 설치**
   - VS Code에서 `humao.rest-client` 확장을 설치하세요
   - 또는 [이 링크](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)에서 설치

2. **백엔드 서버 실행**
   ```bash
   cd backend
   pnpm run start:dev
   ```

## 사용 방법

### 기본 사용법

1. `api-tests.http` 파일을 VS Code에서 엽니다
2. 각 요청 위에 표시되는 "Send Request" 링크를 클릭하거나
3. 요청에 커서를 두고 `Ctrl+Alt+R` (Windows/Linux) 또는 `Cmd+Alt+R` (Mac)을 누릅니다

### 변수 사용하기

파일 상단에 정의된 변수들:
- `@baseUrl`: API 서버 주소 (기본값: http://localhost:3000)
- `@contentType`: Content-Type 헤더 (기본값: application/json)

필요에 따라 이 변수들을 수정할 수 있습니다.

### 동적 변수 사용하기

일부 요청은 ID가 필요합니다. 두 가지 방법으로 사용할 수 있습니다:

#### 방법 1: 수동으로 ID 설정
```http
@userId = your-actual-user-id-here
@postId = your-actual-post-id-here
@authorId = your-actual-author-id-here

### Get user by ID
GET {{baseUrl}}/users/{{userId}}
```

#### 방법 2: 응답에서 자동으로 ID 추출
응답에서 ID를 자동으로 추출하려면 `# @name` 주석을 사용하세요:

```http
### Create a new user
# @name createUser
POST {{baseUrl}}/users
Content-Type: {{contentType}}

{
  "email": "user@example.com",
  "name": "testuser",
  "password": "password123"
}

### Use the created user ID
@userId = {{createUser.response.body.id}}
GET {{baseUrl}}/users/{{userId}}
```

## API 엔드포인트

### App Controller
- `GET /` - Health check

### User API
- `GET /users` - 모든 사용자 조회
- `GET /users?skip=0&take=10` - 페이지네이션
- `GET /users?orderBy=name` - 정렬
- `GET /users/:id` - 특정 사용자 조회
- `POST /users` - 새 사용자 생성
- `PUT /users/:id` - 사용자 업데이트
- `DELETE /users/:id` - 사용자 삭제

### Post API
- `GET /posts` - 모든 게시글 조회
- `GET /posts?skip=0&take=10` - 페이지네이션
- `GET /posts?orderBy=title` - 정렬
- `GET /posts/:id` - 특정 게시글 조회
- `POST /posts` - 새 게시글 생성
- `PUT /posts/:id` - 게시글 업데이트
- `DELETE /posts/:id` - 게시글 삭제

## 통합 테스트 플로우

파일 하단의 "Integration Test Flow" 섹션에는 전체 워크플로우를 테스트하는 시퀀스가 포함되어 있습니다:

1. 작성자 사용자 생성
2. 해당 사용자로 게시글 생성
3. 게시글 조회
4. 게시글 업데이트
5. 게시글 삭제
6. 사용자 삭제

이 플로우는 응답에서 자동으로 ID를 추출하여 다음 요청에 사용합니다.

## 요청 예시

### 사용자 생성
```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "testuser",
  "password": "password123"
}
```

### 게시글 생성
```http
POST http://localhost:3000/posts
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post",
  "authorId": "user-id-here"
}
```

## 팁

1. **여러 요청 실행**: 파일에서 여러 요청을 선택하고 "Send Request"를 클릭하면 순차적으로 실행됩니다
2. **환경별 설정**: 다른 환경(개발, 스테이징, 프로덕션)을 위해 별도의 .http 파일을 만들 수 있습니다
3. **히스토리**: REST Client는 요청 히스토리를 유지하므로 이전 요청을 쉽게 다시 실행할 수 있습니다
4. **응답 저장**: 응답을 파일로 저장하려면 응답 창에서 "Save Response" 버튼을 클릭하세요

## 문제 해결

- **연결 거부**: 백엔드 서버가 실행 중인지 확인하세요 (`pnpm run start:dev`)
- **포트 충돌**: 포트 3000이 이미 사용 중이면 `@baseUrl` 변수를 수정하세요
- **404 오류**: URL 경로가 올바른지 확인하세요
- **400/422 오류**: 요청 본문이 DTO 검증 규칙을 준수하는지 확인하세요
