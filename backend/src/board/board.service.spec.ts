import { Test, TestingModule } from '@nestjs/testing';

import { Board } from '@/generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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
      const expectedBoard: Board = {
        id: 'board-id-123',
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'create').mockResolvedValue(expectedBoard);

      const result = await service.create(createBoardDto);

      expect(result).toEqual(expectedBoard);
      expect(prismaService.board.create).toHaveBeenCalledWith({
        data: createBoardDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      const expectedBoards: Board[] = [
        {
          id: 'board-1',
          name: 'Board 1',
          description: 'Description 1',
          createdAt: new Date(),
        },
        {
          id: 'board-2',
          name: 'Board 2',
          description: null,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.board, 'findMany').mockResolvedValue(expectedBoards);

      const result = await service.findAll();

      expect(result).toEqual(expectedBoards);
      expect(prismaService.board.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a board by id', async () => {
      const boardId = 'board-id-123';
      const expectedBoard: Board = {
        id: boardId,
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'findUnique').mockResolvedValue(expectedBoard);

      const result = await service.findOne(boardId);

      expect(result).toEqual(expectedBoard);
      expect(prismaService.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
      });
    });

    it('should return null when board is not found', async () => {
      const boardId = 'non-existent-id';

      jest.spyOn(prismaService.board, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne(boardId);

      expect(result).toBeNull();
      expect(prismaService.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
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
      const expectedBoard: Board = {
        id: boardId,
        name: 'Updated Board',
        description: 'Updated Description',
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'update').mockResolvedValue(expectedBoard);

      const result = await service.update(boardId, updateBoardDto);

      expect(result).toEqual(expectedBoard);
      expect(prismaService.board.update).toHaveBeenCalledWith({
        where: { id: boardId },
        data: updateBoardDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a board', async () => {
      const boardId = 'board-id-123';
      const expectedBoard: Board = {
        id: boardId,
        name: 'Deleted Board',
        description: 'This board was deleted',
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'delete').mockResolvedValue(expectedBoard);

      const result = await service.remove(boardId);

      expect(result).toEqual(expectedBoard);
      expect(prismaService.board.delete).toHaveBeenCalledWith({
        where: { id: boardId },
      });
    });
  });
});
