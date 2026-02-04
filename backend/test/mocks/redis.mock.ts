/**
 * Redis Mock 저장소
 * 메모리 기반 Map을 사용하여 Redis 기능 시뮬레이션
 */
export class RedisStoreMock {
  private store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  set(key: string, value: string, exSeconds?: number) {
    this.store.set(key, value);
    // 실제 TTL 구현 (간단히 생략, 테스트에서는 수동 삭제 권장)
    if (exSeconds) {
      setTimeout(() => this.store.delete(key), exSeconds * 1000);
    }
  }

  get(key: string): string | null {
    const value = this.store.get(key);
    return value ?? null;
  }

  del(...keys: string[]) {
    keys.forEach(key => this.store.delete(key));
    return keys.length;
  }

  exists(key: string) {
    return this.store.has(key) ? 1 : 0;
  }
}

// 전역 Redis Mock 인스턴스
export const redisStoreMock = new RedisStoreMock();

/**
 * jest.mock() 호출에 사용할 RedisService 모킹 함수
 */
export const mockRedisService = {
  set: jest.fn((key: string, value: string, exSeconds?: number) => {
    redisStoreMock.set(key, value, exSeconds);
    return Promise.resolve();
  }),
  get: jest.fn((key: string) => {
    return Promise.resolve(redisStoreMock.get(key));
  }),
  del: jest.fn((...keys: string[]) => {
    redisStoreMock.del(...keys);
    return Promise.resolve();
  }),
  exists: jest.fn((key: string) => {
    return Promise.resolve(redisStoreMock.exists(key));
  }),
  setRefreshToken: jest.fn((userId: string, hashedToken: string, ttl: number) => {
    const key = `refresh_token:${userId}`;
    redisStoreMock.set(key, hashedToken, ttl);
    return Promise.resolve();
  }),
  getRefreshToken: jest.fn((userId: string) => {
    const key = `refresh_token:${userId}`;
    return Promise.resolve(redisStoreMock.get(key));
  }),
  deleteRefreshToken: jest.fn((userId: string) => {
    const key = `refresh_token:${userId}`;
    redisStoreMock.del(key);
    return Promise.resolve();
  }),
};
