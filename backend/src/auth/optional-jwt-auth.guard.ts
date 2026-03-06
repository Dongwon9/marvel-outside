import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 인증 토큰이 있으면 user를 설정하고, 없으면 null로 두는 선택적 JWT 가드.
 * @Public() 데코레이터와 함께 사용해 비로그인 접근도 허용하면서
 * 로그인 사용자 정보는 컨트롤러에서 받아올 수 있게 한다.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: unknown, user: TUser | false): TUser | null {
    return user || null;
  }
}
