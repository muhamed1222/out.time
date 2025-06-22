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
      setLoading(true);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadSettings}
          className="px-[16px] py-[10px] bg-[#101010] text-white text-[14px] font-semibold rounded-[30px] hover:bg-gray-800 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px]">
      <div className="mb-[20px]">
        <h1 className="text-[24px] font-semibold text-gray-900 leading-[32px]">Настройки</h1>
        <p className="text-[14px] text-[#727272]">Управление настройками компании</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[23px]">
        
        <div className="bg-[#f8f8f8] rounded-[16px] p-[22px]">
          <h3 className="text-[18px] font-semibold text-gray-900 mb-4">Уведомления</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время утреннего уведомления
              </label>
              <input 
                type="time" 
                name="morning_notification_time"
                className="w-full px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                value={settings.evening_notification_time}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f8f8f8] rounded-[16px] p-[22px]">
          <h3 className="text-[18px] font-semibold text-gray-900 mb-4">Информация о компании</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название компании
              </label>
              <input 
                type="text" 
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                placeholder="Название вашей компании"
                value={settings.name}
                onChange={handleChange}
              />
            </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-[16px] py-[10px] bg-[#101010] text-white text-[14px] font-semibold rounded-[30px] hover:bg-gray-800 transition-colors disabled:opacity-50"
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