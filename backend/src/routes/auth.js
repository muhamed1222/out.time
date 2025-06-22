const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация новой компании
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - companyName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email администратора
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Пароль (минимум 8 символов)
 *               companyName:
 *                 type: string
 *                 description: Название компании
 *     responses:
 *       200:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Ошибка валидации или email уже существует
 */
router.post('/register', 
  AuthController.validateRegister, 
  AuthController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация администратора
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Неверные учетные данные
 */
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Не авторизован
 */
router.get('/me', 
  authenticateToken, 
  AuthController.me
);

module.exports = router; 