import { Test, TestingModule } from '@nestjs/testing';

import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { RateResponseDto } from './dto/rate-response.dto';
import { CreateRateDto } from './dto/create-rate.dto';
import { GetRatesQueryDto } from './dto/get-rates-query.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

describe('RateController', () => {
  let controller: RateController;
  let mockRateService: jest.Mocked<RateService>;

  beforeEach(async () => {
    mockRateService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<RateService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [{ provide: RateService, useValue: mockRateService }],
    }).compile();

    controller = module.get<RateController>(RateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a rate and return RateResponseDto', async () => {
      const createRateDto: CreateRateDto = {
        userId: 'user-123',
        postId: 'post-456',
        isLike: true,
      };
      const rateResponseDto: RateResponseDto = {
        userId: 'user-123',
        postId: 'post-456',
        isLike: true,
      };

      mockRateService.create.mockResolvedValue(rateResponseDto);

      const result = await controller.create(createRateDto);

      expect(result).toEqual(rateResponseDto);
      expect(mockRateService.create).toHaveBeenCalledWith(createRateDto);
    });

    it('should pass CreateRateDto to service.create', async () => {
      const createRateDto: CreateRateDto = {
        userId: 'user-789',
        postId: 'post-999',
        isLike: false,
      };

      mockRateService.create.mockResolvedValue({} as RateResponseDto);

      await controller.create(createRateDto);

      expect(mockRateService.create).toHaveBeenCalledWith(createRateDto);
      expect(mockRateService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return array of RateResponseDto', async () => {
      const queryDto: GetRatesQueryDto = { skip: 0, take: 10 };
      const rateResponseDtos: RateResponseDto[] = [
        { userId: 'user-1', postId: 'post-1', isLike: true },
        { userId: 'user-2', postId: 'post-2', isLike: false },
      ];

      mockRateService.findAll.mockResolvedValue(rateResponseDtos);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(rateResponseDtos);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no rates found', async () => {
      const queryDto: GetRatesQueryDto = { skip: 0, take: 10 };

      mockRateService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should pass query parameters to service.findAll', async () => {
      const queryDto: GetRatesQueryDto = { skip: 5, take: 20 };

      mockRateService.findAll.mockResolvedValue([]);

      await controller.findAll(queryDto);

      expect(mockRateService.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findOne', () => {
    it('should return RateResponseDto when rate found', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const rateResponseDto: RateResponseDto = {
        userId,
        postId,
        isLike: true,
      };

      mockRateService.findOne.mockResolvedValue(rateResponseDto);

      const result = await controller.findOne(userId, postId);

      expect(result).toEqual(rateResponseDto);
      expect(result.userId).toBe(userId);
      expect(result.postId).toBe(postId);
    });

    it('should pass userId and postId to service.findOne', async () => {
      const userId = 'user-abc';
      const postId = 'post-xyz';

      mockRateService.findOne.mockResolvedValue({} as RateResponseDto);

      await controller.findOne(userId, postId);

      expect(mockRateService.findOne).toHaveBeenCalledWith(userId, postId);
    });

    it('should throw error when rate not found', async () => {
      const userId = 'user-999';
      const postId = 'post-999';

      mockRateService.findOne.mockRejectedValue(new Error('Rate not found'));

      await expect(controller.findOne(userId, postId)).rejects.toThrow('Rate not found');
    });
  });

  describe('update', () => {
    it('should update rate and return updated RateResponseDto', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const updateRateDto: UpdateRateDto = { isLike: false };
      const rateResponseDto: RateResponseDto = {
        userId,
        postId,
        isLike: false,
      };

      mockRateService.update.mockResolvedValue(rateResponseDto);

      const result = await controller.update(userId, postId, updateRateDto);

      expect(result).toEqual(rateResponseDto);
      expect(result.isLike).toBe(false);
    });

    it('should pass userId, postId, and UpdateRateDto to service.update', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const updateRateDto: UpdateRateDto = { isLike: true };

      mockRateService.update.mockResolvedValue({} as RateResponseDto);

      await controller.update(userId, postId, updateRateDto);

      expect(mockRateService.update).toHaveBeenCalledWith(userId, postId, updateRateDto);
    });
  });

  describe('remove', () => {
    it('should delete rate and return deleted RateResponseDto', async () => {
      const userId = 'user-123';
      const postId = 'post-456';
      const rateResponseDto: RateResponseDto = {
        userId,
        postId,
        isLike: true,
      };

      mockRateService.remove.mockResolvedValue(rateResponseDto);

      const result = await controller.remove(userId, postId);

      expect(result).toEqual(rateResponseDto);
      expect(result.userId).toBe(userId);
      expect(result.postId).toBe(postId);
    });

    it('should pass userId and postId to service.remove', async () => {
      const userId = 'user-123';
      const postId = 'post-456';

      mockRateService.remove.mockResolvedValue({} as RateResponseDto);

      await controller.remove(userId, postId);

      expect(mockRateService.remove).toHaveBeenCalledWith(userId, postId);
    });

    it('should throw error when rate deletion fails', async () => {
      const userId = 'user-999';
      const postId = 'post-999';

      mockRateService.remove.mockRejectedValue(new Error('Rate not found'));

      await expect(controller.remove(userId, postId)).rejects.toThrow('Rate not found');
    });
  });
});
