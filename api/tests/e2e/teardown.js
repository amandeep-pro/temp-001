const fs = require('fs');
const path = require('path');

module.exports = async () => {
  // Clean up test database file
  const testDbPath = path.join(process.cwd(), 'test.db');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
    console.log('Test database file deleted');
  }
};