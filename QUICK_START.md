# ⚡ Быстрый запуск OutTime Backend

## Проблема: HTTP 502 Bad Gateway

**Причина:** Backend сервер не запущен на порту 3000

## 🚀 Решение за 3 шага

### 1. Подключиться к серверу
```bash
ssh your-username@outtime.outcasts.dev
cd /var/www/outtime.outcasts.dev/backend
```

### 2. Создать .env (если нет)
```bash
cp env.example .env
```

Содержимое .env:
```
DATABASE_URL=postgresql://postgres:8p8m6FS9nAWl5hxq@db.eokcyeyucknztfzrrwmc.supabase.co:5432/postgres
JWT_SECRET=YyKx7XjJ2r8wL!bFgV93TNnE^Z6Qv@pLwXbM9sD4uG^TkCzAqRhVt%JmXe5UzNd
BOT_TOKEN=7702024149:AAEwYiA7qqhWkKIDpC-OQrfiHclX-sJ6gC4
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://outtime.outcasts.dev
```

### 3. Запустить автоскрипт
```bash
./start-production.sh
```

## ✅ Проверка
```bash
curl https://outtime.outcasts.dev/api/public/health
```

**Должен вернуть JSON с status: "OK"**

---

## 🛠️ Альтернативный запуск

Если автоскрипт не работает:

```bash
# Установить зависимости
npm install

# Запустить с PM2
pm2 start server.js --name outtime-backend
pm2 save

# Или обычным способом
node server.js
```

## 📊 Диагностика

```bash
# Проверить порт 3000
sudo netstat -tlnp | grep :3000

# Логи PM2
pm2 logs outtime-backend

# Статус процессов
pm2 status
```

---

**После запуска backend API будет работать!** 🎉 