import { IsString, IsOptional, IsEnum } from 'class-validator';

import { ContentFormat } from './content-format.enum';

export class CreatePostDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  authorId!: string;

  @IsString()
  boardId!: string;

  @IsEnum(ContentFormat)
  @IsOptional()
  contentFormat?: ContentFormat;
}
