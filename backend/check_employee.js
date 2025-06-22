require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkEmployee() {
  try {
    // Проверяем таблицу employees
    const employeesResult = await pool.query('SELECT * FROM employees WHERE telegram_id = $1', [782245481]);
    console.log('Сотрудник в таблице employees:', employeesResult.rows);

    if (employeesResult.rows[0]) {
      const employeeId = employeesResult.rows[0].id;
      
      // Проверяем записи времени
      const timeResult = await pool.query('SELECT * FROM time_records WHERE employee_id = $1', [employeeId]);
      console.log('\nЗаписи времени:', timeResult.rows);

      // Проверяем компанию
      const companyResult = await pool.query(`
        SELECT e.*, c.name as company_name
        FROM employees e
        JOIN companies c ON e.company_id = c.id
        WHERE e.telegram_id = $1
      `, [782245481]);
      console.log('\nДанные с компанией:', companyResult.rows);
    }
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await pool.end();
  }
}

checkEmployee(); 