const Employee = require('../models/Employee');
const Report = require('../models/Report');
const TimeRecord = require('../models/TimeRecord');
const { subDays, format } = require('date-fns');

class DashboardService {
  /**
   * Генерирует "виртуальные" уведомления на основе данных компании.
   * @param {number} companyId - ID компании.
   * @returns {Promise<Array<object>>}
   */
  static async getNotifications(companyId) {
    const notifications = [];
    const now = new Date();

    // 1. Опоздавшие сегодня
    const lateEmployees = await TimeRecord.findLateToday(companyId);
    lateEmployees.forEach(record => {
      notifications.push({
        id: `late-${record.employee_id}-${record.date}`,
        type: 'late',
        message: `${record.employee_name} опоздал(а) сегодня.`,
        employee: {
          id: record.employee_id,
          name: record.employee_name,
        },
        timestamp: new Date(record.start_time).toISOString(),
      });
    });

    // 2. Не сдавшие отчет вчера
    const yesterday = format(subDays(now, 1), 'yyyy-MM-dd');
    const employeesWithoutReport = await Report.findEmployeesWithoutReport(companyId, yesterday);
    employeesWithoutReport.forEach(employee => {
       notifications.push({
        id: `no-report-${employee.id}-${yesterday}`,
        type: 'no_report',
        message: `${employee.name} не сдал(а) отчет за вчера.`,
        employee: {
          id: employee.id,
          name: employee.name,
        },
        timestamp: new Date(`${yesterday}T23:59:59`).toISOString(),
      });
    });
    
    // 3. Новые сотрудники за последние 24 часа
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const newEmployees = await Employee.findRecent(companyId, twentyFourHoursAgo);
    newEmployees.forEach(employee => {
        notifications.push({
            id: `new-${employee.id}`,
            type: 'new_employee',
            message: `Новый сотрудник ${employee.name} присоединился к компании.`,
            employee: {
                id: employee.id,
                name: employee.name,
            },
            timestamp: new Date(employee.created_at).toISOString(),
        });
    });


    // Сортируем уведомления от новых к старым
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return notifications;
  }
}

module.exports = DashboardService; 