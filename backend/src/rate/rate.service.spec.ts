import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateRateDto } from './dto/create-rate.dto';
import { GetRatesQueryDto } from './dto/get-rates-query.dto';
import { RateResponseDto } from './dto/rate-response.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RateService } from './rate.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RateService', () => {
  let service: RateService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: PrismaService,
          useValue: {
            rate: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RateService>(RateService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rate and return RateResponseDto', async () => {
      const createRateDto: CreateRateDto = {
        userId: 'user-123',
        postId: 'post-456',
        isLike: true,
      };
      const mockRate = {
        userId: 'user-123',
        postId: 'post-456',
        isLike: true,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'create').mockResolvedValueOnce(mockRate as any);

      const result = await service.create(createRateDto);

      expect(prisma.rate.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          postId: 'post-456',
          isLike: true,
        },
      });
      expect(result).toBeInstanceOf(RateResponseDto);
      expect(result.userId).toBe('user-123');
      expect(result.postId).toBe('post-456');
      expect(result.isLike).toBe(true);
    });

    it('should create a rate with isLike=false', async () => {
      const createRateDto: CreateRateDto = {
        userId: 'user-789',
        postId: 'post-999',
        isLike: false,
      };
      const mockRate = {
        userId: 'user-789',
        postId: 'post-999',
        isLike: false,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'create').mockResolvedValueOnce(mockRate as any);

      const result = await service.create(createRateDto);

      expect(prisma.rate.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-789',
          postId: 'post-999',
          isLike: false,
        },
      });
      expect(result.isLike).toBe(false);
    });

    it('should exclude createdAt field in response', async () => {
      const createRateDto: CreateRateDto = {
        userId: 'user-123',
        postId: 'post-456',
        isLike: true,
      };
      const createdDate = new Date('2024-01-20');
      const mockRate = {
        userId: 'user-123',
        postId: 'post-456',
        isLike: true,
        createdAt: createdDate,
      };

      jest.spyOn(prisma.rate, 'create').mockResolvedValueOnce(mockRate as any);

      const result = await service.create(createRateDto);

      expect(result.createdAt).toBeUndefined();
    });

    it('should pass exact DTO values to Prisma create method', async () => {
      const createRateDto: CreateRateDto = {
        userId: 'specific-user-id',
        postId: 'specific-post-id',
        isLike: true,
      };
      const mockRate = {
        userId: 'specific-user-id',
        postId: 'specific-post-id',
        isLike: true,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'create').mockResolvedValueOnce(mockRate as any);

      await service.create(createRateDto);

      expect(prisma.rate.create).toHaveBeenCalledWith({
        data: {
          userId: 'specific-user-id',
          postId: 'specific-post-id',
          isLike: true,
        },
      });
      expect(prisma.rate.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return RateResponseDto when rate exists', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const mockRate = {
        userId,
        postId,
        isLike: true,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'findUnique').mockResolvedValueOnce(mockRate as any);

      const result = await service.findOne(userId, postId);

      expect(prisma.rate.findUnique).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      expect(result).toBeInstanceOf(RateResponseDto);
      expect(result.userId).toBe(userId);
      expect(result.postId).toBe(postId);
      expect(result.isLike).toBe(true);
    });

    it('should throw NotFoundException when rate does not exist', async () => {
      const userId = 'user-123';
      const postId = 'post-456';

      jest.spyOn(prisma.rate, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findOne(userId, postId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId, postId)).rejects.toThrow('Rate not found');
    });

    it('should query with correct composite key structure', async () => {
      const userId = 'user-abc';
      const postId = 'post-xyz';
      const mockRate = {
        userId,
        postId,
        isLike: false,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'findUnique').mockResolvedValueOnce(mockRate as any);

      await service.findOne(userId, postId);

      expect(prisma.rate.findUnique).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 'user-abc',
            postId: 'post-xyz',
          },
        },
      });
    });

    it('should exclude createdAt field in response via @Exclude decorator', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const createdDate = new Date('2024-01-15');
      const mockRate = {
        userId,
        postId,
        isLike: true,
        createdAt: createdDate,
      };

      jest.spyOn(prisma.rate, 'findUnique').mockResolvedValueOnce(mockRate as any);

      const result = await service.findOne(userId, postId);

      expect(result.createdAt).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return array of RateResponseDto', async () => {
      const queryDto: GetRatesQueryDto = { skip: 0, take: 10 };
      const mockRates = [
        {
          userId: 'user-123',
          postId: 'post-456',
          isLike: true,
          createdAt: new Date(),
        },
        {
          userId: 'user-789',
          postId: 'post-999',
          isLike: false,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.rate, 'findMany').mockResolvedValueOnce(mockRates as any);

      const result = await service.findAll(queryDto);

      expect(prisma.rate.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(RateResponseDto);
      expect(result[1]).toBeInstanceOf(RateResponseDto);
      expect(result[0].userId).toBe('user-123');
      expect(result[1].userId).toBe('user-789');
    });

    it('should return empty array when no rates found', async () => {
      const queryDto: GetRatesQueryDto = { skip: 0, take: 10 };

      jest.spyOn(prisma.rate, 'findMany').mockResolvedValueOnce([]);

      const result = await service.findAll(queryDto);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should pass skip and take parameters to Prisma', async () => {
      const queryDto: GetRatesQueryDto = { skip: 5, take: 20 };
      jest.spyOn(prisma.rate, 'findMany').mockResolvedValueOnce([]);

      await service.findAll(queryDto);

      expect(prisma.rate.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 20,
      });
    });

    it('should transform all Prisma responses to RateResponseDto instances', async () => {
      const queryDto: GetRatesQueryDto = { skip: 0, take: 10 };
      const mockRates = [
        {
          userId: 'user-1',
          postId: 'post-1',
          isLike: true,
          createdAt: new Date(),
        },
        {
          userId: 'user-2',
          postId: 'post-2',
          isLike: false,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.rate, 'findMany').mockResolvedValueOnce(mockRates as any);

      const result = await service.findAll(queryDto);

      result.forEach(rate => {
        expect(rate).toBeInstanceOf(RateResponseDto);
        expect(rate.createdAt).toBeUndefined();
      });
    });

    it('should exclude createdAt field from all responses', async () => {
      const queryDto: GetRatesQueryDto = { skip: 0, take: 10 };
      const mockRates = [
        {
          userId: 'user-123',
          postId: 'post-456',
          isLike: true,
          createdAt: new Date('2024-01-20'),
        },
      ];

      jest.spyOn(prisma.rate, 'findMany').mockResolvedValueOnce(mockRates as any);

      const result = await service.findAll(queryDto);

      expect(result[0].createdAt).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update rate and return updated RateResponseDto', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const updateRateDto: UpdateRateDto = { isLike: false };
      const mockUpdatedRate = {
        userId,
        postId,
        isLike: false,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'update').mockResolvedValueOnce(mockUpdatedRate as any);

      const result = await service.update(userId, postId, updateRateDto);

      expect(prisma.rate.update).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: updateRateDto,
      });
      expect(result).toBeInstanceOf(RateResponseDto);
      expect(result.isLike).toBe(false);
    });

    it('should update with correct composite key structure', async () => {
      const userId = 'user-abc';
      const postId = 'post-xyz';
      const updateRateDto: UpdateRateDto = { isLike: true };
      const mockUpdatedRate = {
        userId,
        postId,
        isLike: true,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'update').mockResolvedValueOnce(mockUpdatedRate as any);

      await service.update(userId, postId, updateRateDto);

      expect(prisma.rate.update).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 'user-abc',
            postId: 'post-xyz',
          },
        },
        data: updateRateDto,
      });
    });

    it('should exclude createdAt field in response', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const updateRateDto: UpdateRateDto = { isLike: true };
      const createdDate = new Date('2024-01-15');
      const mockUpdatedRate = {
        userId,
        postId,
        isLike: true,
        createdAt: createdDate,
      };

      jest.spyOn(prisma.rate, 'update').mockResolvedValueOnce(mockUpdatedRate as any);

      const result = await service.update(userId, postId, updateRateDto);

      expect(result.createdAt).toBeUndefined();
    });

    it('should pass exact update data to Prisma', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const updateRateDto: UpdateRateDto = { isLike: false };
      const mockUpdatedRate = {
        userId,
        postId,
        isLike: false,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'update').mockResolvedValueOnce(mockUpdatedRate as any);

      await service.update(userId, postId, updateRateDto);

      expect(prisma.rate.update).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: {
          isLike: false,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete rate and return deleted RateResponseDto', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const mockDeletedRate = {
        userId,
        postId,
        isLike: true,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'delete').mockResolvedValueOnce(mockDeletedRate as any);

      const result = await service.remove(userId, postId);

      expect(prisma.rate.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      expect(result).toBeInstanceOf(RateResponseDto);
      expect(result.userId).toBe(userId);
      expect(result.postId).toBe(postId);
    });

    it('should use correct composite key structure for deletion', async () => {
      const userId = 'user-xyz';
      const postId = 'post-abc';
      const mockDeletedRate = {
        userId,
        postId,
        isLike: false,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.rate, 'delete').mockResolvedValueOnce(mockDeletedRate as any);

      await service.remove(userId, postId);

      expect(prisma.rate.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 'user-xyz',
            postId: 'post-abc',
          },
        },
      });
    });

    it('should exclude createdAt field in response', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const createdDate = new Date('2024-01-10');
      const mockDeletedRate = {
        userId,
        postId,
        isLike: true,
        createdAt: createdDate,
      };

      jest.spyOn(prisma.rate, 'delete').mockResolvedValueOnce(mockDeletedRate as any);

      const result = await service.remove(userId, postId);

      expect(result.createdAt).toBeUndefined();
    });

    it('should handle deletion errors from Prisma', async () => {
      const userId = 'user-123';
      const postId = 'post-456';

      jest.spyOn(prisma.rate, 'delete').mockRejectedValueOnce(new Error('Rate not found'));

      await expect(service.remove(userId, postId)).rejects.toThrow('Rate not found');
    });
  });
});
