const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.test'), override: true });

module.exports = async function globalTeardown() {
  console.log('🧹 Integration tests completed, cleaning up...');

  try {
    const { PrismaClient } = require('../src/generated/prisma/client');
    const prisma = new PrismaClient();
    await prisma.$disconnect();
    console.log('✓ Database connection closed');
  } catch (error) {
    // Prisma 연결 정리 실패는 무시 (프로세스 종료 시에도 자동 정리됨)
  }
};
