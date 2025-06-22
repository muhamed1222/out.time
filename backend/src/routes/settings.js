const express = require('express');
const SettingsController = require('../controllers/settingsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют авторизации
router.use(authenticateToken);

// Получение настроек компании
router.get('/', SettingsController.getSettings);

// Обновление настроек компании
router.put('/', 
  SettingsController.validateSettings,
  SettingsController.updateSettings
);

// Превью уведомлений
router.get('/notifications/preview', SettingsController.getNotificationPreview);

// Статистика компании
router.get('/stats', SettingsController.getCompanyStats);

module.exports = router; 