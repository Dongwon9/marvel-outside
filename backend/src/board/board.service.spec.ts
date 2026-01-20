import { Test, TestingModule } from '@nestjs/testing';

import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

import { Board } from '@/generated/prisma/client';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    it('should create a board without description', async () => {
      const createBoardDto: CreateBoardDto = {
        name: 'Test Board',
      };
      const expectedBoard: Board = {
        id: 'board-id-123',
        name: 'Test Board',
        description: null,
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

    it('should return an empty array when no boards exist', async () => {
      jest.spyOn(prismaService.board, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prismaService.board.findMany).toHaveBeenCalled();
    });

    it('should call findMany without parameters', async () => {
      const expectedBoards: Board[] = [];

      jest.spyOn(prismaService.board, 'findMany').mockResolvedValue(expectedBoards);

      await service.findAll();

      expect(prismaService.board.findMany).toHaveBeenCalledWith();
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

    it('should convert id to string', async () => {
      const boardId = 'board-id-123';
      const expectedBoard: Board = {
        id: boardId,
        name: 'Test Board',
        description: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'findUnique').mockResolvedValue(expectedBoard);

      await service.findOne(boardId);

      expect(prismaService.board.findUnique).toHaveBeenCalledWith({
        where: { id: String(boardId) },
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

    it('should update only the name', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        name: 'Updated Name Only',
      };
      const expectedBoard: Board = {
        id: boardId,
        name: 'Updated Name Only',
        description: 'Original Description',
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

    it('should update only the description', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        description: 'Updated Description Only',
      };
      const expectedBoard: Board = {
        id: boardId,
        name: 'Original Name',
        description: 'Updated Description Only',
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

    it('should convert id to string when updating', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        name: 'Updated Board',
      };
      const expectedBoard: Board = {
        id: boardId,
        name: 'Updated Board',
        description: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'update').mockResolvedValue(expectedBoard);

      await service.update(boardId, updateBoardDto);

      expect(prismaService.board.update).toHaveBeenCalledWith({
        where: { id: String(boardId) },
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

    it('should convert id to string when deleting', async () => {
      const boardId = 'board-id-123';
      const expectedBoard: Board = {
        id: boardId,
        name: 'Deleted Board',
        description: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.board, 'delete').mockResolvedValue(expectedBoard);

      await service.remove(boardId);

      expect(prismaService.board.delete).toHaveBeenCalledWith({
        where: { id: String(boardId) },
      });
    });
  });
});
