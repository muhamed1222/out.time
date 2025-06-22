require('dotenv').config();
const CronService = require('./src/services/cronService');

// Получаем Telegram ID из аргументов командной строки
const telegramId = process.argv[2];

if (!telegramId) {
  console.error('❌ Укажите Telegram ID пользователя в аргументах');
  console.error('Пример: node test_notifications.js 123456789');
  process.exit(1);
}

console.log('🧪 Тестирование уведомлений...');
console.log('📱 Telegram ID:', telegramId);

CronService.testNotifications(telegramId)
  .then(() => {
    console.log('✅ Тест завершен');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }); 