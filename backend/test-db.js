require('dotenv').config();
const { testConnection } = require('./src/config/database');

async function testDb() {
  try {
    await testConnection();
  } catch (error) {
    console.error('Ошибка при тестировании:', error);
  }
}

testDb(); 