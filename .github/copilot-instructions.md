# Marvel Outside AI 코딩 지침

## 프로젝트 개요

**백엔드**: NestJS + Prisma + PostgreSQL | **프론트엔드**: React 19 + Vite + Tailwind CSS v4

## 백엔드 핵심

### 모듈 생성

```bash
nest generate resource feature-name  # 모듈/컨트롤러/서비스/DTO 자동 생성
```

### DTO 패턴 (필수)

```typescript
// 서비스는 DTO를 받아 DTO를 반환
async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
  const user = await this.prisma.user.create({ data: {...} });
  return plainToInstance(UserResponseDto, user);  // @Exclude()로 민감 필드 숨김
}
```

**구조**: `dto/` 폴더에 `create-*.dto.ts`, `update-*.dto.ts`, `get-*-query.dto.ts`, `*-response.dto.ts`

### 테스트

- **단위 테스트**: 소스 옆 `*.spec.ts` (예: `user.service.spec.ts`)
- **통합 테스트**: `*.integration.spec.ts` (선택)
- **E2E 테스트**: `test/` 디렉토리 `*.e2e-spec.ts`

```bash
pnpm test                    # 단위 테스트
pnpm test:integration        # 통합 테스트
pnpm test:e2e               # E2E 테스트
```

### Prisma

```bash
pnpm prisma migrate dev --name feature_name  # 마이그레이션
pnpm prisma generate                         # 타입 생성
```

### 보안

- **JWT 인증**: 모든 엔드포인트 기본 보호 (글로벌 `JwtAuthGuard`)
- **공개 엔드포인트**: `@Public()` 데코레이터 추가
- **CORS**: 개발 시 localhost:5173, 프로덕션 시 `CORS_ORIGIN` 환경변수

## 프론트엔드 핵심

### 컴포넌트 패턴

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {label}
    </button>
  );
}
```

### Tailwind CSS v4

- **Vite 플러그인 사용** (postcss.config.js 불필요)
- 유틸리티 클래스 우선 (커스텀 CSS 최소화)
- 반응형: `sm:`, `md:`, `lg:`, `xl:` 접두사

### API 통합

```typescript
// src/api/userApi.ts
export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}
```

## Docker 개발 환경

```bash
docker compose up --build    # 백엔드(3000), 프론트엔드(5173), DB, Redis 시작
docker compose down          # 중지
```

## 하지 말 것

- `backend/src/generated/prisma/` 직접 편집 금지
- `postcss.config.js` 생성 금지 (Vite 플러그인 사용)
- 컴포넌트에서 React 임포트 불필요 (자동 JSX 런타임)
- 수동 포맷 불필요 (저장 시 자동 포맷)
- 코드 빌드 금지 (개발서버니까)

## 코딩 규칙

- 인덴트: 스페이스 2칸
- TypeScript strict 모드
- Plan 모드: 피드백 불필요 시 맨 아래에 "구현을 시작할까요?" 추가
- 이름으로 선언하는 모든 함수 본문은 2줄 이상일 것
- 모든 api호출은 axios 이용할 것
