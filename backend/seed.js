require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
  try {
    console.log('🌱 Создание тестовых данных...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    // Проверяем существование компании
    console.log('Проверяем существование компании...');
    const existingCompany = await pool.query(`
      SELECT id FROM companies WHERE name = 'Outcasts Dev Team'
    `);
    console.log('Результат проверки компании:', existingCompany.rows);

    let companyId;
    if (existingCompany.rows.length === 0) {
      // Создаем тестовую компанию
      console.log('Создаем новую компанию...');
      const companyResult = await pool.query(`
        INSERT INTO companies (name, morning_notification_time, evening_notification_time)
        VALUES ('Outcasts Dev Team', '09:00:00', '18:00:00')
        RETURNING id, name, morning_notification_time, evening_notification_time
      `);
      console.log('Результат создания компании:', companyResult.rows);
      companyId = companyResult.rows[0].id;
      console.log('✅ Компания создана');
    } else {
      companyId = existingCompany.rows[0].id;
      console.log('ℹ️  Компания уже существует');
    }

    // Проверяем существование пользователя
    console.log('Проверяем существование пользователя...');
    const existingUser = await pool.query(`
      SELECT id FROM users WHERE email = 'admin@outcasts.dev'
    `);
    console.log('Результат проверки пользователя:', existingUser.rows);

    if (existingUser.rows.length === 0) {
      // Создаем тестового администратора
      console.log('Создаем нового администратора...');
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      const userResult = await pool.query(`
        INSERT INTO users (email, password_hash, company_id)
        VALUES ('admin@outcasts.dev', $1, $2)
        RETURNING id, email, company_id
      `, [passwordHash, companyId]);
      console.log('Результат создания пользователя:', userResult.rows);
      console.log('✅ Администратор создан');
    } else {
      console.log('ℹ️  Администратор уже существует');
    }

    console.log('🔑 Тестовые данные:');
    console.log('   Email: admin@outcasts.dev');
    console.log('   Пароль: admin123');

  } catch (error) {
    console.error('❌ Ошибка создания тестовых данных:', error.message);
    console.error('Стек ошибки:', error.stack);
  } finally {
    await pool.end();
  }
}

seedDatabase().catch(console.error); 