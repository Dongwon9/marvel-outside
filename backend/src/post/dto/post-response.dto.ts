import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';

export class PostResponseDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  hits!: number;

  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @IsString()
  @IsNotEmpty()
  boardId!: string;

  @IsString()
  @IsNotEmpty()
  boardName!: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  createdAt!: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  updatedAt!: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  publishedAt!: Date | null;

  @IsNumber()
  @IsNotEmpty()
  likes!: number;

  @IsNumber()
  @IsNotEmpty()
  dislikes!: number;

  constructor(partial: Partial<PostResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
