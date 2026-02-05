import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

class AuthorDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CommentResponseDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @IsString()
  @IsNotEmpty()
  postId!: string;

  @IsNotEmpty()
  author!: AuthorDto;
}
