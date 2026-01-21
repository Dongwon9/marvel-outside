import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_SECRET: 'test-secret',
                JWT_EXPIRES_IN: '15m',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRES_IN: '7d',
                REFRESH_TOKEN_TTL: '604800',
              };
              return config[key as keyof typeof config];
            }),
          },
        },
        {
          provide: RedisService,
          useValue: {
            setRefreshToken: jest.fn(),
            getRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user ID for valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        passwordHashed: 'hashed-password',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBe('user-123');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true, passwordHashed: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    });

    it('should return null for non-existent user', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const mockUser = {
        id: 'user-123',
        passwordHashed: 'hashed-password',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = service.generateTokens('user-123');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: 'user-123' },
        { secret: 'test-secret', expiresIn: '15m' },
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: 'user-123' },
        { secret: 'test-refresh-secret', expiresIn: '7d' },
      );
    });
  });

  describe('login', () => {
    it('should login successfully and store hashed refresh token in Redis', async () => {
      const mockUser = {
        id: 'user-123',
        passwordHashed: 'hashed-password',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.login('test@example.com', 'password123');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('refresh-token', 10);
      expect(redisService.setRefreshToken).toHaveBeenCalledWith(
        'user-123',
        'hashed-refresh-token',
        604800,
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login('test@example.com', 'wrong-password')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(redisService.setRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully with valid refresh token from Redis', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      jwtService.verify.mockReturnValue({ userId: 'user-123' });
      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      redisService.getRefreshToken.mockResolvedValue('stored-hashed-token');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-refresh-token');
      jwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refresh('old-refresh-token');

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(redisService.getRefreshToken).toHaveBeenCalledWith('user-123');
      expect(bcrypt.compare).toHaveBeenCalledWith('old-refresh-token', 'stored-hashed-token');
      expect(redisService.setRefreshToken).toHaveBeenCalledWith(
        'user-123',
        'new-hashed-refresh-token',
        604800,
      );
    });

    it('should throw UnauthorizedException if token not found in Redis', async () => {
      const mockUser = {
        id: 'user-123',
      };

      jwtService.verify.mockReturnValue({ userId: 'user-123' });
      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      redisService.getRefreshToken.mockResolvedValue(null);

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(redisService.setRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if token does not match Redis hash', async () => {
      const mockUser = {
        id: 'user-123',
      };

      jwtService.verify.mockReturnValue({ userId: 'user-123' });
      prismaService.user.findUnique.mockResolvedValue(mockUser as any);
      redisService.getRefreshToken.mockResolvedValue('stored-hashed-token');
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh('wrong-token')).rejects.toThrow(UnauthorizedException);
      expect(redisService.setRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user-123' });
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.refresh('refresh-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid JWT', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh('invalid-jwt')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delete refresh token from Redis', async () => {
      await service.logout('user-123');

      expect(redisService.deleteRefreshToken).toHaveBeenCalledWith('user-123');
    });
  });
});
