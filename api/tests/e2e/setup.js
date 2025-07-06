const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.PORT = '3001';

let prisma;

beforeAll(async () => {
  // Generate Prisma client
  await execAsync('npx prisma generate');

  // Push database schema with the test database URL
  await execAsync('DATABASE_URL="file:./test.db" npx prisma db push --force-reset');

  // Initialize Prisma client after database setup
  prisma = new PrismaClient();

  // Set global prisma for use in tests
  global.prisma = prisma;

  console.log('Test database setup complete');
});

afterAll(async () => {
  // Clean up database
  await prisma.$disconnect();
  console.log('Test database cleanup complete');
});

beforeEach(async () => {
  // Clear all data before each test
  await prisma.todo.deleteMany();
});