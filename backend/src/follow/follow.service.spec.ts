import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FollowService } from './follow.service';

describe('FollowService', () => {
  let service: FollowService;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
    };
    follow: {
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    follow: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('follow', () => {
    it('should successfully follow a user', async () => {
      const followerId = 'follower-1';
      const followingId = 'user-1';
      const createFollowDto = { followingId };

      prismaService.user.findUnique.mockResolvedValue({
        id: followingId,
        deletedAt: null,
      } as any);
      prismaService.follow.findUnique.mockResolvedValue(null);
      prismaService.follow.create.mockResolvedValue({
        followerId,
        followingId,
        createdAt: new Date(),
      } as any);

      const result = await service.follow(followerId, createFollowDto as any);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: followingId, deletedAt: null },
      });
      expect(prismaService.follow.findUnique).toHaveBeenCalledWith({
        where: { followerId_followingId: { followerId, followingId } },
      });
      expect(prismaService.follow.create).toHaveBeenCalledWith({
        data: { followerId, followingId },
      });
    });

    it('should throw BadRequestException when following self', async () => {
      const userId = 'user-1';
      const createFollowDto = { followingId: userId };

      await expect(service.follow(userId, createFollowDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when target user does not exist', async () => {
      const followerId = 'follower-1';
      const followingId = 'nonexistent-user';
      const createFollowDto = { followingId };

      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.follow(followerId, createFollowDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when already following', async () => {
      const followerId = 'follower-1';
      const followingId = 'user-1';
      const createFollowDto = { followingId };

      prismaService.user.findUnique.mockResolvedValue({
        id: followingId,
        deletedAt: null,
      } as any);
      prismaService.follow.findUnique.mockResolvedValue({
        followerId,
        followingId,
      } as any);

      await expect(service.follow(followerId, createFollowDto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('unfollow', () => {
    it('should successfully unfollow a user', async () => {
      const followerId = 'follower-1';
      const followingId = 'user-1';

      prismaService.follow.findUnique.mockResolvedValue({
        followerId,
        followingId,
      } as any);
      prismaService.follow.delete.mockResolvedValue({} as any);

      await service.unfollow(followerId, followingId);

      expect(prismaService.follow.delete).toHaveBeenCalledWith({
        where: { followerId_followingId: { followerId, followingId } },
      });
    });

    it('should throw NotFoundException when follow relationship does not exist', async () => {
      prismaService.follow.findUnique.mockResolvedValue(null);

      await expect(service.unfollow('follower-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFollowers', () => {
    it('should return followers list', async () => {
      const userId = 'user-1';
      const query = { skip: 0, take: 10, orderBy: null };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          follower: { id: 'follower-1', name: 'User 1' },
        },
      ] as any);

      const result = await service.getFollowers(userId, query as any);

      expect(result).toHaveLength(1);
      expect(prismaService.follow.findMany).toHaveBeenCalled();
    });
  });

  describe('getFollowing', () => {
    it('should return following list', async () => {
      const userId = 'user-1';
      const query = { skip: 0, take: 10, orderBy: null };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          following: { id: 'user-2', name: 'User 2' },
        },
      ] as any);

      const result = await service.getFollowing(userId, query as any);

      expect(result).toHaveLength(1);
    });
  });

  describe('getFollowStats', () => {
    it('should return followers and following count', async () => {
      const userId = 'user-1';

      prismaService.follow.count.mockResolvedValueOnce(5).mockResolvedValueOnce(10);

      const result = await service.getFollowStats(userId);

      expect(result).toEqual({ followersCount: 5, followingCount: 10 });
    });
  });

  describe('isFollowing', () => {
    it('should return true when following exists', async () => {
      prismaService.follow.findUnique.mockResolvedValue({ followerId: 'follower-1' } as any);

      const result = await service.isFollowing('follower-1', 'user-1');

      expect(result).toBe(true);
    });

    it('should return false when following does not exist', async () => {
      prismaService.follow.findUnique.mockResolvedValue(null);

      const result = await service.isFollowing('follower-1', 'user-1');

      expect(result).toBe(false);
    });
  });
  describe('getFollowers - orderBy scenarios', () => {
    it('should order followers by createdAt ascending', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'createdAt', direction: 'asc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date('2024-01-01'),
          follower: { id: 'follower-1', name: 'User 1' },
        },
      ] as any);

      const result = await service.getFollowers(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followingId: userId },
        include: { follower: true },
        omit: { followerId: true, followingId: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should order followers by name descending', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'name', direction: 'desc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          follower: { id: 'follower-1', name: 'User 1' },
        },
      ] as any);

      const result = await service.getFollowers(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followingId: userId },
        include: { follower: true },
        omit: { followerId: true, followingId: true },
        skip: 0,
        take: 10,
        orderBy: { follower: { name: 'desc' } },
      });
      expect(result).toHaveLength(1);
    });

    it('should order followers by lastLoginAt ascending', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'lastLoginAt', direction: 'asc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          follower: { id: 'follower-1', name: 'User 1', lastLoginAt: new Date() },
        },
      ] as any);

      const result = await service.getFollowers(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followingId: userId },
        include: { follower: true },
        omit: { followerId: true, followingId: true },
        skip: 0,
        take: 10,
        orderBy: { follower: { lastLoginAt: 'asc' } },
      });
      expect(result).toHaveLength(1);
    });

    it('should use default orderBy when field is invalid', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'invalidField', direction: 'asc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          follower: { id: 'follower-1', name: 'User 1' },
        },
      ] as any);

      const result = await service.getFollowers(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followingId: userId },
        include: { follower: true },
        omit: { followerId: true, followingId: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should handle empty followers list', async () => {
      const userId = 'user-1';
      const query = { skip: 0, take: 10, orderBy: null };

      prismaService.follow.findMany.mockResolvedValue([]);

      const result = await service.getFollowers(userId, query as any);

      expect(result).toHaveLength(0);
    });
  });

  describe('getFollowing - orderBy scenarios', () => {
    it('should order following by createdAt descending', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'createdAt', direction: 'desc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date('2024-01-01'),
          following: { id: 'user-2', name: 'User 2' },
        },
      ] as any);

      const result = await service.getFollowing(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        omit: { followerId: true, followingId: true },
        include: { following: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should order following by name ascending', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'name', direction: 'asc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          following: { id: 'user-2', name: 'User 2' },
        },
      ] as any);

      const result = await service.getFollowing(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        omit: { followerId: true, followingId: true },
        include: { following: true },
        skip: 0,
        take: 10,
        orderBy: { following: { name: 'asc' } },
      });
      expect(result).toHaveLength(1);
    });

    it('should order following by lastLoginAt descending', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'lastLoginAt', direction: 'desc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          following: { id: 'user-2', name: 'User 2', lastLoginAt: new Date() },
        },
      ] as any);

      const result = await service.getFollowing(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        omit: { followerId: true, followingId: true },
        include: { following: true },
        skip: 0,
        take: 10,
        orderBy: { following: { lastLoginAt: 'desc' } },
      });
      expect(result).toHaveLength(1);
    });

    it('should use default orderBy when field is invalid', async () => {
      const userId = 'user-1';
      const query = {
        skip: 0,
        take: 10,
        orderBy: { field: 'unknownField', direction: 'asc' },
      };

      prismaService.follow.findMany.mockResolvedValue([
        {
          createdAt: new Date(),
          following: { id: 'user-2', name: 'User 2' },
        },
      ] as any);

      const result = await service.getFollowing(userId, query as any);

      expect(prismaService.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userId },
        omit: { followerId: true, followingId: true },
        include: { following: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });

    it('should handle empty following list', async () => {
      const userId = 'user-1';
      const query = { skip: 0, take: 10, orderBy: null };

      prismaService.follow.findMany.mockResolvedValue([]);

      const result = await service.getFollowing(userId, query as any);

      expect(result).toHaveLength(0);
    });
  });

  describe('getFollowStats - edge cases', () => {
    it('should return zero counts when user has no followers or following', async () => {
      const userId = 'user-1';

      prismaService.follow.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const result = await service.getFollowStats(userId);

      expect(result).toEqual({ followersCount: 0, followingCount: 0 });
      expect(prismaService.follow.count).toHaveBeenCalledTimes(2);
      expect(prismaService.follow.count).toHaveBeenNthCalledWith(1, {
        where: { followingId: userId },
      });
      expect(prismaService.follow.count).toHaveBeenNthCalledWith(2, {
        where: { followerId: userId },
      });
    });
  });
});
