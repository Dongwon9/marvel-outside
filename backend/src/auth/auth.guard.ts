import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { AuthService } from './auth.service';

type AuthRequest = Request<
  Record<string, string>,
  unknown,
  { email?: string; password?: string }
> & {
  userId?: string;
  cookies?: Record<string, string>;
};

type RequestWithAuthCheck = Request & { isAuthenticated: () => boolean };

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (request.cookies?.userId) {
      return true;
    }
    const { email, password } = request.body ?? {};
    if (!email || !password) {
      return false;
    }
    const userId = await this.authService.validateUser(email, password);
    if (!userId) {
      return false;
    }
    request.userId = userId;
    return true;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest<AuthRequest>();
    await super.logIn(request);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuthCheck>();
    return request.isAuthenticated();
  }
}
