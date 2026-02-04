/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

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
            },
          },
        },
      });
      return plainToInstance(CommentResponseDto, comment);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You already have a comment on this post');
      }
      throw error;
    }
  }

  async findAllByPost(postId: string): Promise<CommentResponseDto[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return plainToInstance(CommentResponseDto, comments);
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
          },
        },
      },
    });
    if (!comment) return null;
    return plainToInstance(CommentResponseDto, comment);
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
          },
        },
      },
    });
    return plainToInstance(CommentResponseDto, updated);
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
