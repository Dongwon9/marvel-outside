import crypto from 'crypto';
import { resolve } from 'path';

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestContextMiddleware } from './common/request-context/request-context.middleware';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { RateModule } from './rate/rate.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

interface RequestWithContext {
  headers?: Record<string, string | string[]>;
  id?: string;
  user?: {
    id: string;
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // Load environment-specific .env file based on NODE_ENV
        resolve(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`),
        // Fallback to .env if environment-specific file doesn't exist
        resolve(__dirname, '../.env'),
      ],
    }),
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
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    PostModule,
    FollowModule,
    RateModule,
    BoardModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
