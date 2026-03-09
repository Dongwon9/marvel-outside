import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import type { User } from '@/generated/prisma/client';

import { CreateRateDto } from './dto/create-rate.dto';
import { GetRatesQueryDto } from './dto/get-rates-query.dto';
import { RateResponseDto } from './dto/rate-response.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RateService } from './rate.service';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  async create(
    @Body() createRateDto: CreateRateDto,
    @CurrentUser() user: User,
  ): Promise<RateResponseDto> {
    return this.rateService.create(user.id, createRateDto);
  }

  @Get()
  @Public()
  async findAll(@Query() queryDto: GetRatesQueryDto): Promise<RateResponseDto[]> {
    return this.rateService.findAll(queryDto);
  }

  @Get(':userId/:postId')
  @Public()
  async findOne(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<RateResponseDto> {
    return this.rateService.findOne(userId, postId);
  }

  @Patch(':userId/:postId')
  async update(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() updateRateDto: UpdateRateDto,
    @CurrentUser() user: User,
  ): Promise<RateResponseDto> {
    if (user.id !== userId) {
      throw new ForbiddenException('You can only update your own rate');
    }
    return this.rateService.update(user.id, postId, updateRateDto);
  }

  @Delete(':userId/:postId')
  async remove(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @CurrentUser() user: User,
  ): Promise<RateResponseDto> {
    if (user.id !== userId) {
      throw new ForbiddenException('You can only remove your own rate');
    }
    return this.rateService.remove(user.id, postId);
  }
}
