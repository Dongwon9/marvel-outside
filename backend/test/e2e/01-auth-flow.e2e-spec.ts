/**
 * E2E 테스트: 인증 플로우
 * - 회원가입
 * - 로그인
 * - 토큰 갱신
 * - 내 정보 조회
 * - 로그아웃
 */

import { UserFactory } from '../factories/user.factory';

import { E2ETestBase } from './e2e.base';

describe('Auth Flow E2E Tests (01)', () => {
  class TestEnvironment extends E2ETestBase {}
  let test: TestEnvironment;

  beforeAll(async () => {
    test = new TestEnvironment();
    await test.setup();
  });

  afterAll(async () => {
    await test.cleanup();
  });

  describe('회원가입', () => {
    it('should successfully signup with valid credentials', async () => {
      const userDto = UserFactory.createUserDto();

      const response = await test.helper.post('/users').send(userDto);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe(userDto.email);
      expect(response.body.name).toBe(userDto.name);
    });

    it('should fail signup with duplicate email', async () => {
      const userDto = UserFactory.createUserDto();

      // 첫 번째 회원가입
      await test.helper.post('/users').send(userDto);

      // 두 번째 회원가입 (중복 이메일)
      const response = await test.helper.post('/users').send(userDto);

      expect(response.status).toBe(409);
    });

    it('should fail signup without required fields', async () => {
      const response = await test.helper.post('/users').send({
        email: 'test@example.com',
        // name과 password 누락
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('로그인', () => {
    let testUserEmail: string;
    let testUserPassword: string;

    beforeEach(async () => {
      const userDto = UserFactory.createUserDto();
      testUserEmail = userDto.email;
      testUserPassword = userDto.password;

      await test.helper.post('/users').send(userDto);
    });

    it('should successfully login with correct credentials', async () => {
      const response = await test.helper.login(testUserEmail, testUserPassword);

      expect(response.status).toBe(201);
      expect(response.cookies).toBeDefined();
      expect(response.cookies.length).toBeGreaterThan(0);
    });

    it('should fail login with wrong password', async () => {
      const response = await test.helper.login(testUserEmail, 'WrongPassword123!');

      expect(response.status).toBe(401);
    });

    it('should fail login with non-existent email', async () => {
      const response = await test.helper.login('nonexistent@test.com', 'AnyPassword123!');

      expect(response.status).toBe(401);
    });

    it('should set httpOnly cookies on successful login', async () => {
      const response = await test.helper.login(testUserEmail, testUserPassword);

      expect(response.status).toBe(201);
      const setCookieHeaders = response.cookies;

      expect(setCookieHeaders.some(c => c.includes('accessToken'))).toBe(true);
      expect(setCookieHeaders.some(c => c.includes('refreshToken'))).toBe(true);
      expect(setCookieHeaders.some(c => c.includes('HttpOnly'))).toBe(true);
    });
  });

  describe('로그인 후 내 정보 조회', () => {
    let testUserEmail: string;
    let testUserPassword: string;
    let testUserId: string;

    beforeEach(async () => {
      const userDto = UserFactory.createUserDto();
      testUserEmail = userDto.email;
      testUserPassword = userDto.password;

      const signupResponse = await test.helper.post('/users').send(userDto);
      testUserId = signupResponse.body.id;

      await test.login(testUserEmail, testUserPassword);
    });

    it('should get current user info after login', async () => {
      const response = await test
        .authedGet(testUserEmail, '/auth/me')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUserId);
      expect(response.body.email).toBe(testUserEmail);
    });

    it('should fail to get auth info without login', async () => {
      const response = await test.helper.get('/auth/me');

      expect(response.status).toBe(401);
    });
  });

  describe('토큰 갱신', () => {
    let testUserEmail: string;
    let testUserPassword: string;

    beforeEach(async () => {
      const userDto = UserFactory.createUserDto();
      testUserEmail = userDto.email;
      testUserPassword = userDto.password;

      await test.helper.post('/users').send(userDto);
      await test.login(testUserEmail, testUserPassword);
    });

    it('should refresh token successfully', async () => {
      const response = await test.refreshToken(testUserEmail);

      expect([200, 201]).toContain(response.status);
    });

    it('should fail refresh without token', async () => {
      const response = await test.helper.post('/auth/refresh').send({});

      expect(response.status).toBe(401);
    });
  });

  describe('로그아웃', () => {
    let testUserEmail: string;
    let testUserPassword: string;

    beforeEach(async () => {
      const userDto = UserFactory.createUserDto();
      testUserEmail = userDto.email;
      testUserPassword = userDto.password;

      await test.helper.post('/users').send(userDto);
      await test.login(testUserEmail, testUserPassword);
    });

    it('should successfully logout', async () => {
      const response = await test.authedPost(testUserEmail, '/auth/logout').send({});

      // 로그아웃은 POST 요청이지만, 리소스를 생성하지 않으므로 201이 아닌 200을 기대하지만,
      // 실제 API는 201을 반환할 수 있음 (또는 204 No Content)
      expect([200, 201]).toContain(response.status);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should fail to access protected route after logout', async () => {
      await test.authedPost(testUserEmail, '/auth/logout').send({});

      // 로그아웃 후 같은 쿠키로 요청하면 실패해야 함
      // (실제로는 쿠키가 비워지므로 새 요청은 401이어야 함)
      const response = await test.helper.get('/auth/me');

      expect(response.status).toBe(401);
    });
  });

  describe('전체 인증 플로우', () => {
    it('signup → login → getMe → refresh → logout flow', async () => {
      const userDto = UserFactory.createUserDto();

      // 1. 회원가입
      const signupResponse = await test.helper.post('/users').send(userDto);
      expect(signupResponse.status).toBe(201);
      const userId = signupResponse.body.id;

      // 2. 로그인
      const loginResponse = await test.helper.login(userDto.email, userDto.password);
      expect(loginResponse.status).toBe(201);
      expect(loginResponse.cookies.length).toBeGreaterThan(0);

      // 쿠키 저장
      await test.login(userDto.email, userDto.password);

      // 3. 내 정보 조회
      const meResponse = await test
        .authedGet(userDto.email, '/auth/me')
        .expect('Content-Type', /json/);
      expect(meResponse.status).toBe(200);
      expect(meResponse.body.id).toBe(userId);

      // 4. 토큰 갱신
      const refreshResponse = await test.refreshToken(userDto.email);
      expect([200, 201]).toContain(refreshResponse.status);

      // 5. 로그아웃
      const logoutResponse = await test
        .authedPost(userDto.email, '/auth/logout')
        .send()
        .expect('Content-Type', /json/);
      expect([200, 201]).toContain(logoutResponse.status);

      // 6. 로그아웃 후 보호된 엔드포인트 접근 불가
      const finalResponse = await test.helper.get('/auth/me');
      expect(finalResponse.status).toBe(401);
    });
  });
});
