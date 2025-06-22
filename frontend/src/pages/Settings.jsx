import React, { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    morning_notification_time: '09:00',
    evening_notification_time: '18:00',
    name: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings({
        morning_notification_time: data.morning_notification_time || '09:00',
        evening_notification_time: data.evening_notification_time || '18:00',
        name: data.name || ''
      });
      setError(null);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      setError(error.response?.data?.error || 'Не удалось загрузить настройки');
      toast.error(error.response?.data?.error || 'Не удалось загрузить настройки');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success('Настройки успешно сохранены');
      setError(null);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      setError(error.response?.data?.error || 'Не удалось сохранить настройки');
      toast.error(error.response?.data?.error || 'Не удалось сохранить настройки');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600">Управление настройками компании</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Уведомления</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время утреннего уведомления
              </label>
              <input 
                type="time" 
                name="morning_notification_time"
                className="input-field max-w-32"
                value={settings.morning_notification_time}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время вечернего уведомления
              </label>
              <input 
                type="time" 
                name="evening_notification_time"
                className="input-field max-w-32"
                value={settings.evening_notification_time}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о компании</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название компании
              </label>
              <input 
                type="text" 
                name="name"
                className="input-field"
                placeholder="Название компании"
                value={settings.name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 