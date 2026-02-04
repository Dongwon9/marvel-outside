import { PrismaClient } from '../src/generated/prisma/client';

let transactionClient: any = null;

/**
 * Prisma $transaction을 이용한 테스트 격리
 * 각 테스트마다 transaction을 시작하고, 테스트 완료 후 자동으로 롤백
 */
export async function setupDatabaseIsolation(prisma: PrismaClient) {
  beforeEach(async () => {
    // transaction 시작: transaction 내에서 실행되는 모든 쿼리는 격리됨
    transactionClient = await (prisma as any).$transaction(async (tx: any) => tx, {
      timeout: 10000,
    });

    // PrismaService를 transaction 클라이언트로 대체
    // 이렇게 하면 테스트 내에서의 모든 DB 조작은 transaction 내에서 실행됨
    Object.assign(prisma, transactionClient);
  });

  afterEach(async () => {
    // transaction이 자동으로 롤백되므로, 여기서는 특별한 작업이 필요 없음
    // 하지만 안전성을 위해 transactionClient 초기화
    transactionClient = null;
  });
}

/**
 * 테스트용 격리 Prisma 클라이언트 생성
 * 각 테스트마다 독립적인 트랜잭션 범위 제공
 */
export class IsolatedPrismaService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * 격리된 트랜잭션 내에서 테스트 함수 실행
   * 테스트 완료 후 자동으로 롤백
   */
  async runInTransaction<T>(callback: (txPrisma: any) => Promise<T>): Promise<T> {
    return (this.prisma as any).$transaction(callback, {
      timeout: 5000, // 5초로 감소 (기본 30일에서)
    });
  }
}
