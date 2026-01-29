import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';
import { ContentFormat } from './dto/content-format.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
      include: {
        rates: true,
      },
    });

    const postsWithLikeCount = posts.map(post => {
      const { rates, ...postData } = post;
      const likeCount = post.rates.filter(rate => rate.isLike).length;
      const dislikeCount = post.rates.filter(rate => !rate.isLike).length;
      return { ...postData, likeCount, dislikeCount };
    });
    return plainToInstance(PostResponseDto, postsWithLikeCount);
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content || '',
        author: {
          connect: { id: createPostDto.authorId },
        },
        board: {
          connect: { id: createPostDto.boardId },
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

  async incrementHits(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.update({
      where: { id },
      data: { hits: { increment: 1 } },
    });
    return plainToInstance(PostResponseDto, post);
  }
  //id로 게시물의 좋아요와 싫어요 수를 가져온다
  async getPostRatings(id: string): Promise<{ likeCount: number; dislikeCount: number }> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { rates: true },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    const likeCount = post.rates.filter(rate => rate.isLike).length;
    const dislikeCount = post.rates.filter(rate => !rate.isLike).length;

    return { likeCount, dislikeCount };
  }
}
