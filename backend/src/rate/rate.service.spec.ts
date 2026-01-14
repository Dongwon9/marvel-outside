import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateResponseDto } from './dto/rate-response.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';

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

    it('should transform Prisma response to RateResponseDto instance', async () => {
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

      expect(result).toBeInstanceOf(RateResponseDto);
      expect(Object.keys(result).sort()).toEqual(
        ['userId', 'postId', 'isLike'].sort(),
      );
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

      jest
        .spyOn(prisma.rate, 'findUnique')
        .mockResolvedValueOnce(mockRate as any);

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

      await expect(service.findOne(userId, postId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(userId, postId)).rejects.toThrow(
        'Rate not found',
      );
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

      jest
        .spyOn(prisma.rate, 'findUnique')
        .mockResolvedValueOnce(mockRate as any);

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

      jest
        .spyOn(prisma.rate, 'findUnique')
        .mockResolvedValueOnce(mockRate as any);

      const result = await service.findOne(userId, postId);

      expect(result.createdAt).toBeUndefined();
    });
  });
});
