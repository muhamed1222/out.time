const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const authService = require('../services/authService');

const router = express.Router();

// Mock данные для разработки без БД
const mockUsers = [
  {
    id: 1,
    name: 'Тестовый Пользователь',
    email: 'test@example.com',
    password: '$2a$10$example.hash.for.password123', // hash для "password123"
    position: 'Разработчик',
    company: {
      id: 1,
      name: 'Тестовая Компания',
      subscription_type: 'premium'
    }
  }
];

// Функция проверки доступности БД
const isDatabaseAvailable = async () => {
  try {
    const { testConnection } = require('../config/database');
    return await testConnection();
  } catch (error) {
    return false;
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
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
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Неверный email или пароль
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация входных данных
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email и пароль обязательны'
      });
    }

    // Проверяем доступность БД
    const dbAvailable = await isDatabaseAvailable();
    
    if (!dbAvailable && process.env.NODE_ENV !== 'production') {
      console.log('🧪 Mock-режим: БД недоступна, используем тестовые данные');
      
      // Mock авторизация для разработки
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser = mockUsers[0];
        const token = jwt.sign(
          { 
            userId: mockUser.id, 
            email: mockUser.email,
            companyId: mockUser.company.id 
          },
          process.env.JWT_SECRET || 'dev-secret',
          { expiresIn: '7d' }
        );

        return res.json({
          token,
          user: {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            position: mockUser.position,
            company: mockUser.company
          }
        });
      } else {
        return res.status(401).json({
          error: 'Mock-режим: используйте test@example.com / password123'
        });
      }
    }

    // Обычная авторизация через БД
    const user = await User.findOne({
      where: { email },
      include: [Company]
    });

    if (!user) {
      return res.status(401).json({
        error: 'Неверный email или пароль'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Неверный email или пароль'
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        companyId: user.companyId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        company: user.Company
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - companyName
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               companyName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 */
router.post('/register', async (req, res) => {
  try {
    const dbAvailable = await isDatabaseAvailable();
    
    if (!dbAvailable && process.env.NODE_ENV !== 'production') {
      return res.status(503).json({
        error: 'Mock-режим: регистрация недоступна без БД',
        suggestion: 'Используйте test@example.com / password123 для входа'
      });
    }

    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message.includes('уже существует')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    
    const dbAvailable = await isDatabaseAvailable();
    
    if (!dbAvailable && process.env.NODE_ENV !== 'production') {
      // Mock режим
      const mockUser = mockUsers.find(u => u.id === decoded.userId);
      if (mockUser) {
        return res.json({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          position: mockUser.position,
          company: mockUser.company
        });
      }
    }

    // Обычный режим с БД
    const user = await User.findByPk(decoded.userId, {
      include: [Company]
    });

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      position: user.position,
      company: user.Company
    });

  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

module.exports = router; 