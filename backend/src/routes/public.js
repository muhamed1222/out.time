const express = require('express');
const Employee = require('../models/Employee');
const TimeRecord = require('../models/TimeRecord');
const Report = require('../models/Report');

const router = express.Router();

// Публичный тестовый маршрут (без аутентификации)
router.get('/employees/by-telegram/:telegramId', async (req, res) => {
  try {
    const telegramId = parseInt(req.params.telegramId);
    console.log('Поиск сотрудника по Telegram ID:', telegramId);
    
    const employee = await Employee.findByTelegramId(telegramId);
    console.log('Найден сотрудник:', employee);
    
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    // Получаем текущую дату в UTC
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setUTCHours(23, 59, 59, 999);

    // Получаем начало недели (понедельник) в UTC
    const weekStart = new Date(todayStart);
    weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay() + (weekStart.getUTCDay() === 0 ? -6 : 1));
    
    // Конец недели (воскресенье) в UTC
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    weekEnd.setUTCHours(23, 59, 59, 999);

    console.log('Период поиска:', {
      today: todayStart.toISOString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString()
    });

    // Получаем все необходимые данные
    const [todayRecord, todayReport, weekRecords, weekReports, recentReports] = await Promise.all([
      TimeRecord.findByEmployeeAndDateRange(employee.id, todayStart.toISOString(), todayEnd.toISOString()),
      Report.findByEmployeeAndDateRange(employee.id, todayStart.toISOString(), todayEnd.toISOString()),
      TimeRecord.findByEmployeeAndDateRange(employee.id, weekStart.toISOString(), weekEnd.toISOString()),
      Report.findByEmployeeAndDateRange(employee.id, weekStart.toISOString(), weekEnd.toISOString()),
      Report.findByEmployee(employee.id, 10)
    ]);

    console.log('Полученные данные:', {
      todayRecordCount: todayRecord.length,
      todayReportCount: todayReport.length,
      weekRecordsCount: weekRecords.length,
      weekReportsCount: weekReports.length,
      recentReportsCount: recentReports.length
    });

    // Подсчитываем статистику
    const workingDays = weekRecords.filter(record => 
      record.status === 'work' && record.start_time !== null
    ).length;

    let totalWorkMinutes = 0;
    weekRecords.forEach(record => {
      if (record.status === 'work' && record.start_time) {
        const startTime = new Date(record.start_time);
        const endTime = record.end_time ? new Date(record.end_time) : new Date();
        totalWorkMinutes += Math.floor((endTime - startTime) / (1000 * 60));
      }
    });

    const totalWorkHours = Math.floor(totalWorkMinutes / 60);
    const remainingMinutes = Math.round(totalWorkMinutes % 60);

    // Определяем текущий статус
    const currentRecord = todayRecord[0];
    let currentStatus = 'not_started';
    if (currentRecord) {
      if (currentRecord.end_time) {
        currentStatus = 'finished';
      } else if (currentRecord.start_time) {
        currentStatus = 'working';
      }
      if (currentRecord.status !== 'work') {
        currentStatus = currentRecord.status;
      }
    }

    const result = {
      employee,
      today: {
        status: currentStatus,
        timeRecord: currentRecord || null,
        report: todayReport[0] || null
      },
      weekStats: {
        workingDays,
        totalHours: `${totalWorkHours}ч ${remainingMinutes}мин`,
        reportsCount: weekReports.length
      },
      recentReports
    };

    console.log('Отправляем результат:', result);
    res.json(result);
  } catch (error) {
    console.error('Ошибка при поиске сотрудника:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 