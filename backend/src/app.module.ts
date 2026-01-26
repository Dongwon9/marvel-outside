import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { RateModule } from './rate/rate.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

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
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    PostModule,
    FollowModule,
    RateModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
