import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import type { User } from '@/generated/prisma/client';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('postId') postId: string,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(postId, user.id, createCommentDto);
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  findAll(@Param('postId') postId: string) {
    return this.commentService.findAllByPost(postId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('postId') postId: string, @CurrentUser() user: User) {
    return this.commentService.findOne(postId, user.id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @Param('postId') postId: string,
    @CurrentUser() user: User,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(postId, user.id, updateCommentDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('postId') postId: string, @CurrentUser() user: User) {
    return this.commentService.remove(postId, user.id);
  }
}
