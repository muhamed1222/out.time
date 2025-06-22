const Company = require('../models/Company');
const { body, validationResult } = require('express-validator');

class SettingsController {
  // Валидация для обновления настроек
  static validateSettings = [
    body('companyName')
      .optional()
      .isLength({ min: 2, max: 100 })
      .trim()
      .escape()
      .withMessage('Название компании должно содержать от 2 до 100 символов'),
    body('morningTime')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage('Неверный формат времени утреннего уведомления (HH:MM:SS)'),
    body('eveningTime')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
      .withMessage('Неверный формат времени вечернего уведомления (HH:MM:SS)'),
    body('timezone')
      .optional()
      .isLength({ min: 3, max: 50 })
      .withMessage('Неверный формат часового пояса')
  ];

  static async getSettings(req, res) {
    try {
      const companyId = req.user.companyId;
      
      const company = await Company.findById(companyId);
      
      if (!company) {
        return res.status(404).json({
          error: 'Компания не найдена'
        });
      }

      res.json({
        settings: {
          companyId: company.id,
          companyName: company.name,
          morningNotificationTime: company.morning_notification_time,
          eveningNotificationTime: company.evening_notification_time,
          timezone: company.timezone,
          createdAt: company.created_at,
          updatedAt: company.updated_at
        }
      });

    } catch (error) {
      console.error('Ошибка получения настроек:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении настроек'
      });
    }
  }

  static async updateSettings(req, res) {
    try {
      // Проверка валидации
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Ошибка валидации данных',
          details: errors.array()
        });
      }

      const companyId = req.user.companyId;
      const { 
        companyName, 
        morningTime, 
        eveningTime, 
        timezone 
      } = req.body;

      // Получаем текущие настройки
      const currentCompany = await Company.findById(companyId);
      if (!currentCompany) {
        return res.status(404).json({
          error: 'Компания не найдена'
        });
      }

      // Подготавливаем данные для обновления
      const updateData = {
        name: companyName || currentCompany.name,
        morningTime: morningTime || currentCompany.morning_notification_time,
        eveningTime: eveningTime || currentCompany.evening_notification_time,
        timezone: timezone || currentCompany.timezone
      };

      // Валидация времени
      if (updateData.morningTime === updateData.eveningTime) {
        return res.status(400).json({
          error: 'Время утреннего и вечернего уведомлений не может быть одинаковым'
        });
      }

      // Обновляем настройки
      const updatedCompany = await Company.update(companyId, updateData);

      res.json({
        message: 'Настройки успешно обновлены',
        settings: {
          companyId: updatedCompany.id,
          companyName: updatedCompany.name,
          morningNotificationTime: updatedCompany.morning_notification_time,
          eveningNotificationTime: updatedCompany.evening_notification_time,
          timezone: updatedCompany.timezone,
          updatedAt: updatedCompany.updated_at
        }
      });

    } catch (error) {
      console.error('Ошибка обновления настроек:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при обновлении настроек'
      });
    }
  }

  static async getNotificationPreview(req, res) {
    try {
      const companyId = req.user.companyId;
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