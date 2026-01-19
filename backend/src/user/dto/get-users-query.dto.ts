import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class GetUsersQueryDto {
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
  @IsIn(['id', 'email', 'name', 'registeredAt'])
  orderBy?: string; // 'id' | 'email' | 'name' | 'registeredAt'
}
