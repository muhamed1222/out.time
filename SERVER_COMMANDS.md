# 🔧 SSH команды для администратора сервера

## ⚡ Быстрое решение 502 Bad Gateway

### 1. Подключение к серверу
```bash
ssh your-username@outtime.outcasts.dev
# или IP адрес
ssh your-username@SERVER_IP
```

### 2. Переход в папку проекта
```bash
cd /var/www/outtime.outcasts.dev/backend
```

### 3. Проверка текущего состояния
```bash
# Проверить, запущен ли сервер на порту 3000
sudo netstat -tlnp | grep :3000

# Проверить процессы Node.js
ps aux | grep node

# Проверить статус PM2 (если используется)
pm2 status
```

### 4. Создание .env файла (если отсутствует)
```bash
# Скопировать пример
cp env.example .env

# Отредактировать настройки
nano .env
```

**Содержимое .env:**
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

### 5. Автоматический запуск
```bash
# Запустить автоскрипт
./start-production.sh

# Если скрипт не исполняемый
chmod +x start-production.sh
./start-production.sh
```

### 6. Ручной запуск (если автоскрипт не работает)
```bash
# Установить зависимости
npm install

# Тест базы данных
node test-db.js

# Запуск с PM2 (рекомендуется)
pm2 start server.js --name outtime-backend
pm2 save
pm2 startup

# Или простой запуск в фоне
nohup node server.js > server.log 2>&1 &
```

### 7. Проверка работы
```bash
# Проверить локально
curl http://localhost:3000/api/public/health

# Проверить через Nginx
curl https://outtime.outcasts.dev/api/public/health

# Посмотреть логи PM2
pm2 logs outtime-backend

# Посмотреть логи Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 🛠️ Управление процессами

### PM2 команды
```bash
# Статус всех процессов
pm2 status

# Логи конкретного процесса
pm2 logs outtime-backend

# Рестарт процесса
pm2 restart outtime-backend

# Остановка процесса
pm2 stop outtime-backend

# Удаление процесса
pm2 delete outtime-backend

# Сохранить конфигурацию
pm2 save

# Автозапуск при загрузке системы
pm2 startup
```

### Nginx команды
```bash
# Проверить статус
sudo systemctl status nginx

# Перезагрузить конфигурацию
sudo systemctl reload nginx

# Перезапустить Nginx
sudo systemctl restart nginx

# Проверить конфигурацию
sudo nginx -t

# Логи доступа
sudo tail -f /var/log/nginx/access.log

# Логи ошибок
sudo tail -f /var/log/nginx/error.log
```

---

## 🔍 Диагностика проблем

### Проверка портов
```bash
# Какие порты слушают
sudo netstat -tlnp

# Конкретно порт 3000
sudo netstat -tlnp | grep :3000

# Процессы на порту 3000
sudo lsof -i :3000
```

### Проверка процессов
```bash
# Все процессы Node.js
ps aux | grep node

# Убить процесс по PID
kill <PID>

# Убить все процессы Node.js (осторожно!)
pkill -f node
```

### Проверка логов
```bash
# Логи системы
sudo journalctl -u nginx -f

# Логи приложения (если запущено через nohup)
tail -f server.log

# Логи PM2
pm2 logs outtime-backend --lines 50
```

---

## 🚀 После запуска

### Проверить что API работает
```bash
# Health check должен вернуть JSON
curl https://outtime.outcasts.dev/api/public/health

# Должно быть примерно так:
# {"status":"OK","timestamp":"2024-12-01T...","service":"OutTime API","version":"1.0.0"}
```

### Проверить в браузере
1. Открыть https://outtime.outcasts.dev
2. Перейти в раздел "🎨 UI Компоненты"
3. Нажать "Запустить диагностику"
4. Все тесты должны показать ✅ Успешно

---

## ⚠️ Частые проблемы

1. **"Порт уже занят"** → `pkill -f "node.*server.js"`
2. **"База данных недоступна"** → Проверить DATABASE_URL в .env
3. **"PM2 command not found"** → `npm install -g pm2`
4. **"Permission denied"** → `chmod +x start-production.sh`
5. **"Module not found"** → `npm install`

---

## 📞 Контакты поддержки

При проблемах с сервером проверьте:
- Все ли команды выполнены
- Создан ли .env файл
- Запущен ли процесс Node.js
- Отвечает ли health check endpoint 