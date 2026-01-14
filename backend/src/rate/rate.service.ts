import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { GetRatesQueryDto } from './dto/get-rates-query.dto';
import { RateResponseDto } from './dto/rate-response.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRateDto: CreateRateDto): Promise<RateResponseDto> {
    const { userId, postId, isLike } = createRateDto;
    const rate = await this.prisma.rate.create({
      data: {
        userId,
        postId,
        isLike,
      },
    });
    return plainToInstance(RateResponseDto, rate);
  }

  async findAll(queryDto: GetRatesQueryDto): Promise<RateResponseDto[]> {
    const { skip, take } = queryDto;
    const rates = await this.prisma.rate.findMany({
      skip,
      take,
    });
    return plainToInstance(RateResponseDto, rates);
  }

  async findOne(userId: string, postId: string): Promise<RateResponseDto> {
    const rate = await this.prisma.rate.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!rate) {
      throw new NotFoundException('Rate not found');
    }

    return plainToInstance(RateResponseDto, rate);
  }

  async update(
    userId: string,
    postId: string,
    updateRateDto: UpdateRateDto,
  ): Promise<RateResponseDto> {
    const rate = await this.prisma.rate.update({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      data: updateRateDto,
    });
    return plainToInstance(RateResponseDto, rate);
  }

  async remove(userId: string, postId: string): Promise<RateResponseDto> {
    const rate = await this.prisma.rate.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return plainToInstance(RateResponseDto, rate);
  }
}
