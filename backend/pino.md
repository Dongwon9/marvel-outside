# Pino 로깅 가이드

Marvel Outside 프로젝트는 `nestjs-pino`를 사용하여 고성능 JSON 로깅을 구현합니다.

## 📋 목차

1. [현재 설정](#현재-설정)
2. [사용 방법](#사용-방법)
3. [로그 레벨 조정](#로그-레벨-조정)
4. [커스텀 로깅 추가](#커스텀-로깅-추가)
5. [테스트 환경 설정](#테스트-환경-설정)
6. [프로덕션 설정](#프로덕션-설정)

---

## 현재 설정

### 설치된 패키지

```json
// backend/package.json
{
  "dependencies": {
    "nestjs-pino": "^4.5.0",
    "pino": "^10.3.0",
    "pino-http": "^11.0.0",
    "pino-pretty": "^13.1.3"
  }
}
```

### 전역 설정 (app.module.ts)

현재 `backend/src/app.module.ts`에 다음과 같이 설정되어 있습니다:

```typescript
LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
    autoLogging: true,
    genReqId: (req: unknown) => {
      // Request ID 생성 (X-Request-Id 헤더 또는 UUID)
      const requestWithContext = req as RequestWithContext;
      const headerId = requestWithContext.headers?.['x-request-id'];
      const id = Array.isArray(headerId)
        ? headerId[0]
        : typeof headerId === 'string'
          ? headerId
          : undefined;
      return id ?? crypto.randomUUID();
    },
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'req.body.password',
    ],
    customProps: (req: unknown) => {
      const requestWithContext = req as RequestWithContext;
      return {
        reqId: requestWithContext.id,
        userId: requestWithContext.user?.id,
      };
    },
  },
}),
```

### 메인 애플리케이션 (main.ts)

```typescript
// backend/src/main.ts
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // ...
  app.useLogger(app.get(Logger)); // Pino 로거 적용
  // ...
}
```

---

## 사용 방법

### 1. 서비스에서 PinoLogger 주입

**예시: 새로운 서비스 생성**

```typescript
// backend/src/example/example.service.ts
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ExampleService {
  constructor(
    @InjectPinoLogger(ExampleService.name)
    private readonly logger: PinoLogger,
  ) {}

  async doSomething(data: string): Promise<void> {
    // Debug 레벨 로깅
    this.logger.debug({ msg: 'example.doSomething', data });

    try {
      // 비즈니스 로직
      this.logger.info({ msg: 'example.success', result: 'done' });
    } catch (error) {
      // Error 로깅
      this.logger.error({
        msg: 'example.error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}
```

### 2. 기존 Prisma 서비스 예시

현재 `backend/src/prisma/prisma.service.ts`에서 이미 사용 중:

```typescript
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    private configService: ConfigService,
    @InjectPinoLogger(PrismaService.name) private readonly logger: PinoLogger,
  ) {
    // ...
    this.$on('query', e => {
      const ctx = RequestContext.get();
      this.logger.debug({
        msg: 'prisma.query',
        reqId: ctx?.reqId,
        userId: ctx?.userId,
        durationMs: e.duration,
        query: e.query,
        params: e.params,
      });
    });
  }
}
```

### 3. 필터/인터셉터에서 사용

**예시: Exception Filter**

```typescript
// backend/src/common/filters/http-exception.filter.ts
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // ...
    this.logger.error({
      msg: 'http.exception',
      reqId: reqCtx?.reqId,
      userId: reqCtx?.userId,
      method,
      path,
      status,
      message,
    });
  }
}
```

---

## 로그 레벨 조정

### 환경변수로 제어

```bash
# backend/.env.development
LOG_LEVEL=debug

# backend/.env.production
LOG_LEVEL=info

# backend/.env.test
LOG_LEVEL=silent  # 테스트 시 로그 출력 제거
```

### 사용 가능한 로그 레벨

| 레벨     | 숫자 | 설명                   | 사용 시기                |
| -------- | ---- | ---------------------- | ------------------------ |
| `fatal`  | 60   | 치명적 오류            | 애플리케이션 종료 시     |
| `error`  | 50   | 에러                   | 예외 발생 시             |
| `warn`   | 40   | 경고                   | 비정상적이지만 처리 가능 |
| `info`   | 30   | 정보 (프로덕션 기본값) | 주요 이벤트              |
| `debug`  | 20   | 디버그 (개발 기본값)   | 상세 정보                |
| `trace`  | 10   | 매우 상세한 디버그     | 모든 정보 추적           |
| `silent` | -    | 로그 출력 안 함        | 테스트 환경              |

### app.module.ts에서 직접 수정

```typescript
// backend/src/app.module.ts
LoggerModule.forRoot({
  pinoHttp: {
    // 방법 1: 고정값 설정
    level: 'debug',

    // 방법 2: 환경변수 + 기본값 (현재 설정)
    level: process.env.LOG_LEVEL ||
           (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),

    // 방법 3: 조건부 상세 설정
    level: process.env.NODE_ENV === 'test'
      ? 'silent'
      : process.env.NODE_ENV === 'production'
        ? 'warn'
        : 'debug',
  },
}),
```

---

## 커스텀 로깅 추가

### 1. 새로운 모듈에 로깅 추가

```bash
# 모듈 생성
nest generate resource notification
```

```typescript
// backend/src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RequestContext } from '../common/request-context/request-context';

@Injectable()
export class NotificationService {
  constructor(
    @InjectPinoLogger(NotificationService.name)
    private readonly logger: PinoLogger,
  ) {}

  async sendNotification(userId: string, message: string): Promise<void> {
    const ctx = RequestContext.get();

    this.logger.info({
      msg: 'notification.send',
      reqId: ctx?.reqId,
      userId,
      messageLength: message.length,
    });

    try {
      // 알림 전송 로직
      await this.performSend(userId, message);

      this.logger.info({
        msg: 'notification.sent',
        reqId: ctx?.reqId,
        userId,
      });
    } catch (error) {
      this.logger.error({
        msg: 'notification.failed',
        reqId: ctx?.reqId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown',
      });
      throw error;
    }
  }

  private async performSend(userId: string, message: string): Promise<void> {
    // 실제 전송 로직
    this.logger.debug({
      msg: 'notification.performing',
      userId,
      message,
    });
  }
}
```

### 2. 컨트롤러에서 로깅

```typescript
// backend/src/notification/notification.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectPinoLogger(NotificationController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async send(@Body() dto: SendNotificationDto) {
    this.logger.debug({
      msg: 'controller.notification.send',
      userId: dto.userId,
    });

    return await this.notificationService.sendNotification(dto.userId, dto.message);
  }
}
```

### 3. 민감 정보 리다이렉션 추가

특정 필드를 자동으로 마스킹하려면 `app.module.ts` 수정:

```typescript
// backend/src/app.module.ts
LoggerModule.forRoot({
  pinoHttp: {
    // ...
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'req.body.password',
      'req.body.passwordHashed',    // 추가
      'req.body.token',              // 추가
      'req.body.refreshToken',       // 추가
      'req.body.secret',             // 추가
    ],
  },
}),
```

---

## 테스트 환경 설정

### 테스트 시 로그 출력 제어

```bash
# backend/.env.test
LOG_LEVEL=silent  # 모든 로그 출력 억제

# 또는 특정 레벨만 표시
LOG_LEVEL=error   # 에러만 표시
```

### 통합 테스트에서 로거 모킹

```typescript
// backend/test/user-auth.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';

describe('UserAuth Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // 테스트용 로거 설정
        LoggerModule.forRoot({
          pinoHttp: {
            level: 'silent', // 또는 'error'
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
```

---

## 프로덕션 설정

### 1. 프로덕션 환경변수

```bash
# backend/.env.production
NODE_ENV=production
LOG_LEVEL=info

# pino-pretty 비활성화 (자동으로 처리됨)
```

### 2. JSON 로그 포맷 (프로덕션)

프로덕션에서는 `pino-pretty`가 자동으로 비활성화되어 JSON 형식으로 출력됩니다:

```json
{
  "level": 30,
  "time": 1707098400000,
  "msg": "http.request",
  "reqId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "method": "GET",
  "path": "/api/users",
  "statusCode": 200,
  "durationMs": 45
}
```

### 3. 로그 수집 통합 (옵션)

프로덕션에서 로그를 외부 서비스로 전송하려면:

#### Datadog 예시

```bash
pnpm add pino-datadog
```

```typescript
// backend/src/app.module.ts
LoggerModule.forRoot({
  pinoHttp: {
    level: 'info',
    transport: process.env.NODE_ENV === 'production' ? {
      target: 'pino-datadog',
      options: {
        apiKey: process.env.DATADOG_API_KEY,
        ddsource: 'nodejs',
        ddtags: 'env:production',
        service: 'marvel-outside-backend',
      },
    } : {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
}),
```

#### CloudWatch 예시

```bash
pnpm add pino-cloudwatch
```

```typescript
// backend/src/app.module.ts
LoggerModule.forRoot({
  pinoHttp: {
    level: 'info',
    transport: process.env.NODE_ENV === 'production' ? {
      target: 'pino-cloudwatch',
      options: {
        logGroupName: '/aws/marvel-outside/backend',
        logStreamName: 'app-logs',
        awsRegion: process.env.AWS_REGION,
      },
    } : undefined,
  },
}),
```

### 4. 로그 로테이션

Docker 환경에서는 Docker의 로그 드라이버를 사용하는 것을 권장:

```yaml
# docker-compose.yml
services:
  backend:
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
```

---

## 추가 설정 옵션

### pino-pretty 커스터마이징

개발 환경에서 로그 포맷을 더 상세히 조정:

```typescript
// backend/src/app.module.ts
LoggerModule.forRoot({
  pinoHttp: {
    level: 'debug',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',      // 시간 포맷
        ignore: 'pid,hostname',          // 출력에서 제외할 필드
        singleLine: false,               // 한 줄로 출력 여부
        messageFormat: '{msg} | {reqId}', // 메시지 포맷
        errorLikeObjectKeys: ['err', 'error'], // 에러로 처리할 키
      },
    } : undefined,
  },
}),
```

### Request Context 통합

현재 프로젝트는 `RequestContext`를 사용하여 요청별 정보를 추적합니다:

```typescript
import { RequestContext } from '../common/request-context/request-context';

// 서비스 내에서
const ctx = RequestContext.get();
this.logger.info({
  msg: 'operation.name',
  reqId: ctx?.reqId, // 요청 ID
  userId: ctx?.userId, // 사용자 ID
  // 기타 정보
});
```

---

## 베스트 프랙티스

### 1. 구조화된 로깅

❌ **나쁜 예:**

```typescript
this.logger.info(`User ${userId} created post ${postId}`);
```

✅ **좋은 예:**

```typescript
this.logger.info({
  msg: 'post.created',
  userId,
  postId,
  timestamp: new Date().toISOString(),
});
```

### 2. 일관된 메시지 네이밍

```typescript
// 패턴: 모듈.동작
this.logger.info({ msg: 'user.created' });
this.logger.info({ msg: 'post.updated' });
this.logger.error({ msg: 'auth.failed' });
```

### 3. 적절한 로그 레벨 선택

```typescript
// Trace: 매우 상세한 정보
this.logger.trace({ msg: 'function.entry', args });

// Debug: 개발/디버깅 정보
this.logger.debug({ msg: 'cache.miss', key });

// Info: 중요한 이벤트
this.logger.info({ msg: 'user.login', userId });

// Warn: 비정상적이지만 처리 가능
this.logger.warn({ msg: 'rate.limit.approaching', userId });

// Error: 오류 발생
this.logger.error({ msg: 'payment.failed', error, userId });

// Fatal: 치명적 오류
this.logger.fatal({ msg: 'database.connection.lost' });
```

### 4. 에러 로깅

```typescript
try {
  await this.performOperation();
} catch (error) {
  this.logger.error({
    msg: 'operation.failed',
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    userId: ctx?.userId,
  });
  throw error;
}
```

### 5. 성능 측정

```typescript
async performHeavyOperation(): Promise<void> {
  const startTime = Date.now();

  try {
    await this.doWork();

    const durationMs = Date.now() - startTime;
    this.logger.info({
      msg: 'operation.completed',
      durationMs,
      performance: durationMs > 1000 ? 'slow' : 'fast',
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    this.logger.error({
      msg: 'operation.failed',
      durationMs,
      error,
    });
    throw error;
  }
}
```

---

## 문제 해결

### 로그가 출력되지 않을 때

1. **환경변수 확인**

   ```bash
   echo $LOG_LEVEL
   # 또는
   cat backend/.env.development | grep LOG_LEVEL
   ```

2. **main.ts에서 Logger 적용 확인**

   ```typescript
   app.useLogger(app.get(Logger));
   ```

3. **테스트 환경에서 silent 설정 확인**
   ```bash
   # .env.test
   LOG_LEVEL=debug  # 또는 info
   ```

### pino-pretty가 작동하지 않을 때

```bash
# 패키지 재설치
cd backend
pnpm install pino-pretty

# NODE_ENV 확인
echo $NODE_ENV  # development여야 함
```

### 로그가 너무 많을 때

```typescript
// app.module.ts - autoLogging 비활성화
LoggerModule.forRoot({
  pinoHttp: {
    autoLogging: false, // HTTP 요청 자동 로깅 끄기
  },
}),
```

---

## 요약 체크리스트

- [ ] `nestjs-pino`, `pino`, `pino-http`, `pino-pretty` 설치됨
- [ ] `app.module.ts`에 `LoggerModule.forRoot()` 설정됨
- [ ] `main.ts`에서 `app.useLogger(app.get(Logger))` 적용됨
- [ ] 환경변수로 `LOG_LEVEL` 제어 가능
- [ ] 개발: `LOG_LEVEL=debug`, 프로덕션: `LOG_LEVEL=info`, 테스트: `LOG_LEVEL=silent`
- [ ] 민감 정보는 `redact` 배열에 추가됨
- [ ] 서비스에서 `@InjectPinoLogger()` 사용
- [ ] 구조화된 로깅 (객체 사용)
- [ ] `RequestContext`로 reqId, userId 추적

---

## 참고 자료

- [nestjs-pino 공식 문서](https://github.com/iamolegga/nestjs-pino)
- [Pino 공식 문서](https://getpino.io/)
- [Pino Best Practices](https://getpino.io/#/docs/best-practices)
