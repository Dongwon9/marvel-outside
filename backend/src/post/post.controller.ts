import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import type { User } from '@/generated/prisma/client';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Public()
  async getPosts(@Query() queryDto: GetPostsQueryDto): Promise<PostResponseDto[]> {
    return this.postService.posts(queryDto);
  }

  @Get(':userId')
  @Public()
  async getPostsForFeed(@Param('userId') userId: string): Promise<PostResponseDto[]> {
    return this.postService.postsForFeed(userId);
  }
  
  @Get(':id')
  @Public()
  async getPostById(@Param('id') id: string): Promise<PostResponseDto | null> {
    return this.postService.post(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: User,
  ): Promise<PostResponseDto> {
    return this.postService.createPost({ ...createPostDto, authorId: user.id });
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postService.deletePost(id);
  }

  @Patch(':id/hits')
  async incrementPostHits(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.incrementHits(id);
  }

  @Get('rating/:id')
  async getPostRating(
    @Param('id') id: string,
  ): Promise<{ likeCount: number; dislikeCount: number }> {
    return this.postService.getPostRatings(id);
  }
}
