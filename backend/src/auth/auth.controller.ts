import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response as ExpressResponse } from 'express';

import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { User } from '../generated/prisma/client';

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
  @Public()
  async login(
    @Body() body: AuthDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ message: string }> {
    // 로그인 시 액세스/리프레시 토큰을 발급하고, 둘 다 httpOnly 쿠키에 저장한다
    const tokens = await this.authService.login(body.email, body.password);
    this.setRefreshCookie(res, tokens.refreshToken);
    this.setAccessCookie(res, tokens.accessToken);
    return { message: 'Login successful' };
  }

  @Post('refresh')
  @Public()
  async refresh(
    @Req() req: RequestWithCookies,
    @Body() body: RefreshTokenDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ message: string }> {
    // 쿠키 우선, 없을 때만 바디에서 리프레시 토큰을 읽어 리프레시한다
    const refreshToken = req.cookies?.refreshToken ?? body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const tokens = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    this.setAccessCookie(res, tokens.accessToken);
    return { message: 'Token refreshed' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: User,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken', this.buildCookieOptions());
    res.clearCookie('accessToken', this.buildCookieOptions());
    return { message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User): { id: string; email: string; name: string } {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private setAccessCookie(res: ExpressResponse, accessToken: string): void {
    // 액세스 토큰을 httpOnly 쿠키로 저장 (XSS 공격 방지)
    res.cookie('accessToken', accessToken, this.buildCookieOptions());
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
