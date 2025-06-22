const pool = require('../config/database');

class TimeRecord {
  static async create(data) {
    const query = `
      INSERT INTO time_records (employee_id, date, start_time, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [data.employeeId, data.date, data.startTime, data.status || 'work'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmployeeAndDate(employeeId, date) {
    const query = 'SELECT * FROM time_records WHERE employee_id = $1 AND date = $2';
    const result = await pool.query(query, [employeeId, date]);
    return result.rows[0];
  }

  static async updateEndTime(employeeId, date, endTime) {
    const query = `
      UPDATE time_records 
      SET end_time = $3 
      WHERE employee_id = $1 AND date = $2
      RETURNING *
    `;
    const result = await pool.query(query, [employeeId, date, endTime]);
    return result.rows[0];
  }

  static async findByEmployeeAndDateRange(employeeId, startDate, endDate) {
    const query = `
      SELECT * FROM time_records 
      WHERE employee_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY date DESC
    `;
    const result = await pool.query(query, [employeeId, startDate, endDate]);
    return result.rows;
  }

  static async findByCompanyAndDate(companyId, date) {
    const query = `
      SELECT tr.*, e.name as employee_name, e.telegram_id
      FROM time_records tr
      JOIN employees e ON tr.employee_id = e.id
      WHERE e.company_id = $1 AND tr.date = $2
      ORDER BY e.name
    `;
    const result = await pool.query(query, [companyId, date]);
    return result.rows;
  }

  static async getCompanyStats(companyId, date) {
    const query = `
      SELECT 
        COUNT(*) as total_employees,
        COUNT(CASE WHEN tr.start_time IS NOT NULL THEN 1 END) as working_today,
        COUNT(CASE WHEN tr.status = 'sick' THEN 1 END) as sick_today,
        COUNT(CASE WHEN tr.status = 'vacation' THEN 1 END) as vacation_today,
        AVG(EXTRACT(EPOCH FROM (tr.end_time - tr.start_time))/3600) as avg_work_hours
      FROM employees e
      LEFT JOIN time_records tr ON e.id = tr.employee_id AND tr.date = $2
      WHERE e.company_id = $1 AND e.is_active = true
    `;
    const result = await pool.query(query, [companyId, date]);
    return result.rows[0];
  }

  static async updateStatus(employeeId, date, status) {
    const query = `
      UPDATE time_records 
      SET status = $3 
      WHERE employee_id = $1 AND date = $2
      RETURNING *
    `;
    const result = await pool.query(query, [employeeId, date, status]);
    return result.rows[0];
  }
}

module.exports = TimeRecord; 