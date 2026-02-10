import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  private includeForDto = {
    rates: true,
    author: { select: { name: true, deletedAt: true } },
    board: { select: { name: true } },
  };

  private getAuthorName(author: { name: string; deletedAt: Date | null }): string {
    return author.deletedAt ? '삭제된 사용자' : author.name;
  }

  private transformPostToDto(post: {
    rates: { isLike: boolean }[];
    author: { name: string; deletedAt: Date | null };
    board: { name: string };
    id: string;
    title: string;
    content: string;
    authorId: string;
    boardId: string;
    hits: number;
    createdAt: Date;
    updatedAt: Date;
  }): PostResponseDto {
    const { rates, author, board, ...postData } = post;
    const likeCount = post.rates.filter(rate => rate.isLike).length;
    const dislikeCount = post.rates.filter(rate => !rate.isLike).length;
    const authorName = this.getAuthorName(author);
    const boardName = board.name;
    const postWithCounts = { ...postData, likeCount, dislikeCount, authorName, boardName };
    return plainToInstance(PostResponseDto, postWithCounts);
  }
  async post(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        rates: { omit: { postId: true } },
        author: {
          select: {
            name: true,
            deletedAt: true,
          },
        },
        board: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.transformPostToDto(post);
  }

  async posts(queryDto: GetPostsQueryDto): Promise<PostResponseDto[]> {
    const { skip, take, orderBy, authorId, boardId } = queryDto;
    const validOrderByFields = ['id', 'title', 'createdAt', 'updatedAt', 'hits'];

    const posts = await this.prisma.post.findMany({
      where: {
        ...(authorId && { authorId }),
        ...(boardId && { boardId }),
      },
      skip,
      take,
      orderBy:
        orderBy && validOrderByFields.includes(orderBy)
          ? { [orderBy]: 'asc' }
          : { createdAt: 'desc' },
      include: this.includeForDto,
    });

    return posts.map(post => this.transformPostToDto(post));
  }

  async postsForFeed(userId: string): Promise<PostResponseDto[]> {
    const followings = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = followings.map(f => f.followingId);

    const posts = await this.prisma.post.findMany({
      where: {
        authorId: { in: followingIds },
      },
      orderBy: { createdAt: 'desc' },
      include: this.includeForDto,
    });

    return posts.map(post => this.transformPostToDto(post));
  }

  async createPost(createPostDto: CreatePostDto & { authorId: string }): Promise<string> {
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
    return post.id;
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
      throw new NotFoundException('Post not found');
    }

    const likeCount = post.rates.filter(rate => rate.isLike).length;
    const dislikeCount = post.rates.filter(rate => !rate.isLike).length;

    return { likeCount, dislikeCount };
  }

  async saveDraft(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.publishedAt !== null) {
      throw new BadRequestException('Cannot edit a published post');
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: this.includeForDto,
    });

    return this.transformPostToDto(updated);
  }

  async publishDraft(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.publishedAt !== null) {
      throw new BadRequestException('Post is already published');
    }

    const published = await this.prisma.post.update({
      where: { id },
      data: { publishedAt: new Date() },
      include: this.includeForDto,
    });

    return this.transformPostToDto(published);
  }
}
