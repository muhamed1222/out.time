const pool = require('../config/database');

class Employee {
  static async create(data) {
    const query = `
      INSERT INTO employees (telegram_id, name, company_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [data.telegramId, data.name, data.companyId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByTelegramId(telegramId) {
    console.log('Поиск сотрудника по Telegram ID:', telegramId);
    const query = 'SELECT * FROM employees WHERE telegram_id = $1 AND is_active = true';
    const result = await pool.query(query, [telegramId]);
    console.log('Результат поиска:', result.rows[0]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM employees WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCompany(companyId) {
    const query = `
      SELECT e.*, 
             tr.start_time, 
             tr.end_time, 
             tr.status,
             r.content as today_report
      FROM employees e
      LEFT JOIN time_records tr ON e.id = tr.employee_id AND tr.date = CURRENT_DATE
      LEFT JOIN reports r ON e.id = r.employee_id AND r.date = CURRENT_DATE
      WHERE e.company_id = $1 AND e.is_active = true
      ORDER BY e.name
    `;
    const result = await pool.query(query, [companyId]);
    return result.rows;
  }

  static async findByCompanyWithStats(companyId) {
    const query = `
      SELECT e.id, e.name, e.telegram_id, e.created_at,
             COUNT(tr.id) as total_days_worked,
             COUNT(r.id) as total_reports,
             AVG(EXTRACT(EPOCH FROM (tr.end_time - tr.start_time))/3600) as avg_hours_per_day
      FROM employees e
      LEFT JOIN time_records tr ON e.id = tr.employee_id
      LEFT JOIN reports r ON e.id = r.employee_id
      WHERE e.company_id = $1 AND e.is_active = true
      GROUP BY e.id, e.name, e.telegram_id, e.created_at
      ORDER BY e.name
    `;
    const result = await pool.query(query, [companyId]);
    return result.rows;
  }

  static async update(id, data) {
    const query = `
      UPDATE employees 
      SET name = $2, is_active = $3
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, data.name, data.isActive];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deactivate(id) {
    const query = `
      UPDATE employees 
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findActive() {
    const query = 'SELECT * FROM employees WHERE is_active = true';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findRecent(companyId, sinceDate) {
    const query = `
      SELECT id, name, created_at
      FROM employees
      WHERE company_id = $1
        AND is_active = true
        AND created_at >= $2
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [companyId, sinceDate]);
    return result.rows;
  }
}

module.exports = Employee; 