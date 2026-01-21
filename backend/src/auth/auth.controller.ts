import {
  Body,
  Controller,
  Post,
  Req,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response as ExpressResponse } from 'express';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '../generated/prisma/client';
import { AccessTokenResponseDto } from './dto/token-response.dto';

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() body: AuthDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<AccessTokenResponseDto> {
    // 로그인 시 액세스/리프레시 토큰을 발급하고, 리프레시 토큰은 httpOnly 쿠키에만 저장한다
    const tokens = await this.authService.login(body.email, body.password);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  async refresh(
    @Req() req: RequestWithCookies,
    @Body() body: RefreshTokenDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<AccessTokenResponseDto> {
    // 쿠키 우선, 없을 때만 바디에서 리프레시 토큰을 읽어 리프레시한다
    const refreshToken = req.cookies?.refreshToken ?? body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const tokens = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @CurrentUser() user: User,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ message: string }> {
    // 로그아웃 시 서버 저장 리프레시 토큰 제거 및 쿠키 만료
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken', this.buildCookieOptions());
    return { message: 'Logout successful' };
  }

  private setRefreshCookie(res: ExpressResponse, refreshToken: string): void {
    // 리프레시 토큰은 JS 접근을 차단한 httpOnly 쿠키로만 전달한다
    res.cookie('refreshToken', refreshToken, this.buildCookieOptions());
  }

  private buildCookieOptions() {
    // 환경변수로 쿠키 보안 옵션을 구성하고, 기본값은 개발 친화적으로 둔다
    const oneWeekMs = 1000 * 60 * 60 * 24 * 7;
    const secure = this.configService.get<string>('COOKIE_SECURE') === 'true';
    const domain = this.configService.get<string>('COOKIE_DOMAIN');
    const sameSiteEnv = this.configService.get<'lax' | 'strict' | 'none'>('COOKIE_SAMESITE');
    const sameSite: CookieOptions['sameSite'] = sameSiteEnv ?? 'lax';

    const options: CookieOptions = {
      httpOnly: true,
      secure,
      sameSite,
      domain: domain || undefined,
      maxAge: oneWeekMs,
      path: '/',
    };

    return options;
  }
}
