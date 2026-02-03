import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { GetRatesQueryDto } from './dto/get-rates-query.dto';
import { RateResponseDto } from './dto/rate-response.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RateService } from './rate.service';
import { Public } from '@/auth/decorators/public.decorator';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  async create(@Body() createRateDto: CreateRateDto): Promise<RateResponseDto> {
    return this.rateService.create(createRateDto);
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
  ): Promise<RateResponseDto> {
    return this.rateService.update(userId, postId, updateRateDto);
  }

  @Delete(':userId/:postId')
  async remove(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<RateResponseDto> {
    return this.rateService.remove(userId, postId);
  }
}
