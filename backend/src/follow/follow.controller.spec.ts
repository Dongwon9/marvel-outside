import { Test, TestingModule } from '@nestjs/testing';

import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowResponseDto } from './dto/follow-response.dto';
import { GetFollowersQueryDto } from './dto/get-followers-query.dto';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

import { UserResponseDto } from '@/user/dto/user-response.dto';

describe('FollowController', () => {
  let controller: FollowController;
  let service: FollowService;

  const mockFollowService = {
    follow: jest.fn(),
    unfollow: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    getFollowStats: jest.fn(),
    isFollowing: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        {
          provide: FollowService,
          useValue: mockFollowService,
        },
      ],
    }).compile();

    controller = module.get<FollowController>(FollowController);
    service = module.get<FollowService>(FollowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('follow', () => {
    it('should create a follow relationship', async () => {
      const followerId = 'user-1';
      const createFollowDto: CreateFollowDto = {
        followingId: 'user-2',
      };
      const expectedResult: FollowResponseDto = {
        followerId,
        followingId: 'user-2',
        createdAt: new Date(),
      } as FollowResponseDto;

      mockFollowService.follow.mockResolvedValue(expectedResult);

      const result = await controller.follow(followerId, createFollowDto);

      expect(result).toEqual(expectedResult);
      expect(service.follow).toHaveBeenCalledWith(followerId, createFollowDto);
      expect(service.follow).toHaveBeenCalledTimes(1);
    });

    it('should handle follow service errors', async () => {
      const followerId = 'user-1';
      const createFollowDto: CreateFollowDto = {
        followingId: 'user-2',
      };

      mockFollowService.follow.mockRejectedValue(new Error('Follow failed'));

      await expect(controller.follow(followerId, createFollowDto)).rejects.toThrow('Follow failed');
      expect(service.follow).toHaveBeenCalledWith(followerId, createFollowDto);
    });
  });

  describe('unfollow', () => {
    it('should remove a follow relationship', async () => {
      const followerId = 'user-1';
      const followingId = 'user-2';

      mockFollowService.unfollow.mockResolvedValue(undefined);

      const result = await controller.unfollow(followerId, followingId);

      expect(result).toBeUndefined();
      expect(service.unfollow).toHaveBeenCalledWith(followerId, followingId);
      expect(service.unfollow).toHaveBeenCalledTimes(1);
    });

    it('should handle unfollow service errors', async () => {
      const followerId = 'user-1';
      const followingId = 'user-2';

      mockFollowService.unfollow.mockRejectedValue(new Error('Unfollow failed'));

      await expect(controller.unfollow(followerId, followingId)).rejects.toThrow('Unfollow failed');
      expect(service.unfollow).toHaveBeenCalledWith(followerId, followingId);
    });
  });

  describe('getFollowers', () => {
    it('should return a list of followers', async () => {
      const userId = 'user-1';
      const queryDto: GetFollowersQueryDto = {
        skip: 0,
        take: 10,
      };
      const expectedResult = [
        {
          createdAt: new Date(),
          user: {
            id: 'follower-1',
            name: 'Follower 1',
            email: 'follower1@example.com',
          } as UserResponseDto,
        },
        {
          createdAt: new Date(),
          user: {
            id: 'follower-2',
            name: 'Follower 2',
            email: 'follower2@example.com',
          } as UserResponseDto,
        },
      ];

      mockFollowService.getFollowers.mockResolvedValue(expectedResult);

      const result = await controller.getFollowers(userId, queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowers).toHaveBeenCalledWith(userId, queryDto);
      expect(service.getFollowers).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no followers', async () => {
      const userId = 'user-1';
      const queryDto: GetFollowersQueryDto = {
        skip: 0,
        take: 10,
      };

      mockFollowService.getFollowers.mockResolvedValue([]);

      const result = await controller.getFollowers(userId, queryDto);

      expect(result).toEqual([]);
      expect(service.getFollowers).toHaveBeenCalledWith(userId, queryDto);
    });

    it('should handle pagination parameters', async () => {
      const userId = 'user-1';
      const queryDto: GetFollowersQueryDto = {
        skip: 20,
        take: 5,
      };
      const expectedResult = [
        {
          createdAt: new Date(),
          user: {
            id: 'follower-21',
            name: 'Follower 21',
          } as UserResponseDto,
        },
      ];

      mockFollowService.getFollowers.mockResolvedValue(expectedResult);

      const result = await controller.getFollowers(userId, queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowers).toHaveBeenCalledWith(userId, queryDto);
    });
  });

  describe('getFollowing', () => {
    it('should return a list of following users', async () => {
      const userId = 'user-1';
      const queryDto: GetFollowersQueryDto = {
        skip: 0,
        take: 10,
      };
      const expectedResult = [
        {
          createdAt: new Date(),
          user: {
            id: 'following-1',
            name: 'Following 1',
            email: 'following1@example.com',
          } as UserResponseDto,
        },
        {
          createdAt: new Date(),
          user: {
            id: 'following-2',
            name: 'Following 2',
            email: 'following2@example.com',
          } as UserResponseDto,
        },
      ];

      mockFollowService.getFollowing.mockResolvedValue(expectedResult);

      const result = await controller.getFollowing(userId, queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowing).toHaveBeenCalledWith(userId, queryDto);
      expect(service.getFollowing).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user is not following anyone', async () => {
      const userId = 'user-1';
      const queryDto: GetFollowersQueryDto = {
        skip: 0,
        take: 10,
      };

      mockFollowService.getFollowing.mockResolvedValue([]);

      const result = await controller.getFollowing(userId, queryDto);

      expect(result).toEqual([]);
      expect(service.getFollowing).toHaveBeenCalledWith(userId, queryDto);
    });

    it('should handle pagination parameters', async () => {
      const userId = 'user-1';
      const queryDto: GetFollowersQueryDto = {
        skip: 10,
        take: 15,
      };
      const expectedResult = [
        {
          createdAt: new Date(),
          user: {
            id: 'following-11',
            name: 'Following 11',
          } as UserResponseDto,
        },
      ];

      mockFollowService.getFollowing.mockResolvedValue(expectedResult);

      const result = await controller.getFollowing(userId, queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowing).toHaveBeenCalledWith(userId, queryDto);
    });
  });

  describe('getFollowStats', () => {
    it('should return follow statistics', async () => {
      const userId = 'user-1';
      const expectedResult = {
        followersCount: 10,
        followingCount: 5,
      };

      mockFollowService.getFollowStats.mockResolvedValue(expectedResult);

      const result = await controller.getFollowStats(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowStats).toHaveBeenCalledWith(userId);
      expect(service.getFollowStats).toHaveBeenCalledTimes(1);
    });

    it('should return zero counts for new user', async () => {
      const userId = 'new-user';
      const expectedResult = {
        followersCount: 0,
        followingCount: 0,
      };

      mockFollowService.getFollowStats.mockResolvedValue(expectedResult);

      const result = await controller.getFollowStats(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowStats).toHaveBeenCalledWith(userId);
    });

    it('should handle large follower counts', async () => {
      const userId = 'popular-user';
      const expectedResult = {
        followersCount: 1000000,
        followingCount: 100,
      };

      mockFollowService.getFollowStats.mockResolvedValue(expectedResult);

      const result = await controller.getFollowStats(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getFollowStats).toHaveBeenCalledWith(userId);
    });
  });

  describe('isFollowing', () => {
    it('should return true when user is following another user', async () => {
      const followerId = 'user-1';
      const followingId = 'user-2';

      mockFollowService.isFollowing.mockResolvedValue(true);

      const result = await controller.isFollowing(followerId, followingId);

      expect(result).toEqual({ isFollowing: true });
      expect(service.isFollowing).toHaveBeenCalledWith(followerId, followingId);
      expect(service.isFollowing).toHaveBeenCalledTimes(1);
    });

    it('should return false when user is not following another user', async () => {
      const followerId = 'user-1';
      const followingId = 'user-3';

      mockFollowService.isFollowing.mockResolvedValue(false);

      const result = await controller.isFollowing(followerId, followingId);

      expect(result).toEqual({ isFollowing: false });
      expect(service.isFollowing).toHaveBeenCalledWith(followerId, followingId);
      expect(service.isFollowing).toHaveBeenCalledTimes(1);
    });

    it('should check if user is following themselves', async () => {
      const userId = 'user-1';

      mockFollowService.isFollowing.mockResolvedValue(false);

      const result = await controller.isFollowing(userId, userId);

      expect(result).toEqual({ isFollowing: false });
      expect(service.isFollowing).toHaveBeenCalledWith(userId, userId);
    });

    it('should handle service errors', async () => {
      const followerId = 'user-1';
      const followingId = 'user-2';

      mockFollowService.isFollowing.mockRejectedValue(new Error('Database error'));

      await expect(controller.isFollowing(followerId, followingId)).rejects.toThrow(
        'Database error',
      );
      expect(service.isFollowing).toHaveBeenCalledWith(followerId, followingId);
    });
  });
});
