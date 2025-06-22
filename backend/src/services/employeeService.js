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
    const botUsername = process.env.BOT_USERNAME || 'outtimeagency_bot';
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

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setUTCHours(23, 59, 59, 999);

    const weekStart = new Date(todayStart);
    weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay() + (weekStart.getUTCDay() === 0 ? -6 : 1));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    weekEnd.setUTCHours(23, 59, 59, 999);

    const [todayRecords, todayReports, weekRecords, weekReports, recentReports] = await Promise.all([
      TimeRecord.findByEmployeeAndDateRange(employeeId, todayStart.toISOString(), todayEnd.toISOString()),
      Report.findByEmployeeAndDateRange(employeeId, todayStart.toISOString(), todayEnd.toISOString()),
      TimeRecord.findByEmployeeAndDateRange(employeeId, weekStart.toISOString(), weekEnd.toISOString()),
      Report.findByEmployeeAndDateRange(employeeId, weekStart.toISOString(), weekEnd.toISOString()),
      Report.findByEmployee(employeeId, 10)
    ]);
    
    const todayRecord = todayRecords[0];
    const todayReport = todayReports[0];

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

    let currentStatus = 'not_started';
    if (todayRecord) {
      if (todayRecord.end_time) {
        currentStatus = 'finished';
      } else if (todayRecord.start_time) {
        currentStatus = 'working';
      }
      if (todayRecord.status !== 'work') {
        currentStatus = todayRecord.status;
      }
    }

    return {
      employee,
      today: {
        status: currentStatus,
        timeRecord: todayRecord,
        report: todayReport
      },
      weekStats: {
        workingDays,
        totalHours: `${totalWorkHours}ч ${remainingMinutes}мин`,
        reportsCount: weekReports.length
      },
      recentReports
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