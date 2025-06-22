const User = require('../models/User');
const Company = require('../models/Company');
const { generateAuthTokens } = require('../utils/jwt');

class AuthService {
  static async register(userData) {
    const { email, password, companyName } = userData;

    // Проверяем существование пользователя
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Создаем компанию
    const company = await Company.create({ name: companyName });
    
    // Создаем пользователя
    const user = await User.create({
      email,
      password,
      companyId: company.id
    });

    // Генерируем токены
    const tokens = generateAuthTokens({
      id: user.id,
      email: user.email,
      company_id: company.id
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        companyId: company.id,
        companyName: company.name,
        createdAt: user.created_at
      },
      ...tokens
    };
  }

  static async login(credentials) {
    const { email, password } = credentials;

    // Находим пользователя
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    // Проверяем пароль
    const isValidPassword = await User.validatePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Неверный email или пароль');
    }

    // Обновляем время последнего входа
    await User.updateLastLogin(user.id);

    // Генерируем токены
    const tokens = generateAuthTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        companyId: user.company_id,
        companyName: user.company_name,
        lastLogin: new Date().toISOString()
      },
      ...tokens
    };
  }

  static async refreshToken(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const tokens = generateAuthTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        companyId: user.company_id,
        companyName: user.company_name
      },
      ...tokens
    };
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Проверяем текущий пароль
    const isValidPassword = await User.validatePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Неверный текущий пароль');
    }

    // Обновляем пароль
    await User.updatePassword(userId, newPassword);

    return { message: 'Пароль успешно изменен' };
  }
}

module.exports = AuthService; 