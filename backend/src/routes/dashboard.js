const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют авторизации
router.use(authenticateToken);

// Основные данные для главной панели
router.get('/', DashboardController.getDashboardData);

// Статистика за неделю
router.get('/weekly', DashboardController.getWeeklyStats);

// Быстрые действия и уведомления
router.get('/quick-actions', DashboardController.getQuickActions);

// Уведомления
router.get('/notifications', DashboardController.getNotifications);

module.exports = router; 