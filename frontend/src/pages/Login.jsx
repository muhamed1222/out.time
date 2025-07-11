import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../components/ui';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.log('Login error:', error);
      setError(error.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    setFormData({
      email: 'test@example.com',
      password: 'password123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Логотип */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Out Time
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Система учета рабочего времени
          </p>
        </div>

        {/* Dev Mode подсказка */}
        {import.meta.env.DEV && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 dark:text-yellow-400 text-lg">
                  🧪
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Режим разработки
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                    БД может быть недоступна. Используйте тестовые данные:
                  </p>
                  <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded mb-2">
                    Email: test@example.com<br />
                    Пароль: password123
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleMockLogin}
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-300 dark:border-yellow-600 dark:hover:bg-yellow-900/30"
                  >
                    Заполнить тестовые данные
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Форма входа */}
        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />

              <Input
                label="Пароль"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                required
              />

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </p>
                  {error.includes('Mock-режим') && (
                    <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                      💡 Попробуйте test@example.com / password123
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Нет аккаунта?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Дополнительная информация для разработки */}
        {import.meta.env.DEV && (
          <Card className="border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">
                🔧 Для разработчиков
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Сервер работает без БД в mock-режиме</p>
                <p>• API доступен на http://localhost:3000</p>
                <p>• Используйте тестовые данные для входа</p>
                <p>• Переключитесь на страницу "🎨 UI Компоненты" для диагностики</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login; 