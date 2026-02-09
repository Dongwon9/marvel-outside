/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '@/prisma/prisma.service';

import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  private mapCommentToDto(comment: any): CommentResponseDto {
    const dto = plainToInstance(CommentResponseDto, comment);
    // Handle deleted author
    if (dto.author && 'deletedAt' in comment.author && comment.author.deletedAt) {
      dto.author.name = '삭제된 사용자';
    }
    return dto;
  }

  async create(
    postId: string,
    authorId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          postId,
          authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              deletedAt: true,
            },
          },
        },
      });
      return this.mapCommentToDto(comment);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You already have a comment on this post');
      }
      throw error;
    }
  }

  async findAllByPost(postId: string): Promise<CommentResponseDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            deletedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return comments.map(comment => this.mapCommentToDto(comment));
  }

  async findOne(postId: string, authorId: string): Promise<CommentResponseDto | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            deletedAt: true,
          },
        },
      },
    });
    if (!comment) return null;
    return this.mapCommentToDto(comment);
  }

  async update(
    postId: string,
    authorId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const updated = await this.prisma.comment.update({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
      data: updateCommentDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            deletedAt: true,
          },
        },
      },
    });
    return this.mapCommentToDto(updated);
  }

  async remove(postId: string, authorId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
    });
  }
}
