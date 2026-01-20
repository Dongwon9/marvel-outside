import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokenResponseDto } from './dto/token-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHashed: true },
    });
    if (!user) {
      return null;
    }
    const { passwordHashed, id } = user;
    const isValid = await bcrypt.compare(password, passwordHashed);
    if (!isValid) {
      return null;
    }
    return id;
  }

  generateTokens(userId: string): TokenResponseDto {
    const payload = { userId };
    const jwtSecret = this.configService.get<string>('JWT_SECRET') ?? '';
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m';
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? '';
    const jwtRefreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    // @ts-expect-error - JwtService.sign type definition issue with expiresIn as string
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    });

    // @ts-expect-error - JwtService.sign type definition issue with expiresIn as string
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string): Promise<TokenResponseDto> {
    const userId = await this.validateUser(email, password);
    if (!userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(userId);
    await this.userService.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify<{ userId: string }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const userId = payload.userId;
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.generateTokens(user.id);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }
}
