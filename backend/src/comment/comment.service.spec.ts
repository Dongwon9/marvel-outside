import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';

import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      comment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  describe('create', () => {
    it('should create a comment and return CommentResponseDto', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      const createDto = { content: 'Great post!' };
      const mockComment = {
        id: 'comment-1',
        content: 'Great post!',
        postId,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: authorId, name: 'Test User', deletedAt: null },
      };

      prismaMock.comment.create.mockResolvedValue(mockComment);

      const result = await service.create(postId, authorId, createDto);

      expect(prismaMock.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Great post!',
          postId,
          authorId,
        },
        include: {
          author: { select: { id: true, name: true, deletedAt: true } },
        },
      });
      expect(result.content).toBe('Great post!');
    });
  });

  describe('findAllByPost', () => {
    it('should return all comments for a post', async () => {
      const postId = 'post-1';
      const mockComments = [
        {
          id: 'comment-1',
          content: 'First comment',
          postId,
          authorId: 'author-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'author-1', name: 'User 1', deletedAt: null },
        },
        {
          id: 'comment-2',
          content: 'Second comment',
          postId,
          authorId: 'author-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 'author-2', name: 'User 2', deletedAt: null },
        },
      ];

      prismaMock.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findAllByPost(postId);

      expect(prismaMock.comment.findMany).toHaveBeenCalledWith({
        where: { postId },
        include: {
          author: { select: { id: true, name: true, deletedAt: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when post has no comments', async () => {
      const postId = 'post-no-comments';
      prismaMock.comment.findMany.mockResolvedValue([]);

      const result = await service.findAllByPost(postId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a comment when found', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      const mockComment = {
        id: 'comment-1',
        content: 'Test comment',
        postId,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: authorId, name: 'Test User', deletedAt: null },
      };

      prismaMock.comment.findUnique.mockResolvedValue(mockComment);

      const result = await service.findOne(postId, authorId);

      expect(prismaMock.comment.findUnique).toHaveBeenCalledWith({
        where: { authorId_postId: { authorId, postId } },
        include: {
          author: { select: { id: true, name: true, deletedAt: true } },
        },
      });
      expect(result!.content).toBe('Test comment');
    });

    it('should return null when comment not found', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      prismaMock.comment.findUnique.mockResolvedValue(null);

      const result = await service.findOne(postId, authorId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated comment', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      const updateDto = { content: 'Updated comment' };
      const mockComment = {
        id: 'comment-1',
        content: 'Updated comment',
        postId,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: authorId, name: 'Test User', deletedAt: null },
      };

      prismaMock.comment.findUnique.mockResolvedValueOnce(mockComment);
      prismaMock.comment.update.mockResolvedValue(mockComment);

      const result = await service.update(postId, authorId, updateDto);

      expect(prismaMock.comment.update).toHaveBeenCalledWith({
        where: { authorId_postId: { authorId, postId } },
        data: updateDto,
        include: {
          author: { select: { id: true, name: true, deletedAt: true } },
        },
      });
      expect(result.content).toBe('Updated comment');
    });

    it('should throw NotFoundException when comment not found', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      prismaMock.comment.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(postId, authorId, { content: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      const mockComment = { id: 'comment-1', content: 'Test' };

      prismaMock.comment.findUnique.mockResolvedValueOnce(mockComment);
      prismaMock.comment.delete.mockResolvedValue(mockComment);

      await service.remove(postId, authorId);

      expect(prismaMock.comment.delete).toHaveBeenCalledWith({
        where: { authorId_postId: { authorId, postId } },
      });
    });

    it('should throw NotFoundException when comment not found', async () => {
      const postId = 'post-1';
      const authorId = 'author-1';
      prismaMock.comment.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(postId, authorId)).rejects.toThrow(NotFoundException);
    });
  });
});
