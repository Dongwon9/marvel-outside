import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetBoardsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  take?: number;
}
