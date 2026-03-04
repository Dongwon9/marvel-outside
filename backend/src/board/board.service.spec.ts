import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

type BoardWithCount = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: { subscriptions: number };
};

describe('BoardService', () => {
  let service: BoardService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: PrismaService,
          useValue: {
            board: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            boardSubscription: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const createBoardDto: CreateBoardDto = {
        name: 'Test Board',
        description: 'Test Description',
      };
      const createdBoard: BoardWithCount = {
        id: 'board-id-123',
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
        _count: { subscriptions: 0 },
      };

      jest.spyOn(prismaService.board, 'create').mockResolvedValue(createdBoard as never);

      const result = await service.create(createBoardDto);

      expect(result).toMatchObject({
        id: createdBoard.id,
        name: createdBoard.name,
        description: createdBoard.description,
        subscriberCount: 0,
        isSubscribed: false,
      });
      expect(prismaService.board.create).toHaveBeenCalledWith({
        data: createBoardDto,
        include: { _count: { select: { subscriptions: true } } },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      const boardsWithCount: BoardWithCount[] = [
        {
          id: 'board-1',
          name: 'Board 1',
          description: 'Description 1',
          createdAt: new Date(),
          _count: { subscriptions: 1 },
        },
        {
          id: 'board-2',
          name: 'Board 2',
          description: null,
          createdAt: new Date(),
          _count: { subscriptions: 0 },
        },
      ];

      jest.spyOn(prismaService.board, 'findMany').mockResolvedValue(boardsWithCount as never);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 'board-1',
        name: 'Board 1',
        subscriberCount: 1,
        isSubscribed: false,
      });
      expect(result[1]).toMatchObject({
        id: 'board-2',
        name: 'Board 2',
        subscriberCount: 0,
        isSubscribed: false,
      });
      expect(prismaService.board.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { subscriptions: true } } },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a board by id', async () => {
      const boardId = 'board-id-123';
      const boardWithCount: BoardWithCount = {
        id: boardId,
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
        _count: { subscriptions: 2 },
      };

      jest.spyOn(prismaService.board, 'findUnique').mockResolvedValue(boardWithCount as never);
      jest
        .spyOn(prismaService.boardSubscription, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findOne(boardId);

      expect(result).toMatchObject({
        id: boardId,
        name: 'Test Board',
        subscriberCount: 2,
        isSubscribed: false,
      });
      expect(prismaService.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
        include: { _count: { select: { subscriptions: true } } },
      });
    });

    it('should throw NotFoundException when board is not found', async () => {
      const boardId = 'non-existent-id';

      jest.spyOn(prismaService.board, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(boardId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(boardId)).rejects.toThrow(
        `게시판을 찾을 수 없습니다: ${boardId}`,
      );
      expect(prismaService.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
        include: { _count: { select: { subscriptions: true } } },
      });
    });
  });

  describe('update', () => {
    it('should update a board', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        name: 'Updated Board',
        description: 'Updated Description',
      };
      const updatedBoard: BoardWithCount = {
        id: boardId,
        name: 'Updated Board',
        description: 'Updated Description',
        createdAt: new Date(),
        _count: { subscriptions: 0 },
      };

      jest.spyOn(prismaService.board, 'update').mockResolvedValue(updatedBoard as never);

      const result = await service.update(boardId, updateBoardDto);

      expect(result).toMatchObject({
        id: boardId,
        name: 'Updated Board',
        description: 'Updated Description',
        subscriberCount: 0,
        isSubscribed: false,
      });
      expect(prismaService.board.update).toHaveBeenCalledWith({
        where: { id: boardId },
        data: updateBoardDto,
        include: { _count: { select: { subscriptions: true } } },
      });
    });
  });

  describe('remove', () => {
    it('should delete a board', async () => {
      const boardId = 'board-id-123';
      const deletedBoard: BoardWithCount = {
        id: boardId,
        name: 'Deleted Board',
        description: 'This board was deleted',
        createdAt: new Date(),
        _count: { subscriptions: 0 },
      };

      jest.spyOn(prismaService.board, 'delete').mockResolvedValue(deletedBoard as never);

      const result = await service.remove(boardId);

      expect(result).toMatchObject({
        id: boardId,
        name: 'Deleted Board',
        subscriberCount: 0,
        isSubscribed: false,
      });
      expect(prismaService.board.delete).toHaveBeenCalledWith({
        where: { id: boardId },
        include: { _count: { select: { subscriptions: true } } },
      });
    });
  });
});
