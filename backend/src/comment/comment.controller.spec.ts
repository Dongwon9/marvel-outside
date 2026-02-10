import { Test, TestingModule } from '@nestjs/testing';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  const mockCommentService = {
    create: jest.fn(),
    findAllByPost: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: mockCommentService }],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const postId = 'post-1';
      const userId = 'user-1';
      const createDto = { content: 'Test comment' };
      const mockResult = { id: 'comment-1', content: 'Test comment' };

      mockCommentService.create.mockResolvedValue(mockResult);

      const result = await controller.create(postId, { id: userId } as any, createDto);

      expect(service.create).toHaveBeenCalledWith(postId, userId, createDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return all comments for a post', async () => {
      const postId = 'post-1';
      const mockResults = [
        { id: 'comment-1', content: 'Comment 1' },
        { id: 'comment-2', content: 'Comment 2' },
      ];

      mockCommentService.findAllByPost.mockResolvedValue(mockResults);

      const result = await controller.findAll(postId);

      expect(service.findAllByPost).toHaveBeenCalledWith(postId);
      expect(result).toEqual(mockResults);
    });
  });

  describe('findOne', () => {
    it('should return a single comment', async () => {
      const postId = 'post-1';
      const userId = 'user-1';
      const mockResult = { id: 'comment-1', content: 'Test comment' };

      mockCommentService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne(postId, { id: userId } as any);

      expect(service.findOne).toHaveBeenCalledWith(postId, userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const postId = 'post-1';
      const userId = 'user-1';
      const updateDto = { content: 'Updated comment' };
      const mockResult = { id: 'comment-1', content: 'Updated comment' };

      mockCommentService.update.mockResolvedValue(mockResult);

      const result = await controller.update(postId, { id: userId } as any, updateDto);

      expect(service.update).toHaveBeenCalledWith(postId, userId, updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      const postId = 'post-1';
      const userId = 'user-1';

      mockCommentService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(postId, { id: userId } as any);

      expect(service.remove).toHaveBeenCalledWith(postId, userId);
      expect(result).toBeUndefined();
    });
  });
});
