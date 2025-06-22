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

  static async findByEmployeeAndDateRange(employeeId, startDate, endDate) {
    const query = `
      SELECT * FROM time_records 
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

  static async updateEndTime(employeeId, date, endTime) {
    const query = `
      UPDATE time_records 
      SET end_time = $3, updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $1 AND date = $2
      RETURNING *
    `;
    const result = await pool.query(query, [employeeId, date, endTime]);
    return result.rows[0];
  }

  static async updateStatus(employeeId, date, status) {
    const query = `
      UPDATE time_records 
      SET status = $3, updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $1 AND date = $2
      RETURNING *
    `;
    const result = await pool.query(query, [employeeId, date, status]);
    return result.rows[0];
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
        COUNT(DISTINCT e.id) as total_employees,
        COUNT(DISTINCT CASE WHEN tr.start_time IS NOT NULL THEN e.id END) as working_today,
        COUNT(DISTINCT CASE WHEN tr.status = 'sick' THEN e.id END) as sick_today,
        COUNT(DISTINCT CASE WHEN tr.status = 'vacation' THEN e.id END) as vacation_today,
        AVG(CASE 
          WHEN tr.start_time IS NOT NULL AND tr.end_time IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (tr.end_time - tr.start_time))/3600 
          WHEN tr.start_time IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - tr.start_time))/3600
          ELSE NULL 
        END) as avg_work_hours
      FROM employees e
      LEFT JOIN time_records tr ON e.id = tr.employee_id AND tr.date = $2
      WHERE e.company_id = $1 AND e.is_active = true
    `;
    const result = await pool.query(query, [companyId, date]);
    return result.rows[0];
  }

  static async findLateToday(companyId) {
    const query = `
      SELECT 
        tr.employee_id,
        tr.start_time,
        tr.date,
        e.name as employee_name
      FROM time_records tr
      JOIN employees e ON tr.employee_id = e.id
      JOIN companies c ON e.company_id = c.id
      WHERE e.company_id = $1
        AND tr.date = CURRENT_DATE
        AND tr.status = 'work'
        AND tr.start_time::time > c.morning_notification_time;
    `;
    const result = await pool.query(query, [companyId]);
    return result.rows;
  }
}

module.exports = TimeRecord; 