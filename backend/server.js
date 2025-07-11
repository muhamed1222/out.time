require('dotenv').config();
const app = require('./src/app');
const { bot } = require('./src/bot');
const CronService = require('./src/services/cronService');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🚀 Запуск сервера Out Time...');

    // Проверяем обязательные переменные окружения
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'BOT_TOKEN'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Отсутствуют обязательные переменные окружения:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\n💡 Создайте файл .env с необходимыми переменными');
      
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.log('⚠️ Режим разработки: продолжаем без полной конфигурации');
      }
    }

    // Проверяем подключение к базе данных
    console.log('🔍 Проверка подключения к базе данных...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ Не удалось подключиться к базе данных');
        process.exit(1);
      } else {
        console.log('⚠️ Режим разработки: запускаем без БД (только для тестирования UI)');
      }
    }

    // Запускаем API сервер
    const server = app.listen(PORT, () => {
      console.log(`✅ API сервер запущен на порту ${PORT}`);
      console.log(`🌐 Swagger документация: http://localhost:${PORT}/api-docs`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/public/health`);
    });

    // Запускаем Telegram бота (пока отключен для тестирования)
    if (process.env.BOT_TOKEN) {
      try {
        console.log('🤖 Запуск Telegram бота...');
        await bot.launch();
        console.log('✅ Telegram бот запущен');
      } catch (error) {
        console.log('⚠️ Ошибка запуска бота (продолжаем без бота):', error.message);
        console.log('💡 Проверьте BOT_TOKEN в .env файле');
      }
    } else {
      console.log('⚠️ BOT_TOKEN не найден, пропускаем запуск бота');
    }

    // Инициализируем планировщик уведомлений (только если есть БД)
    if (dbConnected) {
      CronService.init();
    } else {
      console.log('⚠️ Пропускаем инициализацию планировщика (нет БД)');
    }

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n📡 Получен сигнал ${signal}, останавливаем сервер...`);
      
      if (process.env.BOT_TOKEN) {
        bot.stop(signal);
        console.log('✅ Telegram бот остановлен');
      }
      
      await new Promise((resolve) => {
      server.close(() => {
        console.log('✅ API сервер остановлен');
          resolve();
        });
      });

      console.log('👋 Сервер успешно завершен');
      process.exit(0);
    };

    // Обработчики сигналов завершения
    process.once('SIGINT', gracefulShutdown);
    process.once('SIGTERM', gracefulShutdown);

    console.log('\n🎉 Система Out Time запущена!');
    console.log('📊 Компоненты:');
    console.log('   ✅ API сервер (Express.js)');
    console.log(`   ${process.env.BOT_TOKEN ? '✅' : '⚠️'} Telegram бот`);
    console.log(`   ${dbConnected ? '✅' : '⚠️'} База данных PostgreSQL`);
    console.log(`   ${dbConnected ? '✅' : '⚠️'} Планировщик уведомлений`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🧪 Режим разработки активен');
      console.log('💡 Для тестирования используйте:');
      console.log('   - API: http://localhost:3000/api');
      console.log('   - Health check: http://localhost:3000/api/public/health');
      console.log('   - Frontend: http://localhost:5173');
    }

  } catch (error) {
    console.error('❌ Критическая ошибка при запуске сервера:', error);
    process.exit(1);
  }
}

// Обработчик необработанных исключений
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанное отклонение Promise:', reason);
  console.error('Promise:', promise);
  // Не завершаем процесс, просто логируем
});

process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

// Запускаем сервер
startServer(); 