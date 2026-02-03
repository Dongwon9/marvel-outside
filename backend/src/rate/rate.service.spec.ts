import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { GetRatesQueryDto } from './dto/get-rates-query.dto';
import { RateResponseDto } from './dto/rate-response.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RateService } from './rate.service';

describe('RateService', () => {
  let service: RateService;
  let prisma: jest.Mocked<PrismaService>;

  const commonWhere = {
    isLike: undefined,
    postId: undefined,
    userId: undefined,
  };

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
      expect(result.createdAt).toBeUndefined();
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
      expect(result.createdAt).toBeUndefined();
    });

    it('should throw NotFoundException when rate does not exist', async () => {
      const userId = 'user-123';
      const postId = 'post-456';

      jest.spyOn(prisma.rate, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findOne(userId, postId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId, postId)).rejects.toThrow('Rate not found');
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
        where: commonWhere,
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
      expect(result.createdAt).toBeUndefined();
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
      expect(result.createdAt).toBeUndefined();
    });
  });
});
