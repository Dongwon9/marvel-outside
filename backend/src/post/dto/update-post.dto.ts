import { Exclude } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @Exclude()
  @IsOptional()
  boardId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @Exclude()
  @IsOptional()
  publishedAt?: string;
}
