import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRateDto {
  @IsUUID()
  @IsNotEmpty()
  postId!: string;

  @IsBoolean()
  @IsNotEmpty()
  isLike!: boolean;
}
