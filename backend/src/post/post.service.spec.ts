import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';

describe('PostService', () => {
  let service: PostService;
  const prismaMock = {
    post: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    jest.clearAllMocks();
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('returns mapped post when found', async () => {
      const post = { id: '1', title: 't', content: 'c', authorId: 'a' };
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.post('1');

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toMatchObject(post);
    });

    it('returns null when not found', async () => {
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.post('missing');

      expect(result).toBeNull();
    });
  });

  describe('posts', () => {
    it('returns mapped posts with order', async () => {
      const posts = [
        { id: '1', title: 'a', content: 'c1', authorId: 'a1' },
        { id: '2', title: 'b', content: 'c2', authorId: 'a2' },
      ];
      prismaMock.post.findMany = jest.fn().mockResolvedValue(posts);
      const query: GetPostsQueryDto = { skip: 0, take: 10, orderBy: 'title' };

      const result = await service.posts(query);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { title: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(posts[0]);
    });

    it('omits order when not provided', async () => {
      prismaMock.post.findMany = jest.fn().mockResolvedValue([]);
      const query: GetPostsQueryDto = { skip: 5, take: 5, orderBy: undefined };

      await service.posts(query);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: undefined,
      });
    });
  });

  describe('createPost', () => {
    it('creates and returns mapped post', async () => {
      const dto: CreatePostDto = {
        title: 'new',
        content: 'body',
        authorId: 'author-1',
        boardId: 'board-2',
      };
      const created = { id: '1', ...dto };
      prismaMock.post.create = jest.fn().mockResolvedValue(created);

      const result = await service.createPost(dto);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          content: dto.content,
          contentFormat: dto.contentFormat || 'markdown',
          author: { connect: { id: dto.authorId } },
          board: { connect: { id: dto.boardId } },
        },
      });
      expect(result).toMatchObject(created);
    });

    it('fills empty content when missing', async () => {
      const dto = { title: 'no content', authorId: 'a1', boardId: 'b1' } as CreatePostDto;
      const created = { id: '2', title: dto.title, content: '', authorId: dto.authorId };
      prismaMock.post.create = jest.fn().mockResolvedValue(created);

      const result = await service.createPost(dto);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          content: '',
          contentFormat: 'markdown',
          author: { connect: { id: dto.authorId } },
          board: { connect: { id: dto.boardId } },
        },
      });
      expect(result).toMatchObject(created);
    });
  });

  describe('updatePost', () => {
    it('updates and returns mapped post', async () => {
      const dto: UpdatePostDto = { title: 'updated', content: 'new' };
      const updated = { id: '1', ...dto, authorId: 'a1' };
      prismaMock.post.update = jest.fn().mockResolvedValue(updated);

      const result = await service.updatePost('1', dto);

      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
      expect(result).toMatchObject(updated);
    });
  });

  describe('deletePost', () => {
    it('deletes and returns mapped post', async () => {
      const deleted = { id: '1', title: 't', content: 'c', authorId: 'a1' };
      prismaMock.post.delete = jest.fn().mockResolvedValue(deleted);

      const result = await service.deletePost('1');

      expect(prismaMock.post.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toMatchObject(deleted);
    });
  });

  describe('getPostRatings', () => {
    it('returns like and dislike counts for post with ratings', async () => {
      const post = {
        id: '1',
        title: 'test',
        content: 'content',
        authorId: 'author-1',
        rates: [
          { userId: 'u1', postId: '1', isLike: true, createdAt: new Date() },
          { userId: 'u2', postId: '1', isLike: true, createdAt: new Date() },
          { userId: 'u3', postId: '1', isLike: false, createdAt: new Date() },
        ],
      };
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.getPostRatings('1');

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { rates: true },
      });
      expect(result).toEqual({ likeCount: 2, dislikeCount: 1 });
    });

    it('returns zero counts for post with no ratings', async () => {
      const post = {
        id: '2',
        title: 'test',
        content: 'content',
        authorId: 'author-1',
        rates: [],
      };
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.getPostRatings('2');

      expect(result).toEqual({ likeCount: 0, dislikeCount: 0 });
    });

    it('returns all likes when no dislikes exist', async () => {
      const post = {
        id: '3',
        title: 'test',
        content: 'content',
        authorId: 'author-1',
        rates: [
          { userId: 'u1', postId: '3', isLike: true, createdAt: new Date() },
          { userId: 'u2', postId: '3', isLike: true, createdAt: new Date() },
        ],
      };
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.getPostRatings('3');

      expect(result).toEqual({ likeCount: 2, dislikeCount: 0 });
    });

    it('returns all dislikes when no likes exist', async () => {
      const post = {
        id: '4',
        title: 'test',
        content: 'content',
        authorId: 'author-1',
        rates: [
          { userId: 'u1', postId: '4', isLike: false, createdAt: new Date() },
          { userId: 'u2', postId: '4', isLike: false, createdAt: new Date() },
        ],
      };
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.getPostRatings('4');

      expect(result).toEqual({ likeCount: 0, dislikeCount: 2 });
    });

    it('throws BadRequestException when post not found', async () => {
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getPostRatings('missing')).rejects.toThrow(BadRequestException);
      await expect(service.getPostRatings('missing')).rejects.toThrow('Post not found');
    });
  });
});
