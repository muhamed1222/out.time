# 🔧 Исправление API подключения для outtime.outcasts.dev

## Проблема
API возвращает **HTTP 502: Bad Gateway** при попытке подключения к `https://outtime.outcasts.dev/api/public/health`

## Диагностика
Ошибка 502 означает, что:
1. Nginx получает запрос, но не может связаться с backend сервером на порту 3000
2. Backend сервер не запущен или недоступен
3. Неправильная конфигурация proxy в Nginx

## ✅ Решение

### Шаг 1: Обновить Nginx конфигурацию
Обновленная конфигурация уже создана в файле `nginx.conf`. Примените её:

```bash
# Скопировать конфигурацию в nginx
sudo cp nginx.conf /etc/nginx/sites-available/outtime.outcasts.dev
sudo ln -sf /etc/nginx/sites-available/outtime.outcasts.dev /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить nginx
sudo systemctl reload nginx
```

### Шаг 2: Создать .env файл для backend
На сервере создайте файл `.env` в папке backend:

```bash
cd /var/www/outtime.outcasts.dev/backend
cp env.example .env
```

Отредактируйте `.env` файл:
```env
# Настройки базы данных (Supabase)
DATABASE_URL=postgresql://postgres:8p8m6FS9nAWl5hxq@db.eokcyeyucknztfzrrwmc.supabase.co:5432/postgres

# JWT секрет
JWT_SECRET=YyKx7XjJ2r8wL!bFgV93TNnE^Z6Qv@pLwXbM9sD4uG^TkCzAqRhVt%JmXe5UzNd

# Telegram Bot токен
BOT_TOKEN=7702024149:AAEwYiA7qqhWkKIDpC-OQrfiHclX-sJ6gC4

# Настройки сервера
NODE_ENV=production
PORT=3000

# URL фронтенда (для CORS)
FRONTEND_URL=https://outtime.outcasts.dev

# API Base URL
API_BASE_URL=https://outtime.outcasts.dev

# Таймзона
TIMEZONE=Europe/Moscow
```

### Шаг 3: Установить зависимости и запустить backend

```bash
cd /var/www/outtime.outcasts.dev/backend

# Установить зависимости
npm install

# Или если используете pnpm
pnpm install

# Запустить сервер
npm start

# Или в фоновом режиме с pm2
pm2 start server.js --name "outtime-backend"
pm2 save
pm2 startup
```

### Шаг 4: Обновить frontend файлы
Скопируйте обновленные файлы frontend:

```bash
# Перейти в папку проекта
cd /path/to/your/project

# Собрать frontend (если не собран)
cd frontend
npm run build

# Скопировать собранные файлы на сервер
cp -r dist/* /var/www/outtime.outcasts.dev/public_html/
```

### Шаг 5: Проверить подключение

1. **Проверить статус backend:**
   ```bash
   curl http://localhost:3000/api/public/health
   ```

2. **Проверить через Nginx:**
   ```bash
   curl https://outtime.outcasts.dev/api/public/health
   ```

3. **Проверить в браузере:**
   - Откройте https://outtime.outcasts.dev
   - Перейдите на страницу "🎨 UI Компоненты" 
   - Нажмите кнопку "Тестировать подключение"

## 🔍 Обновленные компоненты

### Frontend изменения:
- ✅ **api.js** - улучшена логика определения API URL
- ✅ **ComponentsTest.jsx** - добавлен тест API подключения
- ✅ **Header.jsx** - добавлен ThemeToggle и улучшен дизайн
- ✅ **Layout.jsx** - добавлены Breadcrumbs
- ✅ **Sidebar.jsx** - поддержка темной темы

### Backend изменения:
- ✅ **app.js** - обновлены CORS настройки для outtime.outcasts.dev
- ✅ **routes/public.js** - добавлен health check endpoint

### Nginx изменения:
- ✅ **nginx.conf** - настроен для домена outtime.outcasts.dev
- ✅ Добавлены CORS заголовки для API
- ✅ Правильное проксирование к localhost:3000

## 🚀 Результат

После выполнения всех шагов:
- ✅ API будет доступен на `https://outtime.outcasts.dev/api`
- ✅ Health check вернет HTTP 200 с JSON ответом
- ✅ Frontend сможет подключиться к API
- ✅ Тест подключения в UI покажет статус "Подключено"

## 🔧 Отладка

Если проблемы остаются, проверьте:

1. **Логи Nginx:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Логи Backend:**
   ```bash
   pm2 logs outtime-backend
   ```

3. **Порты:**
   ```bash
   sudo netstat -tlnp | grep :3000
   ```

4. **База данных:** Убедитесь, что DATABASE_URL корректный

## 📞 Поддержка

При возникновении проблем проверьте:
- Все ли файлы скопированы
- Запущен ли backend сервер
- Правильные ли настройки в .env
- Доступна ли база данных 