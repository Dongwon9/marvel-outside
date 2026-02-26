import { Module } from '@nestjs/common';

import { CommentModule } from '@/comment/comment.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CommentModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
