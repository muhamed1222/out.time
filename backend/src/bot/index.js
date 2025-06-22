const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const startHandler = require('./handlers/startHandler');
const reportHandler = require('./handlers/reportHandler');
const statusHandler = require('./handlers/statusHandler');
const { morningKeyboard, eveningKeyboard } = require('./keyboards/inline');

if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не установлен в переменных окружения');
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware для логирования
bot.use((ctx, next) => {
  const user = ctx.from;
  const message = ctx.message?.text || ctx.callbackQuery?.data || 'callback';
  console.log(`[${new Date().toISOString()}] ${user.first_name} (${user.id}): ${message}`);
  return next();
});

// Middleware для обработки ошибок
bot.catch((err, ctx) => {
  console.error('Ошибка в боте:', err);
  ctx.reply('😔 Произошла ошибка. Попробуйте позже или обратитесь к администратору.');
});

// Команды
bot.start(startHandler);
bot.command('status', statusHandler);
bot.command('help', (ctx) => {
  ctx.reply(`
🤖 *Бот учета рабочего времени Out Time*

📝 *Доступные команды:*
/start - Регистрация в системе
/status - Текущий статус работы
/help - Эта справка

⏰ *Как это работает:*
• Каждый день в 9:00 я буду спрашивать о начале работы
• В 18:00 - попрошу отчет о проделанной работе
• Отчеты можно отправлять текстовыми сообщениями

💡 *Совет:* Описывайте в отчетах конкретные выполненные задачи
  `, { parse_mode: 'Markdown' });
});

// Обработчики кнопок
bot.action('start_work', async (ctx) => {
  await ctx.answerCbQuery();
  await handleWorkStart(ctx, 'work');
});

bot.action('start_late', async (ctx) => {
  await ctx.answerCbQuery();
  await handleWorkStart(ctx, 'late');
});

bot.action('sick_vacation', async (ctx) => {
  await ctx.answerCbQuery();
  await handleSickVacation(ctx);
});

bot.action('working_longer', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`💪 Понял, продолжаете работать.
Напомнить через час об отчете?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⏰ Да, через час', callback_data: 'remind_hour' },
          { text: '✅ Уведомлю сам', callback_data: 'no_remind' }
        ]
      ]
    }
  });
});

bot.action('already_finished', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`📝 Отлично! Отправьте отчет о проделанной работе:

1️⃣ Что сделали сегодня?
2️⃣ Были ли проблемы?

Жду ваш текстовый отчет 👇`);
});

bot.action('remind_hour', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply('⏰ Хорошо, напомню через час!');
  // Здесь можно добавить логику отложенного напоминания
});

bot.action('no_remind', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply('👌 Понял, ждем ваш отчет когда будете готовы!');
});

// Обработчик текстовых сообщений (отчеты)
bot.on('text', reportHandler);

// Функции обработки действий
async function handleWorkStart(ctx, status) {
  try {
    const telegramId = ctx.from.id;
    
    // Отправляем запрос к API
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:3000'}/api/bot/start-day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        telegram_id: telegramId,
        status: status
      })
    });

    const data = await response.json();

    if (data.success) {
      ctx.reply(data.message);
    } else {
      ctx.reply(`❌ ${data.error}`);
    }

  } catch (error) {
    console.error('Ошибка при отметке начала работы:', error);
    ctx.reply('😔 Произошла ошибка при отметке времени. Попробуйте позже.');
  }
}

async function handleSickVacation(ctx) {
  ctx.reply(`🏥 Укажите тип отсутствия:`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🤒 Больничный', callback_data: 'sick_day' },
          { text: '🏖️ Отпуск', callback_data: 'vacation_day' }
        ],
        [
          { text: '📝 Другое', callback_data: 'other_absence' }
        ]
      ]
    }
  });
}

bot.action(['sick_day', 'vacation_day', 'other_absence'], async (ctx) => {
  await ctx.answerCbQuery();
  
  const statusMap = {
    'sick_day': 'sick',
    'vacation_day': 'vacation',
    'other_absence': 'other'
  };

  const messageMap = {
    'sick_day': '🤒 Больничный отмечен. Выздоравливайте!',
    'vacation_day': '🏖️ Отпуск зафиксирован. Хорошо отдохните!',
    'other_absence': '📝 Отсутствие отмечено.'
  };

  try {
    const telegramId = ctx.from.id;
    const status = statusMap[ctx.callbackQuery.data];
    
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:3000'}/api/bot/start-day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        telegram_id: telegramId,
        status: status
      })
    });

    const data = await response.json();

    if (data.success) {
      ctx.reply(messageMap[ctx.callbackQuery.data]);
    } else {
      ctx.reply(`❌ ${data.error}`);
    }

  } catch (error) {
    console.error('Ошибка при отметке отсутствия:', error);
    ctx.reply('😔 Произошла ошибка. Попробуйте позже.');
  }
});

// Функция для отправки утренних уведомлений
async function sendMorningNotification(telegramId, employeeName) {
  try {
    await bot.telegram.sendMessage(
      telegramId,
      `🌅 Доброе утро, ${employeeName}!
Начинаем рабочий день?`,
      morningKeyboard
    );
  } catch (error) {
    console.error(`Ошибка отправки утреннего уведомления ${telegramId}:`, error);
  }
}

// Функция для отправки вечерних уведомлений
async function sendEveningNotification(telegramId, employeeName) {
  try {
    await bot.telegram.sendMessage(
      telegramId,
      `🌆 ${employeeName}, рабочий день подходит к концу!

Расскажите, чем занимались сегодня:
1️⃣ Что сделали?
2️⃣ Были ли проблемы?

Жду ваш отчет 👇`,
      eveningKeyboard
    );
  } catch (error) {
    console.error(`Ошибка отправки вечернего уведомления ${telegramId}:`, error);
  }
}

// Экспорт бота и функций уведомлений
module.exports = {
  bot,
  sendMorningNotification,
  sendEveningNotification
}; 