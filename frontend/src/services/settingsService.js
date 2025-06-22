import api from './api';

export const settingsService = {
  // Получить текущие настройки компании
  getSettings: async () => {
    try {
      console.log('Запрос настроек...');
      const response = await api.get('/settings');
      console.log('Получены настройки:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения настроек:', error.response?.data || error);
      throw error;
    }
  },

  // Обновить настройки компании
  updateSettings: async (settings) => {
    try {
      console.log('Отправка настроек:', settings);
      const response = await api.put('/settings', settings);
      console.log('Ответ сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка обновления настроек:', error.response?.data || error);
      throw error;
    }
  }
};

export default settingsService; 