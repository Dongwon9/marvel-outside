import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRateDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  postId!: string;

  @IsBoolean()
  @IsNotEmpty()
  isLike!: boolean;
}
