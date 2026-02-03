import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

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

  describe('post', () => {
    it('returns mapped post when found', async () => {
      const post = {
        id: '1',
        title: 't',
        content: 'c',
        authorId: 'a',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
        boardId: 'b',
        rates: [
          { userId: 'u1', isLike: true },
          { userId: 'u2', isLike: false },
        ],
        author: { name: 'author-name' },
        board: { name: 'board-name' },
      };
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.post('1');

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          rates: { omit: { postId: true } },
          author: { select: { name: true } },
          board: { select: { name: true } },
        },
      });
      expect(result).toMatchObject({
        id: '1',
        title: 't',
        content: 'c',
        likeCount: 1,
        dislikeCount: 1,
      });
    });

    it('returns null when not found', async () => {
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.post('missing');

      expect(result).toBeNull();
    });
  });

  describe('posts', () => {
    const commonInclude = {
      rates: true,
      author: {
        select: {
          name: true,
        },
      },
      board: {
        select: {
          name: true,
        },
      },
    };
    it('returns multiple posts', async () => {
      const posts = [
        {
          id: '1',
          title: 'a',
          content: 'c1',
          authorId: 'a1',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
          hits: 0,
          boardId: 'b1',
          rates: [],
          author: { name: 'author1' },
          board: { name: 'board1' },
        },
        {
          id: '2',
          title: 'b',
          content: 'c2',
          authorId: 'a2',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
          hits: 0,
          boardId: 'b2',
          rates: [],
          author: { name: 'author2' },
          board: { name: 'board2' },
        },
      ];
      prismaMock.post.findMany = jest.fn().mockResolvedValue(posts);
      const result = await service.posts({});

      expect(prismaMock.post.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('omits order when not provided', async () => {
      prismaMock.post.findMany = jest.fn().mockResolvedValue([]);
      const query: GetPostsQueryDto = { skip: 5, take: 5, orderBy: undefined };

      await service.posts(query);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        include: commonInclude,
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {},
      });
    });
  });

  describe('createPost', () => {
    it('creates and returns mapped post', async () => {
      const dto = {
        title: 'new',
        content: 'body',
        boardId: 'board-2',
        authorId: 'author-1',
      };
      const created = { id: '1', ...dto };
      prismaMock.post.create = jest.fn().mockResolvedValue(created);

      const result = await service.createPost(dto);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          content: dto.content,
          author: { connect: { id: dto.authorId } },
          board: { connect: { id: dto.boardId } },
        },
      });
      expect(result).toMatchObject(created);
    });

    it('fills empty content when missing', async () => {
      const dto = { title: 'no content', authorId: 'a1', boardId: 'b1' };
      const created = { id: '2', title: dto.title, content: '', authorId: dto.authorId };
      prismaMock.post.create = jest.fn().mockResolvedValue(created);

      const result = await service.createPost(dto);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          content: '',
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
    it('returns correct like and dislike counts', async () => {
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

    it('throws BadRequestException when post not found', async () => {
      prismaMock.post.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getPostRatings('missing')).rejects.toThrow(BadRequestException);
      await expect(service.getPostRatings('missing')).rejects.toThrow('Post not found');
    });
  });
});
