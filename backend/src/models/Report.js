const pool = require('../config/database');

class Report {
  static async create(data) {
    const query = `
      INSERT INTO reports (employee_id, date, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [data.employeeId, data.date, data.content];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmployeeAndDate(employeeId, date) {
    const query = 'SELECT * FROM reports WHERE employee_id = $1 AND date = $2';
    const result = await pool.query(query, [employeeId, date]);
    return result.rows[0];
  }

  static async findByEmployee(employeeId, limit = 10, offset = 0) {
    const query = `
      SELECT * FROM reports 
      WHERE employee_id = $1 
      ORDER BY date DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [employeeId, limit, offset]);
    return result.rows;
  }

  static async findByCompanyAndDate(companyId, date) {
    const query = `
      SELECT r.*, e.name as employee_name, e.telegram_id
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE e.company_id = $1 AND r.date = $2
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [companyId, date]);
    return result.rows;
  }

  static async findByCompanyAndDateRange(companyId, startDate, endDate, employeeId = null) {
    let query = `
      SELECT r.*, e.name as employee_name, e.telegram_id
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE e.company_id = $1 AND r.date BETWEEN $2 AND $3
    `;
    
    const start = new Date(startDate).toISOString().split('T')[0];
    const end = new Date(endDate).toISOString().split('T')[0];
    const values = [companyId, start, end];

    if (employeeId) {
      query += ' AND r.employee_id = $4';
      values.push(employeeId);
    }

    query += ' ORDER BY r.date DESC, e.name';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getRecentByCompany(companyId, limit = 5) {
    const query = `
      SELECT r.*, e.name as employee_name
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE e.company_id = $1 AND e.is_active = true
      ORDER BY r.created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [companyId, limit]);
    return result.rows;
  }

  static async countByCompanyAndDate(companyId, date) {
    const query = `
      SELECT COUNT(*) as report_count
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE e.company_id = $1 AND r.date = $2 AND e.is_active = true
    `;
    const result = await pool.query(query, [companyId, date]);
    return parseInt(result.rows[0].report_count);
  }

  static async update(id, content) {
    const query = `
      UPDATE reports 
      SET content = $2 
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, content]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM reports WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmployeeAndDateRange(employeeId, startDate, endDate) {
    const query = `
      SELECT * FROM reports 
      WHERE employee_id = $1 
      AND date >= $2
      AND date <= $3
      ORDER BY date DESC
    `;
    const start = new Date(startDate).toISOString().split('T')[0];
    const end = new Date(endDate).toISOString().split('T')[0];

    const result = await pool.query(query, [employeeId, start, end]);
    return result.rows;
  }
}

module.exports = Report; 