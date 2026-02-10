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
        include: commonInclude,
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
        where: {},
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
        where: {},
      });
    });

    it('respects custom orderBy parameter', async () => {
      prismaMock.post.findMany.mockResolvedValue([]);
      const query: GetPostsQueryDto = { skip: 0, take: 10, orderBy: 'custom' };

      await service.posts(query);

      expect(prismaMock.post.findMany).toHaveBeenCalled();
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

    it('handles empty content field gracefully', async () => {
      const dto = { title: 'Title Only', authorId: 'author-1', boardId: 'board-1' };
      const created = {
        id: 'post-2',
        title: 'Title Only',
        content: '',
        authorId: 'author-1',
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.create.mockResolvedValue(created);

      const result = await service.createPost(dto);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: {
          title: 'Title Only',
          content: '',
          author: { connect: { id: 'author-1' } },
          board: { connect: { id: 'board-1' } },
        },
      });
      expect(result).toBe('post-2');
    });

    it('connects author and board by id', async () => {
      const dto = {
        title: 'Test',
        content: 'Test content',
        boardId: 'board-x',
        authorId: 'author-y',
      };
      const created = {
        id: 'post-3',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.create.mockResolvedValue(created);

      await service.createPost(dto);

      const callArgs = prismaMock.post.create.mock.calls[0][0];
      expect(callArgs.data.author.connect.id).toBe('author-y');
      expect(callArgs.data.board.connect.id).toBe('board-x');
    });
  });

  describe('updatePost', () => {
    it('updates post with both title and content', async () => {
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

    it('updates only title field', async () => {
      const postId = 'post-2';
      const dto: UpdatePostDto = { title: 'New Title' };
      const updated = {
        id: postId,
        title: 'New Title',
        content: 'Original content',
        authorId: 'author-1',
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.update.mockResolvedValue(updated);

      const result = await service.updatePost(postId, dto);

      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { title: 'New Title' },
      });
      expect(result.title).toBe('New Title');
    });

    it('preserves unmodified fields', async () => {
      const postId = 'post-3';
      const dto: UpdatePostDto = { content: 'Only content updated' };
      const updated = {
        id: postId,
        title: 'Original Title',
        content: 'Only content updated',
        authorId: 'author-1',
        boardId: 'board-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.update.mockResolvedValue(updated);

      const result = await service.updatePost(postId, dto);

      expect(result.title).toBe('Original Title');
      expect(result.content).toBe('Only content updated');
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

    it('calls delete with correct post id', async () => {
      const postId = 'post-to-delete';
      const deleted = {
        id: postId,
        title: 't',
        content: 'c',
        authorId: 'a1',
        boardId: 'b1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        hits: 0,
      };
      prismaMock.post.delete.mockResolvedValue(deleted);

      await service.deletePost(postId);

      const deleteCall = prismaMock.post.delete.mock.calls[0][0];
      expect(deleteCall.where.id).toBe(postId);
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

    it('returns zero counts when post has no ratings', async () => {
      const postId = 'post-no-rates';
      const post = {
        id: postId,
        title: 'New post',
        content: 'content',
        authorId: 'author-1',
        rates: [],
      };
      prismaMock.post.findUnique.mockResolvedValue(post);

      const result = await service.getPostRatings(postId);

      expect(result).toEqual({ likeCount: 0, dislikeCount: 0 });
    });

    it('returns only likes when post has no dislikes', async () => {
      const postId = 'post-liked';
      const post = {
        id: postId,
        title: 'Liked post',
        content: 'content',
        authorId: 'author-1',
        rates: [
          { userId: 'u1', postId, isLike: true, createdAt: new Date() },
          { userId: 'u2', postId, isLike: true, createdAt: new Date() },
        ],
      };
      prismaMock.post.findUnique.mockResolvedValue(post);

      const result = await service.getPostRatings(postId);

      expect(result).toEqual({ likeCount: 2, dislikeCount: 0 });
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
        where: { authorId: { in: ['author-1', 'author-2'] } },
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
        where: { followerId: userId },
        select: { followingId: true },
      });
      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: { authorId: { in: [] } },
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
        where: { authorId: { in: ['author-1'] } },
        orderBy: { createdAt: 'desc' },
        include: commonInclude,
      });
      expect(result).toEqual([]);
    });

    it('transforms posts with correct like and dislike counts', async () => {
      const userId = 'user-3';
      const followings = [{ followingId: 'author-1' }];
      const posts = [
        {
          id: 'post-1',
          title: 'Post with rates',
          content: 'content',
          authorId: 'author-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
          hits: 10,
          boardId: 'board-1',
          rates: [
            { userId: 'u1', isLike: true },
            { userId: 'u2', isLike: true },
            { userId: 'u3', isLike: false },
          ],
          author: { name: 'Author' },
          board: { name: 'Board' },
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
        where: { authorId: { in: ['author-1'] } },
        orderBy: { createdAt: 'desc' },
        include: commonInclude,
      });
      expect(result[0]).toMatchObject({
        id: 'post-1',
        likeCount: 2,
        dislikeCount: 1,
        authorName: 'Author',
        boardName: 'Board',
      });
    });

    it('handles multiple followed users correctly', async () => {
      const userId = 'user-4';
      const followings = [
        { followingId: 'author-1' },
        { followingId: 'author-2' },
        { followingId: 'author-3' },
      ];
      const posts = [
        {
          id: 'post-1',
          title: 'Post 1',
          content: 'c1',
          authorId: 'author-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
          hits: 0,
          boardId: 'b1',
          rates: [],
          author: { name: 'Author 2' },
          board: { name: 'Board 1' },
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
        where: { authorId: { in: ['author-1', 'author-2', 'author-3'] } },
        orderBy: { createdAt: 'desc' },
        include: commonInclude,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'post-1',
        authorName: 'Author 2',
        boardName: 'Board 1',
      });
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
