import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { E2ETestHelper } from './e2e-test.helper';

/**
 * E2E 테스트 기본 클래스
 * - 로그인/회원가입 관리
 * - 사용자별 독립적인 Agent로 쿠키 자동 관리
 * - 인증된 요청 전송
 */
export abstract class E2ETestBase {
  public helper!: E2ETestHelper;
  public app!: INestApplication;

  // 유저별 쿠키 저장소 (명시적 관리)
  protected userCookies: Map<string, string> = new Map();

  // 테스트 데이터 저장소 (생성된 엔티티 ID 추적)
  protected testData: {
    users: Array<{ id: string; email: string; password: string }>;
    boards: Array<{ id: string }>;
    posts: Array<{ id: string; boardId: string }>;
    comments: Array<{ id: string; postId: string }>;
  } = {
    users: [],
    boards: [],
    posts: [],
    comments: [],
  };

  /**
   * 테스트 초기화
   */
  async setup(): Promise<void> {
    this.helper = new E2ETestHelper();
    await this.helper.setup();
    this.app = this.helper.getApp();
  }

  /**
   * 테스트 정리
   */
  async cleanup(): Promise<void> {
    this.userCookies.clear();
    this.testData = {
      users: [],
      boards: [],
      posts: [],
      comments: [],
    };
    await this.helper.cleanup();
  }

  /**
   * 사용자 회원가입
   */
  async signup(
    email: string,
    name: string,
    password: string,
  ): Promise<{ userId: string; status: number }> {
    const response = await this.helper.signup(email, name, password);

    if (response.status === 201) {
      this.testData.users.push({ id: response.body.id, email, password });
    }

    return {
      userId: response.body.id,
      status: response.status,
    };
  }

  /**
   * 사용자 로그인 (응답 바디에서 accessToken 추출해서 저장)
   */
  async login(email: string, password: string): Promise<{ status: number }> {
    const response = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    if (response.status !== 201) {
      throw new Error(
        `Login failed for ${email} with status ${response.status}: ${response.body.message || 'Unknown error'}`,
      );
    }

    // Set-Cookie 헤더에서 accessToken, refreshToken 모두 추출
    const setCookieHeaders = response.headers['set-cookie'];
    if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
      // accessToken 추출
      const accessTokenCookie = setCookieHeaders.find(c => c.includes('accessToken'));
      if (accessTokenCookie) {
        const match = accessTokenCookie.match(/accessToken=([^;]+)/);
        if (match) {
          const key = `${email}:accessToken`;
          this.userCookies.set(key, match[1]);
        }
      }

      // refreshToken 추출
      const refreshTokenCookie = setCookieHeaders.find(c => c.includes('refreshToken'));
      if (refreshTokenCookie) {
        const match = refreshTokenCookie.match(/refreshToken=([^;]+)/);
        if (match) {
          const key = `${email}:refreshToken`;
          this.userCookies.set(key, match[1]);
        }
      }
    }

    return { status: response.status };
  }

  /**
   * 인증된 GET 요청 (Authorization 헤더로 accessToken 전달)
   */
  authedGet(userEmail: string, path: string): any {
    const token = this.userCookies.get(`${userEmail}:accessToken`);
    if (!token) {
      throw new Error(`No accessToken found for user ${userEmail}`);
    }
    return request(this.app.getHttpServer()).get(path).set('Authorization', `Bearer ${token}`);
  }

  /**
   * 인증된 POST 요청 (Authorization 헤더로 accessToken 전달)
   */
  authedPost(userEmail: string, path: string): any {
    const token = this.userCookies.get(`${userEmail}:accessToken`);
    if (!token) {
      throw new Error(`No accessToken found for user ${userEmail}`);
    }
    return request(this.app.getHttpServer()).post(path).set('Authorization', `Bearer ${token}`);
  }

  /**
   * 인증된 PUT 요청 (Authorization 헤더로 accessToken 전달)
   */
  authedPut(userEmail: string, path: string): any {
    const token = this.userCookies.get(`${userEmail}:accessToken`);
    if (!token) {
      throw new Error(`No accessToken found for user ${userEmail}`);
    }
    return request(this.app.getHttpServer()).put(path).set('Authorization', `Bearer ${token}`);
  }

  /**
   * 인증된 PATCH 요청 (Authorization 헤더로 accessToken 전달)
   */
  authedPatch(userEmail: string, path: string): any {
    const token = this.userCookies.get(`${userEmail}:accessToken`);
    if (!token) {
      throw new Error(`No accessToken found for user ${userEmail}`);
    }
    return request(this.app.getHttpServer()).patch(path).set('Authorization', `Bearer ${token}`);
  }

  /**
   * 인증된 DELETE 요청 (Authorization 헤더로 accessToken 전달)
   */
  authedDelete(userEmail: string, path: string): any {
    const token = this.userCookies.get(`${userEmail}:accessToken`);
    if (!token) {
      throw new Error(`No accessToken found for user ${userEmail}`);
    }
    return request(this.app.getHttpServer()).delete(path).set('Authorization', `Bearer ${token}`);
  }

  /**
   * refresh 엔드포인트에 refreshToken 전달하고 새로운 토큰 저장
   */
  async refreshToken(userEmail: string): Promise<{ status: number }> {
    const refreshToken = this.userCookies.get(`${userEmail}:refreshToken`);

    if (!refreshToken) {
      throw new Error(`No refreshToken found for user ${userEmail}`);
    }

    const response = await request(this.app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken });

    if (response.status === 200 || response.status === 201) {
      // Set-Cookie 헤더에서 새로운 accessToken 추출
      const setCookieHeaders = response.headers['set-cookie'];
      if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
        const accessTokenCookie = setCookieHeaders.find(c => c.includes('accessToken'));
        if (accessTokenCookie) {
          const match = accessTokenCookie.match(/accessToken=([^;]+)/);
          if (match) {
            const key = `${userEmail}:accessToken`;
            this.userCookies.set(key, match[1]);
          }
        }

        const refreshTokenCookie = setCookieHeaders.find(c => c.includes('refreshToken'));
        if (refreshTokenCookie) {
          const match = refreshTokenCookie.match(/refreshToken=([^;]+)/);
          if (match) {
            const key = `${userEmail}:refreshToken`;
            this.userCookies.set(key, match[1]);
          }
        }
      }
    }

    return { status: response.status };
  }

  /**
   * 상태 코드 검증
   */
  expectStatus(response: any, expected: number): void {
    this.helper.expectStatus(response, expected);
  }

  /**
   * 응답 데이터 검증
   */
  expectData(response: any): void {
    this.helper.expectData(response);
  }

  /**
   * 응답 에러 검증
   */
  expectError(response: any): void {
    this.helper.expectError(response);
  }
}
