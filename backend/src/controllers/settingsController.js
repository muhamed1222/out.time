const Company = require('../models/Company');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

class SettingsController {
  // Валидация для обновления настроек
  static validateSettings = [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .trim()
      .escape()
      .withMessage('Название компании должно содержать от 2 до 100 символов'),
    body('morning_notification_time')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Неверный формат времени утреннего уведомления (HH:MM)'),
    body('evening_notification_time')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Неверный формат времени вечернего уведомления (HH:MM)')
  ];

  static async getSettings(req, res) {
    try {
      console.log('Получение настроек для компании:', req.user.companyId);
      
      const companyId = req.user.companyId;
      
      // Проверяем существование компании
      const companyQuery = 'SELECT id FROM companies WHERE id = $1';
      const companyResult = await pool.query(companyQuery, [companyId]);
      
      if (companyResult.rows.length === 0) {
        console.log('Компания не найдена');
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      const query = `
        SELECT 
          name,
          to_char(morning_notification_time, 'HH24:MI') as morning_notification_time,
          to_char(evening_notification_time, 'HH24:MI') as evening_notification_time 
        FROM companies 
        WHERE id = $1
      `;
      
      console.log('SQL запрос:', query);
      console.log('Параметры:', [companyId]);
      
      const result = await pool.query(query, [companyId]);
      console.log('Результат запроса:', result.rows);
      
      if (result.rows.length === 0) {
        console.log('Компания не найдена');
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      console.log('Отправка настроек клиенту:', result.rows[0]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Ошибка получения настроек:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  static async updateSettings(req, res) {
    try {
      console.log('Обновление настроек. Тело запроса:', req.body);
      console.log('ID компании:', req.user.companyId);

      // Проверяем валидацию
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Ошибки валидации:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const companyId = req.user.companyId;
      
      // Проверяем существование компании
      const companyQuery = 'SELECT id FROM companies WHERE id = $1';
      const companyResult = await pool.query(companyQuery, [companyId]);
      
      if (companyResult.rows.length === 0) {
        console.log('Компания не найдена');
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      const { morning_notification_time, evening_notification_time, name } = req.body;

      // Добавляем секунды к времени для сохранения в базу
      const morningTime = morning_notification_time ? `${morning_notification_time}:00` : null;
      const eveningTime = evening_notification_time ? `${evening_notification_time}:00` : null;

      console.log('Подготовленные данные:', {
        morningTime,
        eveningTime,
        name,
        companyId
      });

      const query = `
        UPDATE companies 
        SET 
          morning_notification_time = COALESCE($1::time, morning_notification_time),
          evening_notification_time = COALESCE($2::time, evening_notification_time),
          name = COALESCE($3, name),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING 
          name,
          to_char(morning_notification_time, 'HH24:MI') as morning_notification_time,
          to_char(evening_notification_time, 'HH24:MI') as evening_notification_time
      `;

      console.log('SQL запрос:', query);
      console.log('Параметры запроса:', [morningTime, eveningTime, name || null, companyId]);

      const result = await pool.query(query, [
        morningTime,
        eveningTime,
        name || null,
        companyId
      ]);

      console.log('Результат запроса:', result.rows);

      if (result.rows.length === 0) {
        console.log('Компания не найдена при обновлении');
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      // Проверяем, что данные действительно обновились
      const verificationQuery = `
        SELECT 
          name,
          to_char(morning_notification_time, 'HH24:MI') as morning_notification_time,
          to_char(evening_notification_time, 'HH24:MI') as evening_notification_time 
        FROM companies 
        WHERE id = $1
      `;
      const verification = await pool.query(verificationQuery, [companyId]);
      console.log('Проверка обновленных данных:', verification.rows[0]);

      console.log('Отправка обновленных настроек клиенту:', result.rows[0]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  static async getNotificationPreview(req, res) {
    try {
      const companyId = req.user.companyId;
      
      // Проверяем существование компании
      const companyQuery = 'SELECT id FROM companies WHERE id = $1';
      const companyResult = await pool.query(companyQuery, [companyId]);
      
      if (companyResult.rows.length === 0) {
        console.log('Компания не найдена');
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      const company = await Company.findById(companyId);
      
      if (!company) {
        return res.status(404).json({
          error: 'Компания не найдена'
        });
      }

      // Генерируем превью уведомлений
      const morningPreview = {
        time: company.morning_notification_time,
        message: `🌅 Доброе утро!\nНачинаем рабочий день?\n\n[Да, начинаю] [Опоздаю] [Больничный/отпуск]`,
        description: 'Ежедневное утреннее уведомление для отметки начала работы'
      };

      const eveningPreview = {
        time: company.evening_notification_time,
        message: `🌆 Рабочий день завершается!\nРасскажи:\n\n1️⃣ Что сделал сегодня?\n2️⃣ Были ли проблемы?\n\nЖду твой отчет 👇`,
        description: 'Ежедневное вечернее уведомление для отправки отчета'
      };

      res.json({
        notifications: {
          morning: morningPreview,
          evening: eveningPreview
        },
        timezone: company.timezone,
        workingDays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
      });

    } catch (error) {
      console.error('Ошибка получения превью уведомлений:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении превью уведомлений'
      });
    }
  }

  static async getCompanyStats(req, res) {
    try {
      const companyId = req.user.companyId;
      
      // Проверяем существование компании
      const companyQuery = 'SELECT id FROM companies WHERE id = $1';
      const companyResult = await pool.query(companyQuery, [companyId]);
      
      if (companyResult.rows.length === 0) {
        console.log('Компания не найдена');
        return res.status(404).json({ error: 'Компания не найдена' });
      }
      
      const Employee = require('../models/Employee');
      const TimeRecord = require('../models/TimeRecord');
      const Report = require('../models/Report');
      const Invite = require('../models/Invite');

      // Получаем статистику компании
      const employees = await Employee.findByCompanyWithStats(companyId);
      const invites = await Invite.findByCompany(companyId);
      const today = new Date().toISOString().split('T')[0];
      const todayStats = await TimeRecord.getCompanyStats(companyId, today);

      const stats = {
        company: {
          totalEmployees: employees.length,
          activeEmployees: employees.filter(emp => emp.is_active).length,
          totalInvitesSent: invites.length,
          usedInvites: invites.filter(inv => inv.is_used).length
        },
        today: {
          workingEmployees: parseInt(todayStats.working_today) || 0,
          averageWorkHours: todayStats.avg_work_hours 
            ? parseFloat(todayStats.avg_work_hours).toFixed(1) 
            : '0.0'
        },
        allTime: {
          totalReports: employees.reduce((sum, emp) => sum + (parseInt(emp.total_reports) || 0), 0),
          averageReportsPerEmployee: employees.length > 0 
            ? (employees.reduce((sum, emp) => sum + (parseInt(emp.total_reports) || 0), 0) / employees.length).toFixed(1)
            : '0.0'
        }
      };

      res.json({ stats });

    } catch (error) {
      console.error('Ошибка получения статистики компании:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении статистики компании'
      });
    }
  }
}

module.exports = SettingsController; 