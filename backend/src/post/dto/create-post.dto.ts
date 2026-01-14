import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  authorId!: string;
}
