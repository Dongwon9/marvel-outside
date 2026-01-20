import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';
import { RateModule } from './rate/rate.module';
import { BoardModule } from './board/board.module';

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
    UserModule,
    PostModule,
    FollowModule,
    RateModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
