# Инструкция по деплою Out Time на ISPmanager

## 1. Подготовка проекта

### 1.1 Сборка фронтенда
```bash
cd frontend
pnpm install
pnpm build
```

### 1.2 Подготовка бэкенда
```bash
cd backend
pnpm install
```

## 2. Настройка ISPmanager

### 2.1 Создание домена
1. Войдите в панель ISPmanager
2. Создайте новый домен или поддомен
3. Включите поддержку Node.js для домена

### 2.2 Настройка базы данных PostgreSQL
1. В ISPmanager создайте новую базу данных PostgreSQL
2. Запишите данные подключения:
   - Имя базы данных
   - Пользователь
   - Пароль
   - Хост (обычно localhost)

### 2.3 Настройка переменных окружения
1. Скопируйте файл `backend/env.production.example` в `backend/.env`
2. Заполните все переменные:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/outtime_db
   JWT_SECRET=your_super_secret_jwt_key_here
   BOT_TOKEN=your_telegram_bot_token_here
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://your-domain.com
   ```

## 3. Загрузка файлов

### 3.1 Структура файлов на сервере
```
public_html/
├── index.html (из frontend/dist/)
├── assets/ (из frontend/dist/)
├── .htaccess
└── backend/
    ├── server.js
    ├── package.json
    ├── ecosystem.config.js
    ├── .env
    ├── src/
    ├── migrations/
    └── logs/
```

### 3.2 Загрузка через FTP/SFTP
1. Загрузите все файлы из `frontend/dist/` в корень `public_html/`
2. Загрузите папку `backend/` в `public_html/backend/`
3. Загрузите `.htaccess` в корень `public_html/`

## 4. Настройка Node.js приложения

### 4.1 Установка зависимостей
```bash
cd public_html/backend
pnpm install --production
```

### 4.2 Настройка базы данных
```bash
cd public_html/backend
node migrations/migrate.js
```

### 4.3 Запуск приложения через PM2
```bash
cd public_html/backend
pnpm run pm2:start
```

## 5. Настройка Telegram Bot

### 5.1 Настройка webhook
После запуска приложения настройте webhook для Telegram бота:
```
https://your-domain.com/bot/webhook
```

### 5.2 Проверка работы бота
Отправьте команду `/start` боту для проверки подключения.

## 6. Настройка Apache/Nginx

### 6.1 Проверка .htaccess
Убедитесь, что файл `.htaccess` корректно настроен для проксирования API запросов.

### 6.2 Настройка SSL (если необходимо)
В ISPmanager включите SSL для домена.

## 7. Проверка работы

### 7.1 Проверка API
```bash
curl https://your-domain.com/api/health
```

### 7.2 Проверка фронтенда
Откройте сайт в браузере и проверьте:
- Загрузку главной страницы
- Работу авторизации
- API запросы

### 7.3 Проверка бота
Отправьте команду `/start` в Telegram боте.

## 8. Мониторинг и логи

### 8.1 Просмотр логов PM2
```bash
cd public_html/backend
pnpm run pm2:logs
```

### 8.2 Просмотр логов приложения
```bash
cd public_html/backend
tail -f logs/combined.log
```

### 8.3 Управление процессом
```bash
# Перезапуск
pnpm run pm2:restart

# Остановка
pnpm run pm2:stop

# Статус
pm2 status
```

## 9. Обновление приложения

### 9.1 Обновление фронтенда
1. Соберите новую версию: `pnpm build`
2. Загрузите файлы из `frontend/dist/` в `public_html/`

### 9.2 Обновление бэкенда
1. Загрузите новые файлы в `public_html/backend/`
2. Установите зависимости: `pnpm install --production`
3. Примените миграции: `node migrations/migrate.js`
4. Перезапустите приложение: `pnpm run pm2:restart`

## 10. Резервное копирование

### 10.1 База данных
```bash
pg_dump -h localhost -U username -d outtime_db > backup.sql
```

### 10.2 Файлы приложения
Создайте архив папки `public_html/backend/`

## 11. Устранение неполадок

### 11.1 Приложение не запускается
1. Проверьте логи: `pnpm run pm2:logs`
2. Проверьте переменные окружения
3. Убедитесь, что порт 3000 свободен

### 11.2 API не отвечает
1. Проверьте .htaccess файл
2. Убедитесь, что Node.js приложение запущено
3. Проверьте настройки прокси в ISPmanager

### 11.3 Проблемы с базой данных
1. Проверьте подключение к PostgreSQL
2. Убедитесь, что миграции применены
3. Проверьте права доступа пользователя БД

## 12. Безопасность

### 12.1 Обязательные меры
- Используйте HTTPS
- Настройте сложные пароли
- Регулярно обновляйте зависимости
- Настройте брандмауэр

### 12.2 Мониторинг
- Регулярно проверяйте логи
- Настройте уведомления об ошибках
- Мониторьте использование ресурсов 