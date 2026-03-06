import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '@/prisma/prisma.service';

import { BoardResponseDto } from './dto/board-response.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardsQueryDto } from './dto/get-boards-query.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto): Promise<BoardResponseDto> {
    const board = await this.prisma.board.create({
      data: { ...createBoardDto },
      include: { _count: { select: { subscriptions: true } } },
    });
    return plainToInstance(BoardResponseDto, {
      ...board,
      subscriberCount: board._count.subscriptions,
      isSubscribed: false,
    });
  }

  async findAll(queryDto?: GetBoardsQueryDto, userId?: string): Promise<BoardResponseDto[]> {
    const { skip = 0, take } = queryDto || {};

    const boards = await this.prisma.board.findMany({
      skip,
      ...(take && { take }),
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { subscriptions: true } } },
    });

    if (!userId) {
      return boards.map(board =>
        plainToInstance(BoardResponseDto, {
          ...board,
          subscriberCount: board._count.subscriptions,
          isSubscribed: false,
        }),
      );
    }

    const boardIds = boards.map(b => b.id);
    const subscriptions = await this.prisma.boardSubscription.findMany({
      where: { userId, boardId: { in: boardIds } },
      select: { boardId: true },
    });
    const subscribedSet = new Set(subscriptions.map(s => s.boardId));

    return boards.map(board =>
      plainToInstance(BoardResponseDto, {
        ...board,
        subscriberCount: board._count.subscriptions,
        isSubscribed: subscribedSet.has(board.id),
      }),
    );
  }

  async findOne(id: string, userId?: string): Promise<BoardResponseDto> {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { _count: { select: { subscriptions: true } } },
    });

    if (!board) {
      throw new NotFoundException(`게시판을 찾을 수 없습니다: ${id}`);
    }

    const isSubscribed = userId
      ? !!(await this.prisma.boardSubscription.findUnique({
          where: { userId_boardId: { userId, boardId: id } },
        }))
      : false;

    return plainToInstance(BoardResponseDto, {
      ...board,
      subscriberCount: board._count.subscriptions,
      isSubscribed,
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<BoardResponseDto> {
    const board = await this.prisma.board.update({
      where: { id },
      data: { ...updateBoardDto },
      include: { _count: { select: { subscriptions: true } } },
    });
    return plainToInstance(BoardResponseDto, {
      ...board,
      subscriberCount: board._count.subscriptions,
      isSubscribed: false,
    });
  }

  async remove(id: string): Promise<BoardResponseDto> {
    const board = await this.prisma.board.delete({
      where: { id },
      include: { _count: { select: { subscriptions: true } } },
    });
    return plainToInstance(BoardResponseDto, {
      ...board,
      subscriberCount: board._count.subscriptions,
      isSubscribed: false,
    });
  }

  async subscribe(userId: string, boardId: string): Promise<void> {
    const board = await this.prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException(`게시판을 찾을 수 없습니다: ${boardId}`);
    }

    const existing = await this.prisma.boardSubscription.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    if (existing) {
      throw new ConflictException('이미 구독 중인 게시판입니다.');
    }

    await this.prisma.boardSubscription.create({
      data: { userId, boardId },
    });
  }

  async unsubscribe(userId: string, boardId: string): Promise<void> {
    const existing = await this.prisma.boardSubscription.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    if (!existing) {
      throw new NotFoundException('구독 중이지 않은 게시판입니다.');
    }

    await this.prisma.boardSubscription.delete({
      where: { userId_boardId: { userId, boardId } },
    });
  }
}
