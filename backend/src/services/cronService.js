const cron = require('node-cron');
const { sendMorningNotification, sendEveningNotification } = require('../bot');
const Employee = require('../models/Employee');
const TimeRecord = require('../models/TimeRecord');

class CronService {
  static init() {
    console.log('🕐 Инициализация планировщика уведомлений...');

    // Утренние уведомления (9:00 AM, понедельник-пятница)
    cron.schedule('0 9 * * 1-5', async () => {
      console.log('🌅 Отправка утренних уведомлений...');
      await this.sendMorningNotifications();
    }, {
      timezone: "Europe/Moscow"
    });

    // Вечерние уведомления (6:00 PM, понедельник-пятница)
    cron.schedule('0 18 * * 1-5', async () => {
      console.log('🌆 Отправка вечерних уведомлений...');
      await this.sendEveningNotifications();
    }, {
      timezone: "Europe/Moscow"
    });

    // Напоминание для опоздавших (10:00 AM, понедельник-пятница)
    cron.schedule('0 10 * * 1-5', async () => {
      console.log('⏰ Отправка напоминаний опоздавшим...');
      await this.sendLateReminders();
    }, {
      timezone: "Europe/Moscow"
    });

    // Очистка просроченных приглашений (каждый день в полночь)
    cron.schedule('0 0 * * *', async () => {
      console.log('🧹 Очистка просроченных приглашений...');
      await this.cleanupExpiredInvites();
    }, {
      timezone: "Europe/Moscow"
    });

    console.log('✅ Планировщик уведомлений запущен');
    console.log('   📅 Утренние уведомления: 9:00 (пн-пт)');
    console.log('   📅 Вечерние уведомления: 18:00 (пн-пт)');
    console.log('   📅 Напоминания опоздавшим: 10:00 (пн-пт)');
    console.log('   📅 Очистка приглашений: 00:00 (ежедневно)');
  }

  static async sendMorningNotifications() {
    try {
      const employees = await Employee.findActive();
      let sentCount = 0;
      let errorCount = 0;

      for (const employee of employees) {
        try {
          // Проверяем, не отметился ли уже сотрудник сегодня
          const today = new Date().toISOString().split('T')[0];
          const existingRecord = await TimeRecord.findByEmployeeAndDate(employee.id, today);
          
          if (existingRecord && existingRecord.start_time) {
            console.log(`⏭️ Сотрудник ${employee.name} уже отметился сегодня`);
            continue;
          }

          await sendMorningNotification(employee.telegram_id, employee.name);
          sentCount++;
          
          // Добавляем небольшую задержку между отправками
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`❌ Ошибка отправки утреннего уведомления ${employee.name}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Утренние уведомления отправлены: ${sentCount} успешно, ${errorCount} ошибок`);

    } catch (error) {
      console.error('❌ Критическая ошибка при отправке утренних уведомлений:', error);
    }
  }

  static async sendEveningNotifications() {
    try {
      const employees = await Employee.findActive();
      const today = new Date().toISOString().split('T')[0];
      let sentCount = 0;
      let errorCount = 0;

      for (const employee of employees) {
        try {
          // Проверяем, есть ли запись о работе сегодня
          const timeRecord = await TimeRecord.findByEmployeeAndDate(employee.id, today);
          
          // Отправляем уведомление только тем, кто работал и не сдал отчет
          if (timeRecord && timeRecord.start_time && !timeRecord.end_time) {
            // Проверяем статус - отправляем только работающим
            if (timeRecord.status === 'work' || timeRecord.status === 'late') {
              await sendEveningNotification(employee.telegram_id, employee.name);
              sentCount++;
              
              // Добавляем небольшую задержку между отправками
              await new Promise(resolve => setTimeout(resolve, 100));
            } else {
              console.log(`⏭️ Сотрудник ${employee.name} не работает сегодня (${timeRecord.status})`);
            }
          } else {
            console.log(`⏭️ Сотрудник ${employee.name} не начинал работу или уже завершил день`);
          }

        } catch (error) {
          console.error(`❌ Ошибка отправки вечернего уведомления ${employee.name}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Вечерние уведомления отправлены: ${sentCount} успешно, ${errorCount} ошибок`);

    } catch (error) {
      console.error('❌ Критическая ошибка при отправке вечерних уведомлений:', error);
    }
  }

  static async sendLateReminders() {
    try {
      const employees = await Employee.findActive();
      const today = new Date().toISOString().split('T')[0];
      let sentCount = 0;

      for (const employee of employees) {
        try {
          // Проверяем, не отметился ли сотрудник до 10:00
          const timeRecord = await TimeRecord.findByEmployeeAndDate(employee.id, today);
          
          if (!timeRecord || !timeRecord.start_time) {
            // Отправляем напоминание
            const { bot } = require('../bot');
            await bot.telegram.sendMessage(
              employee.telegram_id,
              `⏰ Заметил, что вы еще не отметились на работе.
Все в порядке?

Если нужно отметиться, используйте кнопки ниже:`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: '🏢 Уже работаю', callback_data: 'start_work' },
                      { text: '⏰ Опоздаю', callback_data: 'start_late' }
                    ],
                    [
                      { text: '🏥 Больничный/отпуск', callback_data: 'sick_vacation' }
                    ]
                  ]
                }
              }
            );
            
            sentCount++;
            await new Promise(resolve => setTimeout(resolve, 100));
          }

        } catch (error) {
          console.error(`❌ Ошибка отправки напоминания ${employee.name}:`, error.message);
        }
      }

      console.log(`✅ Напоминания опоздавшим отправлены: ${sentCount}`);

    } catch (error) {
      console.error('❌ Критическая ошибка при отправке напоминаний:', error);
    }
  }

  static async cleanupExpiredInvites() {
    try {
      const Invite = require('../models/Invite');
      const deletedInvites = await Invite.cleanupExpired();
      
      console.log(`🧹 Очищено просроченных приглашений: ${deletedInvites.length}`);

    } catch (error) {
      console.error('❌ Ошибка очистки просроченных приглашений:', error);
    }
  }

  // Метод для ручного тестирования уведомлений
  static async testNotifications(telegramId) {
    try {
      console.log(`🧪 Тестирование уведомлений для ${telegramId}...`);
      
      const employee = await Employee.findByTelegramId(telegramId);
      if (!employee) {
        throw new Error('Сотрудник не найден');
      }

      // Тестируем утреннее уведомление
      await sendMorningNotification(telegramId, employee.name);
      console.log('✅ Утреннее уведомление отправлено');

      // Ждем 3 секунды и отправляем вечернее
      setTimeout(async () => {
        await sendEveningNotification(telegramId, employee.name);
        console.log('✅ Вечернее уведомление отправлено');
      }, 3000);

    } catch (error) {
      console.error('❌ Ошибка тестирования уведомлений:', error);
    }
  }
}

module.exports = CronService; 