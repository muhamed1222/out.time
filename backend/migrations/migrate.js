require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigrations() {
  try {
    console.log('🔄 Запуск миграций базы данных...');

    // Читаем файл миграции
    const migrationPath = path.join(__dirname, '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Выполняем миграцию
    await pool.query(migrationSQL);
    
    console.log('✅ Миграции успешно выполнены!');
    console.log('📊 Созданные таблицы:');
    console.log('   - companies (компании)');
    console.log('   - users (пользователи-администраторы)');
    console.log('   - employees (сотрудники)');
    console.log('   - time_records (записи рабочего времени)');
    console.log('   - reports (отчеты сотрудников)');
    console.log('   - invites (пригласительные ссылки)');

  } catch (error) {
    console.error('❌ Ошибка выполнения миграций:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔗 Не удается подключиться к базе данных PostgreSQL');
      console.error('   Проверьте:');
      console.error('   - Запущен ли PostgreSQL');
      console.error('   - Правильность DATABASE_URL в .env файле');
      console.error('   - Доступность базы данных на указанном хосте и порту');
    }
    
    process.exit(1);
  }
}

// Функция для создания тестовых данных
async function seedDatabase() {
  try {
    console.log('🌱 Создание тестовых данных...');

    // Создаем тестовую компанию
    const companyResult = await pool.query(`
      INSERT INTO companies (name, morning_notification_time, evening_notification_time)
      VALUES ('Outcasts Dev Team', '09:00:00', '18:00:00')
      RETURNING id
    `);
    const companyId = companyResult.rows[0].id;

    // Создаем тестового администратора
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT INTO users (email, password_hash, company_id)
      VALUES ('admin@outcasts.dev', $1, $2)
    `, [passwordHash, companyId]);

    console.log('✅ Тестовые данные созданы!');
    console.log('🔑 Тестовый администратор:');
    console.log('   Email: admin@outcasts.dev');
    console.log('   Пароль: admin123');

  } catch (error) {
    if (error.code === '23505') {
      console.log('ℹ️  Тестовые данные уже существуют');
    } else {
      console.error('❌ Ошибка создания тестовых данных:', error.message);
    }
  }
}

// Основная функция
async function main() {
  const args = process.argv.slice(2);
  
  try {
    if (args.includes('--seed')) {
      await runMigrations();
      await seedDatabase();
    } else {
      await runMigrations();
    }
  } finally {
    await pool.end();
  }
}

main().catch(console.error); 