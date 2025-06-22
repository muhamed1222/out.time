const { Pool } = require('pg');

// Connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum number of connections
  min: 5,                     // Minimum number of connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return error if can't connect within 2 seconds
  acquireTimeoutMillis: 60000,   // Timeout for acquiring connection
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

// Connection health check
pool.on('connect', () => {
  console.log('✅ Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
  console.error('❌ Ошибка пула PostgreSQL:', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Получен SIGINT, закрываем пул базы данных...');
  pool.end(() => {
    console.log('Пул базы данных закрыт');
    process.exit(0);
  });
});

module.exports = pool; 