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
}
