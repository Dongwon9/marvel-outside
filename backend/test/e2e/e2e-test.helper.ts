import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { RedisService } from '../../src/redis/redis.service';
import { mockRedisService } from '../mocks/redis.mock';

export class E2ETestHelper {
  private app!: INestApplication;
  private testingModule!: TestingModule;
  private agent: any;

  /**
   * E2E 테스트 환경 초기화
   * - NestJS 애플리케이션 생성
   * - RedisService Mock으로 대체
   * - Supertest Agent 생성 (자동 쿠키 관리)
   */
  async setup(): Promise<void> {
    this.testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .compile();

    this.app = this.testingModule.createNestApplication();
    await this.app.init();

    // Supertest Agent는 자동으로 쿠키를 저장/전송합니다
    this.agent = request.agent(this.app.getHttpServer());
  }

  /**
   * E2E 테스트 환경 정리
   * - 애플리케이션 종료
   * - 모듈 정리
   */
  async cleanup(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * NestJS 애플리케이션 인스턴스 반환
   */
  getApp(): INestApplication {
    return this.app;
  }

  /**
   * GET 요청 실행
   */
  get(path: string) {
    return this.agent.get(path);
  }

  /**
   * POST 요청 실행
   */
  post(path: string) {
    return this.agent.post(path);
  }

  /**
   * PUT 요청 실행
   */
  put(path: string) {
    return this.agent.put(path);
  }

  /**
   * PATCH 요청 실행
   */
  patch(path: string) {
    return this.agent.patch(path);
  }

  /**
   * DELETE 요청 실행
   */
  delete(path: string) {
    return this.agent.delete(path);
  }

  /**
   * 회원가입 헬퍼
   */
  async signup(
    email: string,
    name: string,
    password: string,
  ): Promise<{ status: number; body: any }> {
    const response = await this.post('/auth/signup')
      .send({ email, name, password })
      .expect('Content-Type', /json/);

    return {
      status: response.status,
      body: response.body,
    };
  }

  /**
   * 로그인 헬퍼
   * - Agent가 쿠키를 자동으로 저장/전달합니다
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ status: number; body: any; cookies: string[] }> {
    const response = await this.agent.post('/auth/login').send({ email, password });

    const cookies = response.headers['set-cookie'];
    return {
      status: response.status,
      body: response.body,
      cookies: Array.isArray(cookies) ? cookies : [],
    };
  }

  /**
   * 응답이 예상한 상태 코드와 일치하는지 확인
   */
  expectStatus(response: any, expectedStatus: number): void {
    if (response.status) {
      if (response.status !== expectedStatus) {
        throw new Error(
          `Expected status ${expectedStatus}, got ${response.status}. Body: ${JSON.stringify(response.body)}`,
        );
      }
    }
  }

  /**
   * 응답에 오류가 있는지 확인
   */
  expectError(response: any): void {
    if (!response.body || !response.body.message) {
      throw new Error(`Expected error, got: ${JSON.stringify(response.body)}`);
    }
  }

  /**
   * 응답에 데이터가 있는지 확인
   */
  expectData(response: any): void {
    if (!response.body || (response.body.data === undefined && response.body.id === undefined)) {
      throw new Error(`Expected data in response, got: ${JSON.stringify(response.body)}`);
    }
  }
}
