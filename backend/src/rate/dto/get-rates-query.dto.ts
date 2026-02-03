import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { CreateRateDto } from './create-rate.dto';

export class GetRatesQueryDto extends PartialType(CreateRateDto) {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}
