const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ Отсутствует DATABASE_URL в переменных окружения');
  process.exit(1);
}

// Log database configuration (without sensitive data)
console.log('📊 Конфигурация базы данных:');
const dbUrl = new URL(process.env.DATABASE_URL);
console.log(`   Хост: ${dbUrl.hostname}`);
console.log(`   Порт: ${dbUrl.port}`);
console.log(`   База данных: ${dbUrl.pathname.slice(1)}`);
console.log(`   SSL: enabled`);

// Connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum number of connections
  min: 5,                     // Minimum number of connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Increased timeout for connection
  acquireTimeoutMillis: 60000,   // Timeout for acquiring connection
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
};

const pool = new Pool(poolConfig);

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔍 Попытка подключения к базе данных...');
    const client = await pool.connect();
    
    console.log('✅ Соединение установлено, проверяем запросы...');
    const result = await client.query('SELECT NOW()');
    
    console.log('✅ Тестовое подключение к PostgreSQL успешно');
    console.log('🕒 Время сервера БД:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
    if (err.code) {
      console.error('Код ошибки:', err.code);
    }
    if (err.stack) {
      console.error('Стек ошибки:', err.stack);
    }
    
    console.error('\nПроверьте:');
    console.error('1. Правильность DATABASE_URL');
    console.error('2. Доступность базы данных');
    console.error('3. Сетевое подключение');
    console.error('4. Настройки SSL');
    console.error('5. Права доступа пользователя');
    
    return false;
  }
};

// Connection health check
pool.on('connect', () => {
  console.log('✅ Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
  console.error('❌ Ошибка пула PostgreSQL:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Соединение с базой данных потеряно');
  } else if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('База данных имеет слишком много подключений');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('В подключении к базе данных отказано');
  } else {
    console.error('Неизвестная ошибка пула:', err);
    if (err.stack) {
      console.error('Стек ошибки:', err.stack);
    }
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Получен SIGINT, закрываем пул базы данных...');
  try {
    await pool.end();
    console.log('✅ Пул базы данных закрыт');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка при закрытии пула:', err.message);
    process.exit(1);
  }
});

// Export pool and test function
module.exports = { pool, testConnection }; 