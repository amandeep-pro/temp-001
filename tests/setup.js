// Basic test setup
const { PrismaClient } = require('@prisma/client');

// Mock console.log during tests to reduce noise
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';