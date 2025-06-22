const pool = require('../config/database');

class Company {
  static async create(data) {
    const query = `
      INSERT INTO companies (name, morning_notification_time, evening_notification_time, timezone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      data.name,
      data.morningTime || '09:00:00',
      data.eveningTime || '18:00:00',
      data.timezone || 'UTC'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM companies WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = 'SELECT * FROM companies WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE companies 
      SET name = $2, morning_notification_time = $3, evening_notification_time = $4, timezone = $5
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, data.name, data.morningTime, data.eveningTime, data.timezone];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM companies WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Company; 