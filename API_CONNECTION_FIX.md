# 🔧 Исправление API подключения для outtime.outcasts.dev

## ❌ Проблема
API возвращает **HTTP 502: Bad Gateway** при попытке подключения к `https://outtime.outcasts.dev/api/public/health`

**Причина:** Backend сервер не запущен на порту 3000

## ⚡ Быстрое решение

### Автоматический запуск (рекомендуется)

1. **Подключитесь к серверу:**
   ```bash
   ssh your-username@outtime.outcasts.dev
   ```

2. **Перейдите в папку проекта:**
   ```bash
   cd /var/www/outtime.outcasts.dev/backend
   ```

3. **Создайте .env файл (если его нет):**
   ```bash
   cp env.example .env
   nano .env
   ```
   
   Вставьте эти настройки:
   ```env
   DATABASE_URL=postgresql://postgres:8p8m6FS9nAWl5hxq@db.eokcyeyucknztfzrrwmc.supabase.co:5432/postgres
   JWT_SECRET=YyKx7XjJ2r8wL!bFgV93TNnE^Z6Qv@pLwXbM9sD4uG^TkCzAqRhVt%JmXe5UzNd
   BOT_TOKEN=7702024149:AAEwYiA7qqhWkKIDpC-OQrfiHclX-sJ6gC4
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://outtime.outcasts.dev
   API_BASE_URL=https://outtime.outcasts.dev
   TIMEZONE=Europe/Moscow
   ```

4. **Запустите автоматический скрипт:**
   ```bash
   ./start-production.sh
   ```

**Готово!** 🎉 Скрипт автоматически:
- Проверит зависимости
- Протестирует базу данных
- Запустит сервер
- Проверит работоспособность

---

## 🔍 Диагностика

### Проверить статус сервера:
```bash
# Проверить процессы на порту 3000
sudo netstat -tlnp | grep :3000

# Проверить логи (если используется PM2)
pm2 logs outtime-backend

# Проверить health check локально
curl http://localhost:3000/api/public/health
```

### Проверить Nginx:
```bash
# Статус Nginx
sudo systemctl status nginx

# Логи Nginx
sudo tail -f /var/log/nginx/error.log

# Проверить через Nginx
curl -I https://outtime.outcasts.dev/api/public/health
```

---

## 🛠️ Ручной запуск (если автоскрипт не работает)

### Шаг 1: Установить зависимости
```bash
cd /var/www/outtime.outcasts.dev/backend
npm install
# или
pnpm install
```

### Шаг 2: Проверить базу данных
```bash
node test-db.js
```

### Шаг 3: Запустить сервер

**Вариант A: С PM2 (рекомендуется)**
```bash
# Установить PM2 если нет
npm install -g pm2

# Запустить
pm2 start server.js --name "outtime-backend"
pm2 save
pm2 startup

# Проверить статус
pm2 status
```

**Вариант B: В фоновом режиме**
```bash
nohup node server.js > server.log 2>&1 &
echo $! > server.pid
```

### Шаг 4: Проверить работу
```bash
curl http://localhost:3000/api/public/health
```

---

## ✅ Обновленные файлы

### 🆕 Новый файл: `backend/start-production.sh`
- Автоматический скрипт запуска
- Проверка зависимостей и базы данных
- Управление PM2
- Диагностика

### Frontend изменения:
- **api.js** - умное определение API URL для production
- **ComponentsTest.jsx** - тест API подключения
- **Header.jsx** - ThemeToggle и улучшенный дизайн  
- **Layout.jsx** - Breadcrumbs навигация
- **Sidebar.jsx** - поддержка темной темы

### Backend изменения:
- **app.js** - CORS для outtime.outcasts.dev
- **routes/public.js** - health check endpoint
- **test-db.js** - тест подключения к БД

### Nginx изменения:
- **nginx.conf** - настройка для outtime.outcasts.dev
- CORS заголовки для API
- Проксирование к localhost:3000

---

## 🚀 Результат

После запуска backend сервера:
- ✅ `curl https://outtime.outcasts.dev/api/public/health` вернет HTTP 200
- ✅ Тест API в UI покажет "Подключено"
- ✅ Все функции приложения заработают

## ⚠️ Частые проблемы

1. **Порт 3000 занят:** Скрипт автоматически завершит конфликтующий процесс
2. **База данных недоступна:** Проверьте DATABASE_URL в .env
3. **PM2 не найден:** Скрипт работает и без PM2
4. **Права доступа:** Запускайте скрипт от пользователя, который владеет файлами

## 📞 Поддержка

Если проблемы остаются:
1. Запустите: `./start-production.sh`
2. Проверьте логи: `pm2 logs outtime-backend`
3. Убедитесь, что .env файл создан с правильными настройками 