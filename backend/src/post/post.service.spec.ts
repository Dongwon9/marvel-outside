import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let prismaMock: any;

  const commonInclude = {
    rates: true,
    author: {
      select: {
        name: true,
        deletedAt: true,
      },
    },
    board: {
      select: {
        name: true,
      },
    },
  };

  beforeEach(async () => {
    prismaMock = {
      post: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      follow: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

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
      prismaMock.post.findUnique.mockResolvedValue(post);

      const result = await service.post('1');

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          rates: { omit: { postId: true } },
          author: { select: { name: true, deletedAt: true } },
          board: { select: { name: true } },
        },
      });
      expect(result).toMatchObject({
        id: '1',
        title: 't',
        content: 'c',
        likeCount: 1,
        dislikeCount: 1,
        authorName: 'author-name',
        boardName: 'board-name',
      });
    });

    it('Throws exception when not found', async () => {
      prismaMock.post.findUnique.mockResolvedValue(null);

      await expect(service.post('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('posts', () => {
    it('returns multiple posts with correct data transformation', async () => {
      const posts = [
        {
          id: 'post-1',
          title: 'First Post',
          content: 'content1',
          authorId: 'a1',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-11'),
          publishedAt: null,
          hits: 5,
          boardId: 'b1',
          rates: [{ userId: 'u1', isLike: true }],
          author: { name: 'Author 1' },
          board: { name: 'Board 1' },
        },
        {
          id: 'post-2',
          title: 'Second Post',
          content: 'content2',
          authorId: 'a2',
          createdAt: new Date('2024-01-09'),
          updatedAt: new Date('2024-01-09'),
          publishedAt: null,
          hits: 3,
          boardId: 'b2',
          rates: [
            { userId: 'u2', isLike: false },
            { userId: 'u3', isLike: false },
          ],
          author: { name: 'Author 2' },
          board: { name: 'Board 2' },
        },
      ];
      prismaMock.post.findMany.mockResolvedValue(posts);

      const result = await service.posts({});

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {
          publishedAt: {
            not: null,
          },
        },
        include: commonInclude,
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 'post-1',
        title: 'First Post',
        likeCount: 1,
        dislikeCount: 0,
        authorName: 'Author 1',
        boardName: 'Board 1',
      });
      expect(result[1]).toMatchObject({
        id: 'post-2',
        likeCount: 0,
        dislikeCount: 2,
      });
    });

    it('returns empty array when no posts exist', async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      const result = await service.posts({});

      expect(prismaMock.post.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('applies pagination and ordering parameters', async () => {
      prismaMock.post.findMany.mockResolvedValue([]);
      const query: GetPostsQueryDto = { skip: 5, take: 5, orderBy: undefined };

      await service.posts(query);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        include: commonInclude,
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
          publishedAt: {
            not: null,
          },
        },
      });
    });
  });

  describe('createPost', () => {
    it('creates post with all provided fields', async () => {
      const dto = {
        title: 'New Post',
        content: 'Post content here',
        boardId: 'board-1',
        authorId: 'author-1',
      };
      const created = {
        id: 'post-1',
        title: dto.title,
        content: dto.content,
        authorId: dto.authorId,
        boardId: dto.boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.create.mockResolvedValue(created);

      const result = await service.createPost(dto);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title: 'New Post',
          content: 'Post content here',
          author: { connect: { id: 'author-1' } },
          board: { connect: { id: 'board-1' } },
        },
      });
      expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
      expect(result).toBe('post-1');
    });
  });

  describe('updatePost', () => {
    it('updates post with provided fields', async () => {
      const postId = 'post-1';
      const dto: UpdatePostDto = { title: 'Updated Title', content: 'Updated content' };
      const updated = {
        id: postId,
        title: 'Updated Title',
        content: 'Updated content',
        authorId: 'author-1',
        boardId: 'board-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.update.mockResolvedValue(updated);

      const result = await service.updatePost(postId, dto);

      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: dto,
      });
      expect(prismaMock.post.update).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: postId,
        title: 'Updated Title',
        content: 'Updated content',
      });
    });
  });

  describe('deletePost', () => {
    it('deletes post and returns deleted post data', async () => {
      const postId = 'post-1';
      const deleted = {
        id: postId,
        title: 'Deleted Post',
        content: 'This post will be deleted',
        authorId: 'author-1',
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 5,
      };
      prismaMock.post.delete.mockResolvedValue(deleted);

      const result = await service.deletePost(postId);

      expect(prismaMock.post.delete).toHaveBeenCalledWith({ where: { id: postId } });
      expect(prismaMock.post.delete).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: postId,
        title: 'Deleted Post',
        content: 'This post will be deleted',
        authorId: 'author-1',
      });
    });
  });

  describe('getPostRatings', () => {
    it('returns correct like and dislike counts with multiple ratings', async () => {
      const postId = 'post-1';
      const post = {
        id: postId,
        title: 'Popular post',
        content: 'content',
        authorId: 'author-1',
        rates: [
          { userId: 'u1', postId, isLike: true, createdAt: new Date() },
          { userId: 'u2', postId, isLike: true, createdAt: new Date() },
          { userId: 'u3', postId, isLike: true, createdAt: new Date() },
          { userId: 'u4', postId, isLike: false, createdAt: new Date() },
          { userId: 'u5', postId, isLike: false, createdAt: new Date() },
        ],
      };
      prismaMock.post.findUnique.mockResolvedValue(post);

      const result = await service.getPostRatings(postId);

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: { rates: true },
      });
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ likeCount: 3, dislikeCount: 2 });
    });

    it('throws NotFoundException when post not found', async () => {
      const postId = 'missing-post';
      prismaMock.post.findUnique.mockResolvedValue(null);

      await expect(service.getPostRatings(postId)).rejects.toThrow(NotFoundException);
      await expect(service.getPostRatings(postId)).rejects.toThrow('Post not found');
      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: { rates: true },
      });
    });
  });

  describe('postsForFeed', () => {
    it('returns posts from followed users ordered by creation date', async () => {
      const userId = 'user-1';
      const followings = [{ followingId: 'author-1' }, { followingId: 'author-2' }];
      const posts = [
        {
          id: 'post-1',
          title: 'Recent post',
          content: 'content1',
          authorId: 'author-1',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          publishedAt: null,
          hits: 5,
          boardId: 'board-1',
          rates: [{ userId: 'u1', isLike: true }],
          author: { name: 'Author One' },
          board: { name: 'Board One' },
        },
        {
          id: 'post-2',
          title: 'Older post',
          content: 'content2',
          authorId: 'author-2',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          publishedAt: null,
          hits: 3,
          boardId: 'board-2',
          rates: [],
          author: { name: 'Author Two' },
          board: { name: 'Board Two' },
        },
      ];
      prismaMock.follow.findMany.mockResolvedValue(followings);
      prismaMock.post.findMany.mockResolvedValue(posts);

      const result = await service.postsForFeed(userId);

      expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        select: { followingId: true },
      });
      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {
          authorId: { in: ['author-1', 'author-2'] },
          publishedAt: {
            not: null,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: commonInclude,
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 'post-1',
        title: 'Recent post',
        likeCount: 1,
        dislikeCount: 0,
        authorName: 'Author One',
        boardName: 'Board One',
      });
      expect(result[1]).toMatchObject({
        id: 'post-2',
        title: 'Older post',
        likeCount: 0,
        dislikeCount: 0,
        authorName: 'Author Two',
        boardName: 'Board Two',
      });
    });

    it('returns empty array when user follows no one', async () => {
      const userId = 'user-no-follows';
      prismaMock.follow.findMany.mockResolvedValue([]);
      prismaMock.post.findMany.mockResolvedValue([]);

      const result = await service.postsForFeed(userId);

      expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
        where: {
          followerId: userId,
        },
        select: { followingId: true },
      });
      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {
          authorId: { in: [] },
          publishedAt: {
            not: null,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: commonInclude,
      });
      expect(result).toEqual([]);
    });

    it('returns empty array when followed users have no posts', async () => {
      const userId = 'user-2';
      const followings = [{ followingId: 'author-1' }];
      prismaMock.follow.findMany.mockResolvedValue(followings);
      prismaMock.post.findMany.mockResolvedValue([]);

      const result = await service.postsForFeed(userId);

      expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        select: { followingId: true },
      });
      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {
          authorId: { in: ['author-1'] },
          publishedAt: {
            not: null,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: commonInclude,
      });
      expect(result).toEqual([]);
    });
  });

  describe('saveDraft', () => {
    it('should update a draft post', async () => {
      const postId = 'post-1';
      const updateDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };
      const draftPost = {
        id: postId,
        title: 'Original Title',
        content: 'Original content',
        authorId: 'author-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null, // Draft post
        hits: 0,
        boardId: 'board-1',
        rates: [],
        author: { name: 'Author 1', deletedAt: null },
        board: { name: 'Board 1' },
      };

      prismaMock.post.findUnique.mockResolvedValueOnce(draftPost);
      prismaMock.post.update.mockResolvedValueOnce({
        ...draftPost,
        ...updateDto,
      });

      const result = await service.saveDraft(postId, updateDto);

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: updateDto,
        include: commonInclude,
      });
      expect(result).toMatchObject({
        id: postId,
        title: 'Updated Title',
      });
    });

    it('should throw error when trying to save a published post', async () => {
      const postId = 'post-1';
      const publishedPost = {
        id: postId,
        title: 'Published Title',
        content: 'Published content',
        authorId: 'author-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(), // Published post
        hits: 0,
        boardId: 'board-1',
      };

      prismaMock.post.findUnique.mockResolvedValueOnce(publishedPost);

      await expect(service.saveDraft(postId, { title: 'New Title' })).rejects.toThrow(
        'Cannot edit a published post',
      );
    });

    it('should throw error when post not found', async () => {
      const postId = 'non-existent-id';
      prismaMock.post.findUnique.mockResolvedValueOnce(null);

      await expect(service.saveDraft(postId, { title: 'New Title' })).rejects.toThrow(
        'Post not found',
      );
    });
  });

  describe('publishDraft', () => {
    it('should publish a draft post', async () => {
      const postId = 'post-1';
      const draftPost = {
        id: postId,
        title: 'Draft Title',
        content: 'Draft content',
        authorId: 'author-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null, // Draft post
        hits: 0,
        boardId: 'board-1',
      };
      const publishedPost = {
        ...draftPost,
        publishedAt: new Date(),
        rates: [],
        author: { name: 'Author 1', deletedAt: null },
        board: { name: 'Board 1' },
      };

      prismaMock.post.findUnique.mockResolvedValueOnce(draftPost);
      prismaMock.post.update.mockResolvedValueOnce(publishedPost);

      const result = await service.publishDraft(postId);

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: expect.objectContaining({ publishedAt: expect.any(Date) }),
        include: commonInclude,
      });
      expect(result.publishedAt).not.toBeNull();
    });

    it('should throw error when trying to publish an already published post', async () => {
      const postId = 'post-1';
      const publishedPost = {
        id: postId,
        title: 'Published Title',
        content: 'Published content',
        authorId: 'author-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
        hits: 0,
        boardId: 'board-1',
      };

      prismaMock.post.findUnique.mockResolvedValueOnce(publishedPost);

      await expect(service.publishDraft(postId)).rejects.toThrow('Post is already published');
    });

    it('should throw error when post not found', async () => {
      const postId = 'non-existent-id';
      prismaMock.post.findUnique.mockResolvedValueOnce(null);

      await expect(service.publishDraft(postId)).rejects.toThrow('Post not found');
    });
  });
});
