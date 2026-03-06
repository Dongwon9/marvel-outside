import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Store refresh token hash with TTL
   * @param userId User ID
   * @param hashedToken Bcrypt hashed refresh token
   * @param ttl Time to live in seconds (default: 604800 = 7 days)
   */
  async setRefreshToken(userId: string, hashedToken: string, ttl: number): Promise<void> {
    const key = `refresh_token:${userId}`;
    try {
      await this.redisClient.setex(key, ttl, hashedToken);
    } catch (error) {
      throw new InternalServerErrorException('Failed to store refresh token in Redis');
    }
  }

  /**
   * Get refresh token hash by user ID
   * @param userId User ID
   * @returns Stored hashed token or null if not found
   */
  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve refresh token from Redis');
    }
  }

  /**
   * Delete refresh token (logout)
   * @param userId User ID
   */
  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    try {
      await this.redisClient.del(key);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete refresh token from Redis');
    }
  }

  /**
   * Store email verification token with TTL (default: 86400 = 24 hours)
   * @param token Random hex token
   * @param userId User ID
   * @param ttl Time to live in seconds
   */
  async setEmailVerificationToken(token: string, userId: string, ttl = 86400): Promise<void> {
    const key = `email_verify:${token}`;
    try {
      await this.redisClient.setex(key, ttl, userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to store email verification token in Redis');
    }
  }

  /**
   * Get user ID by email verification token
   * @param token Random hex token
   * @returns User ID or null if not found / expired
   */
  async getEmailVerificationToken(token: string): Promise<string | null> {
    const key = `email_verify:${token}`;
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve email verification token from Redis',
      );
    }
  }

  /**
   * Delete email verification token after use
   * @param token Random hex token
   */
  async deleteEmailVerificationToken(token: string): Promise<void> {
    const key = `email_verify:${token}`;
    try {
      await this.redisClient.del(key);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete email verification token from Redis',
      );
    }
  }

  /**
   * Set resend cooldown (default: 60 seconds)
   * @param userId User ID
   * @param ttl Time to live in seconds
   */
  async setResendCooldown(userId: string, ttl = 60): Promise<void> {
    const key = `email_resend_cooldown:${userId}`;
    try {
      await this.redisClient.setex(key, ttl, '1');
    } catch (error) {
      throw new InternalServerErrorException('Failed to set resend cooldown in Redis');
    }
  }

  /**
   * Check if resend cooldown is active for userId
   * @param userId User ID
   * @returns true if cooldown is active
   */
  async getResendCooldown(userId: string): Promise<boolean> {
    const key = `email_resend_cooldown:${userId}`;
    try {
      const value = await this.redisClient.get(key);
      return value !== null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to check resend cooldown in Redis');
    }
  }
}
