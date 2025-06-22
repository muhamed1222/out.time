const express = require('express');
const ReportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют авторизации
router.use(authenticateToken);

// Получение списка отчетов с фильтрацией
router.get('/', ReportController.getReports);

// Экспорт отчетов в Excel
router.get('/export', ReportController.exportReports);

// Статистика по отчетам
router.get('/stats', ReportController.getReportStats);

// Получение конкретного отчета
router.get('/:id', ReportController.getReport);

module.exports = router; 