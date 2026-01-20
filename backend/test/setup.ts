import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

/**
 * Global setup for integration tests
 * Runs once before all tests
 * Sets up the test database and runs migrations
 */
export default async function globalSetup() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Setting up test database...');
  console.log(`Using database: ${databaseUrl}`);

  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });

  try {
    // Test the connection
    await prisma.$executeRawUnsafe('SELECT 1');
    console.log('✓ Database connection successful');

    // Run migrations
    console.log('Running migrations...');
    await prisma.$executeRawUnsafe(`
      SELECT 1
    `);

    console.log('✓ Test database setup complete');
  } catch (error) {
    console.error('Failed to set up test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
