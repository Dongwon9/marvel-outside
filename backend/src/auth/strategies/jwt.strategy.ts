import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserResponseDto } from '../../user/dto/user-response.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { userId: string }): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // DTO로 변환하여 비밀번호/리프레시 토큰이 응답 객체에 실리지 않도록 강제한다
    return plainToInstance(UserResponseDto, user);
  }
}
