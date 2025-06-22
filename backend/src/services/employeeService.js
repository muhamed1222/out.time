const Employee = require('../models/Employee');
const TimeRecord = require('../models/TimeRecord');
const Report = require('../models/Report');
const Invite = require('../models/Invite');

class EmployeeService {
  static async createInvite(companyId, employeeName) {
    // Создаем приглашение
    const invite = await Invite.create({
      companyId,
      employeeName
    });

    // Генерируем ссылку для Telegram бота
    const botUsername = process.env.BOT_USERNAME || 'outtime_bot';
    const inviteLink = `https://t.me/${botUsername}?start=${invite.token}`;

    return {
      invite,
      inviteLink
    };
  }

  static async registerEmployee(telegramId, name, inviteToken) {
    // Проверяем валидность токена
    const invite = await Invite.findValidByToken(inviteToken);
    if (!invite) {
      throw new Error('Недействительная или истекшая ссылка приглашения');
    }

    // Проверяем, не зарегистрирован ли уже сотрудник
    const existingEmployee = await Employee.findByTelegramId(telegramId);
    if (existingEmployee) {
      throw new Error('Вы уже зарегистрированы в системе');
    }

    // Создаем сотрудника
    const employee = await Employee.create({
      telegramId,
      name: name || invite.employee_name,
      companyId: invite.company_id
    });

    // Отмечаем приглашение как использованное
    await Invite.markAsUsed(inviteToken);

    return {
      employee,
      companyName: invite.company_name
    };
  }

  static async recordStartTime(telegramId, status = 'work') {
    const employee = await Employee.findByTelegramId(telegramId);
    if (!employee) {
      throw new Error('Сотрудник не найден. Обратитесь к администратору.');
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Проверяем, не зафиксировано ли уже время прихода сегодня
    const existingRecord = await TimeRecord.findByEmployeeAndDate(employee.id, today);
    if (existingRecord && existingRecord.start_time) {
      throw new Error('Время прихода уже зафиксировано на сегодня');
    }

    // Создаем или обновляем запись
    const timeRecord = existingRecord 
      ? await TimeRecord.updateStatus(employee.id, today, status)
      : await TimeRecord.create({
          employeeId: employee.id,
          date: today,
          startTime: new Date(),
          status
        });

    return {
      timeRecord,
      employee,
      message: this.getStartTimeMessage(status, timeRecord.start_time || new Date())
    };
  }

  static async recordEndTimeAndReport(telegramId, reportContent) {
    const employee = await Employee.findByTelegramId(telegramId);
    if (!employee) {
      throw new Error('Сотрудник не найден. Обратитесь к администратору.');
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Проверяем наличие записи времени за сегодня
    const timeRecord = await TimeRecord.findByEmployeeAndDate(employee.id, today);
    if (!timeRecord) {
      throw new Error('Сначала отметьтесь о начале рабочего дня');
    }

    if (timeRecord.end_time) {
      throw new Error('Рабочий день уже завершен');
    }

    // Обновляем время окончания
    const endTime = new Date();
    await TimeRecord.updateEndTime(employee.id, today, endTime);

    // Создаем отчет
    const report = await Report.create({
      employeeId: employee.id,
      date: today,
      content: reportContent
    });

    // Вычисляем отработанное время
    const workDuration = this.calculateWorkDuration(timeRecord.start_time, endTime);

    return {
      report,
      timeRecord: { ...timeRecord, end_time: endTime },
      workDuration,
      message: `Отчет принят! Сегодня отработано: ${workDuration}`
    };
  }

  static async getEmployeesByCompany(companyId) {
    return await Employee.findByCompany(companyId);
  }

  static async getEmployeeDetails(employeeId) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Сотрудник не найден');
    }

    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Получаем данные за сегодня
    const todayRecord = await TimeRecord.findByEmployeeAndDate(employeeId, today);
    const todayReport = await Report.findByEmployeeAndDate(employeeId, today);

    // Получаем статистику за неделю
    const weekRecords = await TimeRecord.findByEmployeeAndDateRange(employeeId, weekStartStr, today);
    const weekReports = await Report.findByEmployee(employeeId, 10, 0);

    return {
      employee,
      today: {
        timeRecord: todayRecord,
        report: todayReport
      },
      weekStats: {
        totalDays: weekRecords.length,
        totalHours: this.calculateTotalHours(weekRecords),
        reportsCount: weekReports.length
      },
      recentReports: weekReports.slice(0, 5)
    };
  }

  static getStartTimeMessage(status, startTime) {
    const timeStr = startTime.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    switch (status) {
      case 'work':
        return `✅ Отлично! Зафиксировал начало работы в ${timeStr}`;
      case 'late':
        return `⏰ Понял, опоздание зафиксировано. Начало в ${timeStr}`;
      case 'sick':
        return `🏥 Больничный отмечен. Выздоравливай!`;
      case 'vacation':
        return `🏖️ Отпуск зафиксирован. Хорошо отдохни!`;
      default:
        return `📝 Время начала зафиксировано: ${timeStr}`;
    }
  }

  static calculateWorkDuration(startTime, endTime) {
    const diffMs = new Date(endTime) - new Date(startTime);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}мин`;
  }

  static calculateTotalHours(timeRecords) {
    let totalMs = 0;
    
    timeRecords.forEach(record => {
      if (record.start_time && record.end_time) {
        totalMs += new Date(record.end_time) - new Date(record.start_time);
      }
    });

    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${totalHours}ч ${totalMinutes}мин`;
  }
}

module.exports = EmployeeService; 