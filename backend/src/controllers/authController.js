const { body, validationResult } = require('express-validator');
const AuthService = require('../services/authService');

class AuthController {
  // Валидация для регистрации
  static validateRegister = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Введите корректный email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль должен содержать минимум 6 символов'),
    body('companyName')
      .isLength({ min: 2, max: 100 })
      .trim()
      .escape()
      .withMessage('Название компании должно содержать от 2 до 100 символов')
  ];

  // Валидация для входа
  static validateLogin = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Введите корректный email'),
    body('password')
      .notEmpty()
      .withMessage('Пароль обязателен')
  ];

  static async register(req, res) {
    try {
      // Проверка валидации
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Ошибка валидации данных',
          details: errors.array()
        });
      }

      const { email, password, companyName } = req.body;

      const result = await AuthService.register({
        email,
        password,
        companyName
      });

      res.status(201).json({
        message: 'Компания и администратор успешно зарегистрированы',
        ...result
      });

    } catch (error) {
      console.error('Ошибка регистрации:', error.message);
      
      if (error.message.includes('уже существует')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Ошибка сервера при регистрации'
      });
    }
  }

  static async login(req, res) {
    try {
      // Проверка валидации
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Ошибка валидации данных',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      const result = await AuthService.login({ email, password });

      res.json({
        message: 'Успешная авторизация',
        ...result
      });

    } catch (error) {
      console.error('Ошибка авторизации:', error.message);
      
      if (error.message.includes('Неверный email или пароль')) {
        return res.status(401).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Ошибка сервера при авторизации'
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await AuthService.refreshToken(userId);

      res.json({
        message: 'Токен обновлен',
        ...result
      });

    } catch (error) {
      console.error('Ошибка обновления токена:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при обновлении токена'
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Текущий пароль и новый пароль обязательны'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'Новый пароль должен содержать минимум 6 символов'
        });
      }

      const result = await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.json(result);

    } catch (error) {
      console.error('Ошибка смены пароля:', error.message);
      
      if (error.message.includes('Неверный текущий пароль')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Ошибка сервера при смене пароля'
      });
    }
  }

  static async logout(req, res) {
    // В простой реализации с JWT просто возвращаем успех
    // В более сложной системе здесь можно добавить токен в blacklist
    res.json({
      message: 'Выход выполнен успешно'
    });
  }

  static async me(req, res) {
    try {
      // Информация о текущем пользователе уже доступна в req.user из middleware
      res.json({
        user: req.user
      });
    } catch (error) {
      console.error('Ошибка получения профиля:', error.message);
      res.status(500).json({
        error: 'Ошибка сервера при получении профиля'
      });
    }
  }
}

module.exports = AuthController; 