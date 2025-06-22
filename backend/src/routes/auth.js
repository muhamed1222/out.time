const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Регистрация компании и администратора
router.post('/register', 
  AuthController.validateRegister, 
  AuthController.register
);

// Вход в систему
router.post('/login', 
  AuthController.validateLogin, 
  AuthController.login
);

// Обновление токена (требует авторизации)
router.post('/refresh', 
  authenticateToken, 
  AuthController.refreshToken
);

// Смена пароля (требует авторизации)
router.post('/change-password', 
  authenticateToken, 
  AuthController.changePassword
);

// Выход из системы
router.post('/logout', 
  authenticateToken, 
  AuthController.logout
);

// Получение информации о текущем пользователе
router.get('/me', 
  authenticateToken, 
  AuthController.me
);

module.exports = router; 