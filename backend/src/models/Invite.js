const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Invite {
  static async create(data) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Истекает через 7 дней

    const query = `
      INSERT INTO invites (company_id, token, employee_name, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [data.companyId, token, data.employeeName, expiresAt];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByToken(token) {
    const query = `
      SELECT i.*, c.name as company_name 
      FROM invites i
      JOIN companies c ON i.company_id = c.id
      WHERE i.token = $1
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async findValidByToken(token) {
    const query = `
      SELECT i.*, c.name as company_name 
      FROM invites i
      JOIN companies c ON i.company_id = c.id
      WHERE i.token = $1 AND i.is_used = false AND i.expires_at > CURRENT_TIMESTAMP
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async markAsUsed(token) {
    const query = `
      UPDATE invites 
      SET is_used = true, used_at = CURRENT_TIMESTAMP 
      WHERE token = $1
      RETURNING *
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async findByCompany(companyId) {
    const query = `
      SELECT * FROM invites 
      WHERE company_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [companyId]);
    return result.rows;
  }

  static async findActiveByCompany(companyId) {
    const query = `
      SELECT * FROM invites 
      WHERE company_id = $1 AND is_used = false AND expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [companyId]);
    return result.rows;
  }

  static async cleanupExpired() {
    const query = `
      DELETE FROM invites 
      WHERE expires_at < CURRENT_TIMESTAMP AND is_used = false
      RETURNING *
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async revoke(token) {
    const query = `
      UPDATE invites 
      SET is_used = true, used_at = CURRENT_TIMESTAMP 
      WHERE token = $1 AND is_used = false
      RETURNING *
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }
}

module.exports = Invite; 