import { Exclude } from 'class-transformer';
import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class UpdatePostDto {
  @Exclude()
  boardId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsISO8601()
  @IsOptional()
  publishedAt?: string;
}
