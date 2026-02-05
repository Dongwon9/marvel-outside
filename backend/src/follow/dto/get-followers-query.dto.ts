import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateNested } from 'class-validator';

import { OrderByDto } from './order-by.dto';

export class GetFollowersQueryDto {
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

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderByDto)
  orderBy?: OrderByDto;
}
