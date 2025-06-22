const Report = require('../models/Report');
const ExcelJS = require('exceljs');

class ReportController {
  static async getReports(req, res) {
    try {
      const companyId = req.user.companyId;
      const { 
        startDate, 
        endDate, 
        employeeId, 
        page = 1, 
        limit = 20 
      } = req.query;

      // Валидация дат
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 дней назад
      const end = endDate || new Date().toISOString().split('T')[0]; // сегодня

      // Получаем отчеты
      const reports = await Report.findByCompanyAndDateRange(
        companyId, 
        start, 
        end, 
        employeeId ? parseInt(employeeId) : null
      );

      // Пагинация
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginatedReports = reports.slice(offset, offset + parseInt(limit));

      res.json({
        reports: paginatedReports.map(report => ({
          id: report.id,
          employeeName: report.employee_name,
          employeeId: report.employee_id,
          content: report.content,
          date: report.date,
          createdAt: report.created_at
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(reports.length / parseInt(limit)),
          totalReports: reports.length,
          hasNext: offset + parseInt(limit) < reports.length,
          hasPrev: parseInt(page) > 1
        },
        filters: {
          startDate: start,
          endDate: end,
          employeeId: employeeId || null
        }
      });

    } catch (error) {
      console.error('Ошибка получения отчетов:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении отчетов'
      });
    }
  }

  static async exportReports(req, res) {
    try {
      const companyId = req.user.companyId;
      const { startDate, endDate, employeeId } = req.query;

      // Валидация дат
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];

      // Получаем отчеты
      const reports = await Report.findByCompanyAndDateRange(
        companyId, 
        start, 
        end, 
        employeeId ? parseInt(employeeId) : null
      );

      // Создаем Excel файл
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Отчеты сотрудников');

      // Заголовки
      worksheet.columns = [
        { header: 'Дата', key: 'date', width: 12 },
        { header: 'Сотрудник', key: 'employee', width: 20 },
        { header: 'Отчет', key: 'content', width: 50 },
        { header: 'Время создания', key: 'created', width: 20 }
      ];

      // Стилизация заголовков
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };

      // Добавляем данные
      reports.forEach(report => {
        worksheet.addRow({
          date: new Date(report.date).toLocaleDateString('ru-RU'),
          employee: report.employee_name,
          content: report.content,
          created: new Date(report.created_at).toLocaleString('ru-RU')
        });
      });

      // Настройка переноса текста для колонки отчетов
      worksheet.getColumn('content').alignment = { wrapText: true, vertical: 'top' };

      // Устанавливаем заголовки ответа
      const fileName = `reports_${start}_${end}.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Отправляем файл
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Ошибка экспорта отчетов:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при экспорте отчетов'
      });
    }
  }

  static async getReportStats(req, res) {
    try {
      const companyId = req.user.companyId;
      const { startDate, endDate } = req.query;

      // Валидация дат
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];

      // Получаем отчеты за период
      const reports = await Report.findByCompanyAndDateRange(companyId, start, end);

      // Группируем по сотрудникам
      const employeeStats = {};
      reports.forEach(report => {
        if (!employeeStats[report.employee_id]) {
          employeeStats[report.employee_id] = {
            employeeName: report.employee_name,
            totalReports: 0,
            avgLength: 0,
            totalWords: 0
          };
        }
        
        const stats = employeeStats[report.employee_id];
        stats.totalReports++;
        stats.totalWords += report.content.split(' ').length;
        stats.avgLength = Math.round(stats.totalWords / stats.totalReports);
      });

      // Статистика по дням
      const dailyStats = {};
      reports.forEach(report => {
        const date = report.date;
        if (!dailyStats[date]) {
          dailyStats[date] = 0;
        }
        dailyStats[date]++;
      });

      res.json({
        summary: {
          totalReports: reports.length,
          uniqueEmployees: Object.keys(employeeStats).length,
          avgReportsPerEmployee: reports.length / Math.max(Object.keys(employeeStats).length, 1),
          dateRange: { start, end }
        },
        employeeStats: Object.values(employeeStats),
        dailyStats: Object.entries(dailyStats).map(([date, count]) => ({
          date,
          reportsCount: count
        })).sort((a, b) => a.date.localeCompare(b.date))
      });

    } catch (error) {
      console.error('Ошибка получения статистики отчетов:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении статистики отчетов'
      });
    }
  }

  static async getReport(req, res) {
    try {
      const reportId = parseInt(req.params.id);
      const companyId = req.user.companyId;

      if (!reportId) {
        return res.status(400).json({
          error: 'Неверный ID отчета'
        });
      }

      // Получаем отчет с проверкой принадлежности к компании
      const reports = await Report.findByCompanyAndDateRange(
        companyId, 
        '1970-01-01', 
        '2099-12-31'
      );
      
      const report = reports.find(r => r.id === reportId);
      
      if (!report) {
        return res.status(404).json({
          error: 'Отчет не найден'
        });
      }

      res.json({
        report: {
          id: report.id,
          employeeName: report.employee_name,
          employeeId: report.employee_id,
          content: report.content,
          date: report.date,
          createdAt: report.created_at,
          wordCount: report.content.split(' ').length
        }
      });

    } catch (error) {
      console.error('Ошибка получения отчета:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении отчета'
      });
    }
  }
}

module.exports = ReportController; 