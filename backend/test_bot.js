require('dotenv').config();
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log('🤖 Тестирование Telegram бота...');
console.log('BOT_TOKEN:', BOT_TOKEN ? BOT_TOKEN.substring(0, 10) + '...' : 'НЕ НАЙДЕН');

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Простой тест - попробуем получить информацию о боте
bot.telegram.getMe()
  .then((botInfo) => {
    console.log('✅ Бот найден:', botInfo);
    console.log('📝 Имя бота:', botInfo.first_name);
    console.log('🔗 Username:', botInfo.username);
    console.log('🆔 ID:', botInfo.id);
    
    // Попробуем запустить бота
    return bot.launch();
  })
  .then(() => {
    console.log('✅ Бот успешно запущен!');
    console.log('💡 Попробуйте отправить ему /start');
    
    // Простой обработчик
    bot.start((ctx) => {
      ctx.reply('🎉 Привет! Бот Out Time работает!');
    });
    
  })
  .catch((error) => {
    console.error('❌ Ошибка бота:', error);
    
    if (error.response) {
      console.error('📡 Ответ сервера:', error.response);
    }
    
    if (error.message.includes('401')) {
      console.error('🔑 Проблема с токеном - проверьте BOT_TOKEN');
    } else if (error.message.includes('404')) {
      console.error('🔍 Бот не найден - возможно токен неверный');
    } else if (error.message.includes('Network')) {
      console.error('🌐 Проблема сети - проверьте интернет');
    }
    
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 