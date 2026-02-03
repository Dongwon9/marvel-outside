import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardController', () => {
  let controller: BoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
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

    controller = module.get<BoardController>(BoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const createBoardDto: CreateBoardDto = {
        name: 'Test Board',
        description: 'Test Description',
      };
      const expectedBoard = {
        id: 'board-id-123',
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
      };

      jest.spyOn(controller['boardService'], 'create').mockResolvedValue(expectedBoard);

      const result = await controller.create(createBoardDto);

      expect(result).toEqual(expectedBoard);
      expect(controller['boardService'].create).toHaveBeenCalledWith(createBoardDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      const expectedBoards = [
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

      jest.spyOn(controller['boardService'], 'findAll').mockResolvedValue(expectedBoards);

      const result = await controller.findAll();

      expect(result).toEqual(expectedBoards);
      expect(controller['boardService'].findAll).toHaveBeenCalled();
    });

    it('should return an empty array when no boards exist', async () => {
      jest.spyOn(controller['boardService'], 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(controller['boardService'].findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a board by id', async () => {
      const boardId = 'board-id-123';
      const expectedBoard = {
        id: boardId,
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
      };

      jest.spyOn(controller['boardService'], 'findOne').mockResolvedValue(expectedBoard);

      const result = await controller.findOne(boardId);

      expect(result).toEqual(expectedBoard);
      expect(controller['boardService'].findOne).toHaveBeenCalledWith(boardId);
    });

    it('should return null when board is not found', async () => {
      const boardId = 'non-existent-id';

      jest.spyOn(controller['boardService'], 'findOne').mockResolvedValue(null);

      const result = await controller.findOne(boardId);

      expect(result).toBeNull();
      expect(controller['boardService'].findOne).toHaveBeenCalledWith(boardId);
    });
  });

  describe('update', () => {
    it('should update a board', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        name: 'Updated Board',
        description: 'Updated Description',
      };
      const expectedBoard = {
        id: boardId,
        name: 'Updated Board',
        description: 'Updated Description',
        createdAt: new Date(),
      };

      jest.spyOn(controller['boardService'], 'update').mockResolvedValue(expectedBoard);

      const result = await controller.update(boardId, updateBoardDto);

      expect(result).toEqual(expectedBoard);
      expect(controller['boardService'].update).toHaveBeenCalledWith(boardId, updateBoardDto);
    });

    it('should update only the name', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        name: 'Updated Name Only',
      };
      const expectedBoard = {
        id: boardId,
        name: 'Updated Name Only',
        description: 'Original Description',
        createdAt: new Date(),
      };

      jest.spyOn(controller['boardService'], 'update').mockResolvedValue(expectedBoard);

      const result = await controller.update(boardId, updateBoardDto);

      expect(result).toEqual(expectedBoard);
      expect(controller['boardService'].update).toHaveBeenCalledWith(boardId, updateBoardDto);
    });

    it('should update only the description', async () => {
      const boardId = 'board-id-123';
      const updateBoardDto: UpdateBoardDto = {
        description: 'Updated Description Only',
      };
      const expectedBoard = {
        id: boardId,
        name: 'Original Name',
        description: 'Updated Description Only',
        createdAt: new Date(),
      };

      jest.spyOn(controller['boardService'], 'update').mockResolvedValue(expectedBoard);

      const result = await controller.update(boardId, updateBoardDto);

      expect(result).toEqual(expectedBoard);
      expect(controller['boardService'].update).toHaveBeenCalledWith(boardId, updateBoardDto);
    });
  });

  describe('remove', () => {
    it('should delete a board', async () => {
      const boardId = 'board-id-123';
      const expectedBoard = {
        id: boardId,
        name: 'Deleted Board',
        description: 'This board was deleted',
        createdAt: new Date(),
      };

      jest.spyOn(controller['boardService'], 'remove').mockResolvedValue(expectedBoard);

      const result = await controller.remove(boardId);

      expect(result).toEqual(expectedBoard);
      expect(controller['boardService'].remove).toHaveBeenCalledWith(boardId);
    });
  });
});
