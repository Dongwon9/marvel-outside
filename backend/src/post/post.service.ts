import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(id: string): Promise<PostResponseDto | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) return null;
    return plainToInstance(PostResponseDto, post);
  }

  async posts(queryDto: GetPostsQueryDto): Promise<PostResponseDto[]> {
    const { skip, take, orderBy } = queryDto;
    const posts = await this.prisma.post.findMany({
      skip,
      take,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
    return plainToInstance(PostResponseDto, posts);
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content || '',
        author: {
          connect: { id: createPostDto.authorId },
        },
      },
    });
    return plainToInstance(PostResponseDto, post);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
    return plainToInstance(PostResponseDto, post);
  }

  async deletePost(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.delete({
      where: { id },
    });
    return plainToInstance(PostResponseDto, post);
  }
}
