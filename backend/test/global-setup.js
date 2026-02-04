const { execSync } = require('child_process');
const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');

async function createTestDatabase() {
  console.log('🔧 Setting up test database...');

  // 개발 환경 설정 로드 (marvel_dev 연결용)
  const devEnvPath = path.resolve(__dirname, '../.env.development');
  const devEnv = dotenv.config({ path: devEnvPath }).parsed || {};

  // 테스트 환경 설정 로드 (marvel_test 연결 정보)
  const testEnvPath = path.resolve(__dirname, '../.env.test');
  const testEnv = dotenv.config({ path: testEnvPath }).parsed || {};

  const devUrl = devEnv.DATABASE_URL || process.env.DATABASE_URL;
  const testUrl = testEnv.DATABASE_URL;

  if (!testUrl) {
    throw new Error('TEST DATABASE_URL is not set in .env.test');
  }

  // marvel_dev 연결 (데이터베이스 생성용)
  const devDbName = 'marvel_dev';
  const testDbName = 'marvel_test';
  const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'marvel',
    password: 'marvel_password',
    database: devDbName,
  });

  try {
    await client.connect();
    console.log(`✓ Connected to development database (${devDbName})`);

    // marvel_test 데이터베이스 존재 여부 확인
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [testDbName]);

    if (result.rows.length === 0) {
      // 테스트 DB 생성
      console.log(`📦 Creating test database: ${testDbName}`);
      await client.query(`CREATE DATABASE ${testDbName} OWNER marvel`);
      console.log(`✓ Test database created: ${testDbName}`);
    } else {
      // 기존 테스트 DB 삭제 및 재생성 (클린한 상태 보장)
      console.log(`🔄 Resetting test database: ${testDbName}`);
      await client.query(`DROP DATABASE IF EXISTS ${testDbName}`);
      await client.query(`CREATE DATABASE ${testDbName} OWNER marvel`);
      console.log(`✓ Test database reset: ${testDbName}`);
    }
  } catch (error) {
    console.error('❌ Database creation failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = async function globalSetup() {
  console.log('🚀 Running global setup for integration tests...');

  try {
    // 1. 테스트 데이터베이스 생성 (초기화)
    await createTestDatabase();

    // 2. Prisma 마이그레이션 실행
    console.log('📝 Running Prisma migrations for test database...');
    execSync('pnpm prisma migrate deploy', {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    });

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    process.exit(1);
  }
};
