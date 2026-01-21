import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  constructor(partial: Partial<AccessTokenResponseDto> = {}) {
    Object.assign(this, partial);
  }
}

export class TokenResponseDto extends AccessTokenResponseDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;

  constructor(partial: Partial<TokenResponseDto> = {}) {
    super(partial);
  }
}
