import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPostService = {
    posts: jest.fn(),
    post: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    postsForFeed: jest.fn(),
    saveDraft: jest.fn(),
    publishDraft: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should return an array of posts', async () => {
      const queryDto: GetPostsQueryDto = {};
      const expectedResult: PostResponseDto[] = [
        {
          id: '1',
          title: 'Post 1',
          content: 'Content 1',
          hits: 10,
          authorId: 'user-1',
          authorName: 'User 1',
          boardId: 'board-1',
          boardName: 'Board 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
        },
        {
          id: '2',
          title: 'Post 2',
          content: 'Content 2',
          hits: 5,
          authorId: 'user-2',
          authorName: 'User 2',
          boardId: 'board-1',
          boardName: 'Board 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
        },
      ] as PostResponseDto[];

      mockPostService.posts.mockResolvedValue(expectedResult);

      const result = await controller.getPosts(queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.posts).toHaveBeenCalledWith(queryDto);
      expect(service.posts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPostById', () => {
    it('should return a single post by id', async () => {
      const postId = '1';
      const expectedResult: PostResponseDto = {
        id: postId,
        title: 'Post 1',
        content: 'Content 1',
        hits: 10,
        authorId: 'user-1',
        authorName: 'User 1',
        boardId: 'board-1',
        boardName: 'Board 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
      } as PostResponseDto;

      mockPostService.post.mockResolvedValue(expectedResult);

      const result = await controller.getPostById(postId);

      expect(result).toEqual(expectedResult);
      expect(service.post).toHaveBeenCalledWith(postId);
      expect(service.post).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if post not found', async () => {
      const postId = 'non-existent';

      mockPostService.post.mockRejectedValue(new NotFoundException('Post not found'));

      await expect(controller.getPostById(postId)).rejects.toThrow(NotFoundException);
      expect(service.post).toHaveBeenCalledWith(postId);
    });
  });

  describe('createPost', () => {
    it('should create and return a new post id', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'New Content',
      } as CreatePostDto;
      const expectedResult = 'post-1';

      mockPostService.createPost.mockResolvedValue(expectedResult);

      const result = await controller.createPost(createPostDto, { id: 'user-1' } as any);

      expect(result).toEqual(expectedResult);
      expect(service.createPost).toHaveBeenCalledWith({
        ...createPostDto,
        authorId: 'user-1',
      });
      expect(service.createPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePost', () => {
    it('should update and return the updated post', async () => {
      const postId = '1';
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'Updated Content',
      } as UpdatePostDto;
      const expectedResult: PostResponseDto = {
        id: postId,
        title: 'Updated Post',
        content: 'Updated Content',
        hits: 5,
        authorId: 'user-1',
        authorName: 'Test User',
        boardId: 'board-1',
        boardName: 'Test Board',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
      } as PostResponseDto;

      mockPostService.updatePost.mockResolvedValue(expectedResult);

      const result = await controller.updatePost(postId, updatePostDto);

      expect(result).toEqual(expectedResult);
      expect(service.updatePost).toHaveBeenCalledWith(postId, updatePostDto);
      expect(service.updatePost).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return void', async () => {
      const postId = '1';

      mockPostService.deletePost.mockResolvedValue(undefined);

      const result = await controller.deletePost(postId);

      expect(result).toBeUndefined();
      expect(service.deletePost).toHaveBeenCalledWith(postId);
      expect(service.deletePost).toHaveBeenCalledTimes(1);
    });
  });
  describe('getPostsForFeed', () => {
    it('should return an array of posts for a specific user', async () => {
      const userId = 'user-1';
      const expectedResult: PostResponseDto[] = [
        {
          id: '1',
          title: 'User Post 1',
          content: 'Content 1',
          hits: 15,
          authorId: userId,
          authorName: 'Test User',
          boardId: 'board-1',
          boardName: 'Test Board',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
        },
        {
          id: '2',
          title: 'User Post 2',
          content: 'Content 2',
          hits: 8,
          authorId: userId,
          authorName: 'Test User',
          boardId: 'board-2',
          boardName: 'Another Board',
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
        },
      ] as PostResponseDto[];

      mockPostService.postsForFeed = jest.fn().mockResolvedValue(expectedResult);

      const result = await controller.getPostsForFeed(userId);

      expect(result).toEqual(expectedResult);
      expect(mockPostService.postsForFeed).toHaveBeenCalledWith(userId);
      expect(mockPostService.postsForFeed).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when user has no posts', async () => {
      const userId = 'user-no-posts';

      mockPostService.postsForFeed = jest.fn().mockResolvedValue([]);

      const result = await controller.getPostsForFeed(userId);

      expect(result).toEqual([]);
      expect(mockPostService.postsForFeed).toHaveBeenCalledWith(userId);
      expect(mockPostService.postsForFeed).toHaveBeenCalledTimes(1);
    });

    it('should call postsForFeed service with correct userId parameter', async () => {
      const userId = 'user-123';
      mockPostService.postsForFeed = jest.fn().mockResolvedValue([]);

      await controller.getPostsForFeed(userId);

      expect(mockPostService.postsForFeed).toHaveBeenCalledWith(userId);
    });
  });

  describe('saveDraft', () => {
    it('should save draft post', async () => {
      const postId = 'post-1';
      const updateDto: UpdatePostDto = {
        title: 'Draft Title',
        content: 'Draft Content',
      };
      const expectedResult = {
        id: postId,
        title: 'Draft Title',
        content: 'Draft Content',
        authorId: 'user-1',
        authorName: 'Test User',
        boardId: 'board-1',
        boardName: 'Test Board',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        likes: 0,
        dislikes: 0,
      } as PostResponseDto;

      mockPostService.saveDraft = jest.fn().mockResolvedValue(expectedResult);

      const result = await controller.saveDraft(postId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(mockPostService.saveDraft).toHaveBeenCalledWith(postId, updateDto);
      expect(mockPostService.saveDraft).toHaveBeenCalledTimes(1);
    });
  });

  describe('publishDraft', () => {
    it('should publish draft post', async () => {
      const postId = 'post-1';
      const now = new Date();
      const expectedResult = {
        id: postId,
        title: 'Published Title',
        content: 'Published Content',
        authorId: 'user-1',
        authorName: 'Test User',
        boardId: 'board-1',
        boardName: 'Test Board',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: now,
        likes: 0,
        dislikes: 0,
      } as PostResponseDto;

      mockPostService.publishDraft = jest.fn().mockResolvedValue(expectedResult);

      const result = await controller.publishDraft(postId);

      expect(result).toEqual(expectedResult);
      expect(mockPostService.publishDraft).toHaveBeenCalledWith(postId);
      expect(mockPostService.publishDraft).toHaveBeenCalledTimes(1);
    });
  });
});
