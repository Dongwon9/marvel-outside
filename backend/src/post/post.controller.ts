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
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(@Query() queryDto: GetPostsQueryDto): Promise<PostResponseDto[]> {
    return this.postService.posts(queryDto);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostResponseDto | null> {
    return this.postService.post(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
    return this.postService.createPost(createPostDto);
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
