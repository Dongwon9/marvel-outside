# Marvel Outside AI 코딩 지침

## 나에 대하여

- NestJS, Prisma, React, Vite, Tailwind CSS를 사용하여 풀스택 앱을 개발하는 것이 처음이므로, 코드 품질과 일관성을 보장하기 위해 상세한 지침이 필요합니다.
- 고급 CI/CD를 사용할 계획이 없고(방법도 모름), 필요할 때까지 사용하지 않을 것입니다.

## 프로젝트 개요

Marvel Outside 프로젝트를 위한 풀스택 애플리케이션입니다:

- **백엔드**: 모듈식 아키텍처의 NestJS + Prisma + PostgreSQL
- **프론트엔드**: 최신 TypeScript 설정의 React + Vite + Tailwind CSS

백엔드는 Prisma ORM을 통해 데이터베이스 작업을 처리하는 기능 모듈(User, Post, Follow, Rate)을 구현합니다. 프론트엔드는 TypeScript와 함께 React 19를 사용하고, Vite를 빌드 도구로, Tailwind CSS v4를 스타일링에 사용합니다.

## 아키텍처 패턴

### 계층화된 모듈 구조

각 기능 모듈(예: `user/`, `post/`)은 다음 패턴을 따릅니다:

- **컨트롤러** (`*.controller.ts`): HTTP 라우트, 서비스에 위임
- **서비스** (`*.service.ts`): Prisma 쿼리를 사용한 비즈니스 로직
- **모듈 등록**: 컨트롤러와 서비스가 `app.module.ts`에 등록됨

모든 모듈은 [backend/src/app.module.ts](../backend/src/app.module.ts)에서 임포트되고 선언됩니다. **NestJS CLI를 사용하여 새 모듈을 생성하세요:**

```bash
nest generate resource feature-name
```

이 명령은 다음을 생성하고 자동으로 등록합니다:

- `src/feature-name/` 디렉토리
- `feature-name.module.ts`, `feature-name.controller.ts`, `feature-name.service.ts`
- `*.spec.ts` 테스트 파일
- `app.module.ts`에 모듈 등록

**모듈 구조**:

```typescript
@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // Makes service available to other modules
})
export class FeatureModule {}
```

**수동 설정** (필요한 경우):

1. `src/feature-name/` 디렉토리 생성
2. 서비스 및 컨트롤러 파일 구현
3. `AppModule`에 등록

### 데이터 계층으로서의 Prisma

- 데이터베이스 모델은 [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)에 정의됨
- `PrismaService` ([backend/src/prisma/prisma.service.ts](../backend/src/prisma/prisma.service.ts))는 PostgreSQL용 `PrismaPg` 어댑터로 `PrismaClient`를 확장함
- 생성된 타입은 `backend/src/generated/prisma/client`에서 임포트됨 (예: `User`, `Post`, `Prisma` 타입)
- 서비스는 타입이 지정된 매개변수를 받음: `Prisma.UserCreateInput`, `Prisma.UserWhereUniqueInput`

표준 CRUD 패턴은 [backend/src/user/user.service.ts](../backend/src/user/user.service.ts)와 [backend/src/post/post.service.ts](../backend/src/post/post.service.ts)를 참조하세요.

### 데이터베이스 스키마

[backend/prisma/schema.prisma](../backend/prisma/schema.prisma)의 현재 모델:

- **User**: `id`, `email` (unique), `name`, `posts[]` (관계)
- **Post**: `id`, `title`, `content`, `published` (기본값 false), `author` (User 관계)

마이그레이션은 `prisma/migrations/`에 저장됩니다.

## 개발 워크플로우

### 설정

```bash
cd backend
pnpm install
# PostgreSQL을 가리키는 DATABASE_URL 환경 변수 설정
pnpm run start:dev        # 포트 3000에서 watch 모드
```

### Docker 개발 환경

Docker를 사용한 로컬 개발 (DB 컨테이너 없음 — `DATABASE_URL`을 통해 서버리스 PostgreSQL 사용):

**사전 요구사항**

- Docker 및 Docker Compose 설치됨
- 호스트 환경에 `DATABASE_URL` 설정됨 (PrismaService에서 사용)

**파일**

- Compose: [docker-compose.dev.yml](../docker-compose.dev.yml)
- 백엔드 이미지: [backend/Dockerfile.dev](../backend/Dockerfile.dev)
- 프론트엔드 이미지: [frontend/Dockerfile.dev](../frontend/Dockerfile.dev)

**컨테이너 시작**

```bash
cd /home/dongwon/Projects/marvel-outside
docker compose -f docker-compose.dev.yml up --build
```

'docker daemon이 실행 중인가?' 오류가 발생하면 먼저 'docker desktop start'를 실행하세요.
**접속**

- 프론트엔드: http://localhost:5173
- 백엔드: http://localhost:3000

참고사항:

- DB 컨테이너는 시작되지 않음; `DATABASE_URL`은 서버리스 데이터베이스를 가리켜야 함.
- 컨테이너 내 파일 감시는 바인드 마운트의 안정성을 위해 폴링(`CHOKIDAR_USEPOLLING=true`)을 사용함.
- `node_modules`는 소스가 바인드 마운트되는 동안 권한 문제를 방지하기 위해 네임드 볼륨에 유지됨.
- Vite는 호스트에서 외부 접근을 위해 `0.0.0.0`에 바인딩됨.

선택적 프록시 (Docker 개발 중 프론트엔드에서 API 호출 시 권장): [frontend/vite.config.ts](../frontend/vite.config.ts)를 업데이트하여 백엔드 서비스 이름으로 프록시:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**컨테이너 중지**

```bash
docker compose -f docker-compose.dev.yml down
```

### 주요 명령어

- **빌드**: `pnpm run build` (`dist/`로 출력)
- **린트/포맷**: `pnpm run lint` (ESLint + fix), `pnpm run format` (Prettier)
- **테스트**: `pnpm run test` (Jest 단위 테스트), `pnpm run test:e2e` (e2e 테스트)
- **데이터베이스**: `pnpm prisma migrate dev --name migration_name` (마이그레이션 생성/적용) → `pnpm prisma generate` (타입 재생성)

### NestJS CLI 명령어

NestJS CLI를 사용하여 모듈, 서비스, 컨트롤러를 생성하세요:

```bash
# 완전한 리소스 생성 (모듈 + 컨트롤러 + 서비스 + DTO)
nest generate resource comment

# 개별 컴포넌트 생성
nest generate module feature-name
nest generate service feature-name
nest generate controller feature-name

# 사용 가능한 모든 스키매틱 목록 보기
nest generate --help
```

CLI는 자동으로:

- 기능 디렉토리 구조 생성
- `app.module.ts`에 모듈 등록
- `.spec.ts` 테스트 파일 생성
- 프로젝트 규칙 준수

### 데이터베이스 마이그레이션

`prisma/schema.prisma`에서 스키마 변경 후:

```bash
pnpm prisma migrate dev --name feature_description
pnpm prisma generate
```

첫 번째 명령은 마이그레이션 SQL을 생성하고 적용합니다. 두 번째 명령은 `src/generated/prisma/`의 클라이언트 타입을 재생성합니다. (**중요**: `migrate dev` 후 자동으로 타입이 생성되지 않으므로 `prisma generate`를 반드시 실행해야 합니다)

## 코드 스타일 & 패턴

### TypeScript 설정

- **Target**: ES2021, strict 모드 활성화
- **모듈 형식**: 최신 JavaScript import/export를 위한 ES2020 모듈
- **데코레이터**: `experimentalDecorators` 및 `emitDecoratorMetadata` 활성화 (NestJS에 필요)
- **모듈 해석**: Node, `src/` 임포트를 위한 `@/` 별칭
- **생성된 Prisma**: `src/generated/prisma/`를 직접 편집하지 마세요—마이그레이션을 통해 재생성

### DTO (Data Transfer Object) 패턴

**모든 요청/응답 처리에 DTO가 필수입니다.** 각 기능 모듈은 다음을 가져야 합니다:

#### 요청 DTO

- **CreateXxxDto**: POST 요청용 (예: `CreateUserDto`, `CreatePostDto`)
  - 검증을 위해 `class-validator` 데코레이터(`@IsString()`, `@IsEmail()` 등) 사용
  - 서비스 계층에 도달하기 전에 입력 검증

- **UpdateXxxDto**: PUT/PATCH 요청용 (예: `UpdateUserDto`, `UpdatePostDto`)
  - 부분 업데이트를 허용하기 위해 모든 필드는 `@IsOptional()`이어야 함
  - 제공된 필드만 검증

- **GetXxxQueryDto**: GET 쿼리 매개변수용 (예: `GetUsersQueryDto`, `GetPostsQueryDto`)
  - URL 문자열에서 타입 변환을 위해 `@Type(() => Number)` 사용
  - 일반적인 필드: `skip`, `take`, `orderBy`

#### 응답 DTO

- **XxxResponseDto**: API 응답용 (예: `UserResponseDto`, `PostResponseDto`)
  - 민감한 필드(예: `passwordHashed`)를 숨기기 위해 `class-transformer`의 `@Exclude()` 사용
  - `Partial<XxxResponseDto>`를 받는 생성자를 포함해야 함
  - 서비스에서 Prisma 모델을 DTO로 변환하기 위해 `plainToInstance()` 사용

#### DTO를 사용한 서비스 구현

```typescript
import { plainToInstance } from 'class-transformer';

async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
  // Business logic with Prisma
  const user = await this.prisma.user.create({
    data: {
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHashed: await bcrypt.hash(createUserDto.password, 10),
    },
  });
  // Transform to DTO before returning
  return plainToInstance(UserResponseDto, user);
}

async getUsers(queryDto: GetUsersQueryDto): Promise<UserResponseDto[]> {
  const users = await this.prisma.user.findMany({
    skip: queryDto.skip,
    take: queryDto.take,
    orderBy: queryDto.orderBy ? { [queryDto.orderBy]: 'asc' } : undefined,
  });
  return plainToInstance(UserResponseDto, users);
}
```

**파일 구조:**

```
src/feature-name/
  dto/
    create-feature.dto.ts      # POST 요청 검증
    update-feature.dto.ts      # PUT 요청 검증
    get-features-query.dto.ts  # GET 쿼리 매개변수
    feature-response.dto.ts    # 민감한 필드에 대한 @Exclude()가 포함된 응답
  feature.service.ts           # 매개변수와 반환값에 DTO 사용
  feature.controller.ts        # DTO 수신, 자동 검증
  feature.module.ts
```

### 서비스 패턴

서비스는 원시 Prisma 타입 대신 **DTO 객체를 매개변수로** 받아야 합니다:

```typescript
// ✅ 권장: 서비스가 DTO를 받음
async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>
async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>
async getUsers(queryDto: GetUsersQueryDto): Promise<UserResponseDto[]>

// ❌ 피할 것: 서비스가 Prisma 타입을 직접 받음
async createUser(data: Prisma.UserCreateInput): Promise<User>
async getUsers(params: { skip?: number; where?: Prisma.UserWhereInput }): Promise<User[]>
```

**장점:**

- 서비스 로직 전에 자동으로 검증 발생
- 컨트롤러와 서비스 간의 명확한 계약
- `@Exclude()`를 통해 응답에서 민감한 필드 제외
- `plainToInstance()`를 사용한 타입 안전 변환
- 일관된 API 문서

### 의존성 주입

생성자 주입과 함께 NestJS `@Injectable()` 데코레이터:

```typescript
constructor(private prisma: PrismaService) {}
```

서비스는 기본적으로 싱글톤입니다.

### 모듈 구성

각 기능 모듈은 서비스와 컨트롤러를 캡슐화합니다:

```typescript
// backend/src/user/user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Makes UserService available to other modules
})
export class UserModule {}
```

The root `AppModule` imports all feature modules:

```typescript
// backend/src/app.module.ts
@Module({
  imports: [UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
```

**핵심 원칙**: 내보낸 모듈의 서비스는 이를 필요로 하는 컨트롤러에서 의존성 주입에 사용할 수 있습니다.

### NestJS CLI 모범 사례

- 새 기능은 **항상 `nest generate resource`를 사용** (수동 폴더 생성 금지)
- CLI는 자동으로 `app.module.ts`의 임포트와 선언을 업데이트
- 생성된 파일은 프로젝트 규칙을 따르고 테스트 스텁을 포함
- 수동 설정보다 빠르고 오류가 적음

## 테스트

- **단위 테스트**: 소스와 함께 위치 (예: `user.service.ts` 옆의 `user.service.spec.ts`)
- **E2E 테스트**: `test/` 디렉토리에서 `jest-e2e.json` 설정으로 Jest 사용
- **모킹**: 테스트에서 `PrismaService` 모의 객체 사용; 기존 `.spec.ts` 파일의 예제 스텁 참조

## 중요한 구현 세부사항

환경 설정

- `DATABASE_URL` 환경 변수를 통한 PostgreSQL 연결 (`PrismaService`에서 사용)
- `.env` 파일은 커밋되지 않음; `.env.local` 또는 배포 환경 변수 사용

### 현재 컨트롤러

컨트롤러는 현재 최소한의 스텁 상태; 기능 개발에 따라 라우트 핸들러(GET, POST 등)로 확장하세요. NestJS 패턴을 따르세요: `@Get()`, `@Post()`, `@Body()`, `@Param()`.

## AI 에이전트를 위한 일반 작업

1. **새 기능 모듈 추가**:

   ```bash
   nest generate resource feature-name
   ```

   그런 다음 `backend/src/feature-name/feature-name.service.ts`를 비즈니스 로직으로 업데이트하세요.

2. **새 모델 추가**: `backend/prisma/schema.prisma` 업데이트 → `pnpm prisma migrate dev --name feature_description` → 타입 자동 재생성

3. **서비스 메서드 추가**: `backend/src/feature/feature.service.ts`의 서비스를 적절한 `Prisma.*Input` 타입을 사용하는 Prisma 쿼리로 업데이트

4. **컨트롤러 엔드포인트 추가**: `backend/src/feature/feature.controller.ts`를 데코레이트된 메서드(`@Get()`, `@Post()`, `@Body()`, `@Param()`)로 업데이트, 서비스 주입, 서비스 메서드 호출

5. **타입 불일치 수정**: 올바른 Input/Output 타입을 위해 `backend/src/generated/prisma/client.ts`의 Prisma 생성 타입 확인

6. **테스트 실행**: `pnpm run test`는 모든 단위 테스트 실행; 테스트 파일은 NestJS CLI에 의해 자동 생성됨

## 하지 말아야 할 것

- `backend/src/generated/prisma/`의 파일을 직접 편집하지 마세요
- 수동으로 포맷하지 마세요. 저장 시 포맷이 활성화되어 있습니다.

## 주요 파일 참조

### 백엔드

- [backend/package.json](../backend/package.json): 스크립트, 의존성 (NestJS, Prisma, PostgreSQL)
- [backend/tsconfig.json](../backend/tsconfig.json): strict 모드가 있는 TypeScript 설정
- [backend/src/app.module.ts](../backend/src/app.module.ts): 모듈 등록 및 DI
- [backend/prisma/schema.prisma](../backend/prisma/schema.prisma): 데이터베이스 스키마 정의
- [backend/src/prisma/prisma.service.ts](../backend/src/prisma/prisma.service.ts): PrismaPg 어댑터를 사용한 Prisma 클라이언트 설정

### Docker

- [docker-compose.dev.yml](../docker-compose.dev.yml): 백엔드/프론트엔드 서비스가 있는 개발 compose (DB 없음)
- [backend/Dockerfile.dev](../backend/Dockerfile.dev): NestJS 개발 이미지 (pnpm, watch 모드)
- [frontend/Dockerfile.dev](../frontend/Dockerfile.dev): Vite React 개발 이미지 (pnpm, dev 서버)

### 프론트엔드

- [frontend/package.json](../frontend/package.json): 스크립트, 의존성 (React, Vite, Tailwind CSS)
- [frontend/tsconfig.json](../frontend/tsconfig.json): TypeScript 프로젝트 참조
- [frontend/tsconfig.app.json](../frontend/tsconfig.app.json): 앱별 TypeScript 설정
- [frontend/vite.config.ts](../frontend/vite.config.ts): Tailwind 플러그인이 있는 Vite 설정
- [frontend/src/main.tsx](../frontend/src/main.tsx): React 앱 진입점

---

## 프론트엔드 개발

### 기술 스택

- **React 19**: 향상된 TypeScript 지원이 있는 최신 React
- **Vite**: HMR(Hot Module Replacement)이 있는 빠른 빌드 도구
- **Tailwind CSS v4**: Vite 플러그인을 사용하는 유틸리티 우선 CSS 프레임워크
- **TypeScript**: 최신 ES2022 대상으로 strict 모드 활성화

### 프로젝트 구조

```
frontend/
  src/
    main.tsx              # 앱 진입점
    App.tsx               # 루트 컴포넌트
    index.css             # Tailwind 지시어가 있는 전역 스타일
    components/           # 재사용 가능한 UI 컴포넌트
    api/                  # API 클라이언트 및 타입
    hooks/                # 커스텀 React 훅
    pages/                # 페이지 컴포넌트
    stores/               # 상태 관리
  public/                 # 정적 자산
  vite.config.ts         # Vite 설정
  tailwind.config.js     # Tailwind 설정
  tsconfig.json          # TS 프로젝트 참조
  tsconfig.app.json      # 앱 TypeScript 설정
```

### 개발 워크플로우

#### 설정

```bash
cd frontend
pnpm install
pnpm run dev          # 포트 5173(기본값)에서 개발 서버
```

#### 주요 명령어

- **개발 서버**: `pnpm run dev` (HMR 포함)
- **빌드**: `pnpm run build` (TypeScript 검사 + Vite 빌드)
- **미리보기**: `pnpm run preview` (프로덕션 빌드 미리보기)
- **린트**: `pnpm run lint` (자동 수정이 있는 ESLint)

### Tailwind CSS 통합

#### Vite 플러그인 설정

Tailwind CSS v4는 PostCSS 대신 **Vite 플러그인**을 사용합니다:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**중요**: Vite 플러그인을 사용할 때는 `postcss.config.js`를 사용하지 마세요. 플러그인이 모든 CSS 처리를 내부적으로 처리합니다.

#### Tailwind 설정

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
```

이는 Tailwind에게 클래스 이름을 위해 모든 소스 파일을 스캔하도록 지시합니다.

#### 컴포넌트에서 Tailwind 사용

```tsx
// Utility-first approach
export default function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Click me
    </button>
  );
}

// Responsive design
export default function Card() {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Title</h2>
        <p className="text-gray-600">Content</p>
      </div>
    </div>
  );
}

// Dark mode support
export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-gray-900 dark:text-white">Marvel Outside</h1>
    </header>
  );
}
```

#### 전역 스타일

```css
/* src/index.css */
@import "tailwindcss";

/* 커스텀 전역 스타일 */
body {
  @apply bg-gray-50 text-gray-900;
}

/* 커스텀 컴포넌트 클래스 (절제해서 사용) */
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
  }
}
```

### TypeScript 설정

- **Target**: 최신 JavaScript 기능이 있는 ES2022
- **모듈**: 번들러 해석이 있는 ESNext
- **JSX**: `react-jsx` (자동 런타임, React 임포트 불필요)
- **Strict 모드**: 추가 린팅 규칙으로 활성화
- **프로젝트 참조**: 더 나은 타입 검사를 위해 앱과 노드 설정 분리

주요 컴파일러 옵션:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
  },
}
```

### 컴포넌트 패턴

#### TypeScript가 있는 함수형 컴포넌트

```tsx
// Simple component
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}
```

#### 상태 관리

```tsx
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="animate-pulse">로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>사용자를 찾을 수 없습니다</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}
```

### API 통합

API 호출을 별도의 모듈로 구조화하세요:

```typescript
// src/api/userApi.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export async function createUser(data: {
  name: string;
  email: string;
}): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
}
```

### 스타일링 모범 사례

#### Tailwind 유틸리티 클래스 사용

**✅ 권장:**

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>
```

**❌ 커스텀 CSS 클래스 피하기:**

```tsx
// 절대적으로 필요하지 않으면 커스텀 CSS 클래스를 만들지 마세요
<div className="custom-card">
  <h2 className="custom-title">제목</h2>
</div>
```

#### 컴포넌트 구성

```tsx
// 좋음: 명확하고 읽기 쉬우며 Tailwind 유틸리티 사용
export default function PostCard({ title, content, author }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{content}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span>By {author}</span>
      </div>
    </article>
  );
}
```

#### 반응형 디자인

```tsx
// 모바일 우선 반응형 디자인
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 카드 */}
</div>

// 반응형 패딩과 텍스트
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
    반응형 제목
  </h1>
</div>
```

### AI 에이전트를 위한 일반 작업

1. **새 컴포넌트 생성**:
   - `src/components/ComponentName.tsx`에 파일 생성
   - TypeScript 인터페이스와 함께 함수형 컴포넌트 사용
   - Tailwind 유틸리티 클래스로 스타일링
   - 기본값으로 내보내기

2. **새 페이지 추가**:
   - `src/pages/PageName.tsx`에 파일 생성
   - 기존 컴포넌트 임포트 및 사용
   - 라우팅 설정 (React Router 사용 시)

3. **Tailwind로 스타일링**:
   - `className`에서 유틸리티 클래스 직접 사용
   - 클래스 이름은 Tailwind 문서 참조
   - 반응형 접두사 사용: `sm:`, `md:`, `lg:`, `xl:`
   - 상태 변형 사용: `hover:`, `focus:`, `active:`

4. **API 통합 추가**:
   - `src/api/`에 API 함수 생성
   - 데이터를 위한 TypeScript 인터페이스 정의
   - 컴포넌트에서 `useState`와 `useEffect`로 사용

5. **스타일 디버깅**:
   - Tailwind 설정 content 경로 확인
   - 클래스가 감지되는지 확인
   - 브라우저 DevTools로 계산된 스타일 검사

### 하지 말아야 할 것

- `postcss.config.js`를 만들지 마세요 (Vite 플러그인이 CSS 처리)
- 절대적으로 필요하지 않으면 커스텀 CSS를 작성하지 마세요 (Tailwind 사용)
- 컴포넌트에서 React를 임포트하지 마세요 (자동 JSX 런타임)
- 인라인 스타일을 사용하지 마세요 (Tailwind 유틸리티 선호)
- 코드 빌드하지 말 것
### 기타 주의 사항

- 모든 코드 파일의 인덴트는 스페이스 2칸

---
