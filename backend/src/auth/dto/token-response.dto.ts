import { IsNotEmpty, IsString } from 'class-validator';

export class TokenResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
