import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { UserService } from '../src/user/user.service';

import { IsolatedPrismaService } from './db-isolation';
import { UserFactory } from './factories/user.factory';
import { redisStoreMock, mockRedisService } from './mocks/redis.mock';

describe('User + Auth Integration Tests', () => {
  let app: TestingModule;
  let userService: UserService;
  let authService: AuthService;
  let prisma: PrismaService;
  let configService: ConfigService;
  let isolatedPrisma: IsolatedPrismaService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .compile();

    userService = app.get(UserService);
    authService = app.get(AuthService);
    prisma = app.get(PrismaService);
    configService = app.get(ConfigService);
    isolatedPrisma = new IsolatedPrismaService(prisma);
  });

  afterAll(async () => {
    // NestJS 모듈 정리
    await app.close();
    // 모든 열린 핸들 정리를 위해 짧은 대기
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  beforeEach(() => {
    redisStoreMock.clear();
    jest.clearAllMocks();
  });

  describe('UserService', () => {
    it('should create a new user', async () => {
      const dto = UserFactory.createUserDto();
      const result = await isolatedPrisma.runInTransaction(async () => userService.createUser(dto));

      expect(result.id).toBeDefined();
      expect(result.email).toBe(dto.email);
    });

    it('should throw on duplicate email', async () => {
      const dto = UserFactory.createUserDto();
      await isolatedPrisma.runInTransaction(async () => userService.createUser(dto));

      const result = isolatedPrisma.runInTransaction(async () => userService.createUser(dto));
      await expect(result).rejects.toThrow();
    });

    it('should find user by email', async () => {
      const dto = UserFactory.createUserDto();
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const result = await isolatedPrisma.runInTransaction(async () =>
        userService.getUser({ email: dto.email }),
      );

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
    });

    it('should find user by ID', async () => {
      const dto = UserFactory.createUserDto();
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const result = await isolatedPrisma.runInTransaction(async () =>
        userService.getUserById(created.id),
      );

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
    });

    it('should get users with pagination', async () => {
      const dtos = UserFactory.createUserDtos(3);
      await isolatedPrisma.runInTransaction(async () => {
        await Promise.all(dtos.map(dto => userService.createUser(dto)));
      });

      const result = await isolatedPrisma.runInTransaction(async () =>
        userService.getUsers({ skip: 0, take: 2 }),
      );

      expect(result.length).toBe(2);
    });

    it('should hash password on create', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const userInDb = await isolatedPrisma.runInTransaction(async tx =>
        tx.user.findUnique({ where: { id: created.id } }),
      );

      expect(userInDb?.passwordHashed).not.toBe(password);
      const isValid = await bcrypt.compare(password, userInDb!.passwordHashed);
      expect(isValid).toBe(true);
    });
  });

  describe('AuthService', () => {
    it('should validate user with correct credentials', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const result = await isolatedPrisma.runInTransaction(async () =>
        authService.validateUser(dto.email, password),
      );

      expect(result).toBe(created.id);
    });

    it('should return null with wrong password', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      await isolatedPrisma.runInTransaction(async () => userService.createUser(dto));

      const result = await isolatedPrisma.runInTransaction(async () =>
        authService.validateUser(dto.email, 'WrongPassword!'),
      );

      expect(result).toBeNull();
    });

    it('should generate tokens', async () => {
      const dto = UserFactory.createUserDto();
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const result = authService.generateTokens(created.id);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should validate generated JWT token', async () => {
      const dto = UserFactory.createUserDto();
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const tokens = authService.generateTokens(created.id);
      const jwtService = app.get(JwtService);
      const jwtSecret = configService.get<string>('JWT_SECRET');

      const payload = jwtService.verify(tokens.accessToken, { secret: jwtSecret });
      expect(payload.userId).toBe(created.id);
    });

    it('should login successfully', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      await isolatedPrisma.runInTransaction(async () => userService.createUser(dto));

      const result = await isolatedPrisma.runInTransaction(async () =>
        authService.login(dto.email, password),
      );

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw on invalid login', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      await isolatedPrisma.runInTransaction(async () => userService.createUser(dto));

      const result = authService.login(dto.email, 'WrongPassword!');

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should refresh token', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      const tokens = await isolatedPrisma.runInTransaction(async () =>
        authService.login(dto.email, password),
      );

      // 실제 refresh token 해시를 Redis에 저장
      const refreshTokenHash = await UserFactory.hashPassword(tokens.refreshToken);
      const key = `refresh_token:${created.id}`;
      redisStoreMock.set(key, refreshTokenHash, 604800);

      const result = await isolatedPrisma.runInTransaction(async () =>
        authService.refresh(tokens.refreshToken),
      );

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should logout', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );

      await isolatedPrisma.runInTransaction(async () => authService.login(dto.email, password));

      // Redis 저장소에 refresh token이 있는지 확인
      const key = `refresh_token:${created.id}`;
      expect(redisStoreMock.get(key)).toBeDefined();

      // logout 실행
      await isolatedPrisma.runInTransaction(async () => authService.logout(created.id));

      // Redis에서 제거되었는지 확인
      expect(redisStoreMock.get(key)).toBeNull();
    });
  });

  describe('E2E Flow', () => {
    it('signup -> login -> refresh -> profile', async () => {
      const password = 'Test123456!';
      const dto = UserFactory.createUserDtoWithPassword(password);

      // 1. Signup
      const created = await isolatedPrisma.runInTransaction(async () =>
        userService.createUser(dto),
      );
      expect(created.id).toBeDefined();

      // 2. Login
      const tokens = await isolatedPrisma.runInTransaction(async () =>
        authService.login(dto.email, password),
      );
      expect(tokens.accessToken).toBeDefined();

      // 3. Refresh - Redis에 refresh token 저장
      const refreshTokenHash = await UserFactory.hashPassword(tokens.refreshToken);
      const key = `refresh_token:${created.id}`;
      redisStoreMock.set(key, refreshTokenHash, 604800);

      const newTokens = await isolatedPrisma.runInTransaction(async () =>
        authService.refresh(tokens.refreshToken),
      );
      expect(newTokens.accessToken).toBeDefined();

      // 4. Profile
      const jwtService = app.get(JwtService);
      const jwtSecret = configService.get<string>('JWT_SECRET');
      const payload = jwtService.verify(newTokens.accessToken, { secret: jwtSecret });

      const user = await isolatedPrisma.runInTransaction(async () =>
        userService.getUserById(payload.userId),
      );

      expect(user).not.toBeNull();
      expect(user!.email).toBe(dto.email);
    });
  });
});
