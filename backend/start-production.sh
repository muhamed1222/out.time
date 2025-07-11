#!/bin/bash

# Скрипт для запуска OutTime Backend в production
# Использование: bash start-production.sh

echo "🚀 Запуск OutTime Backend в production режиме..."

# Проверяем, что мы в папке backend
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: Запустите скрипт из папки backend"
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "❌ Ошибка: Файл .env не найден"
    echo "Создайте .env файл на основе env.example:"
    echo "cp env.example .env"
    echo "Затем отредактируйте его с правильными настройками"
    exit 1
fi

# Проверяем, запущен ли уже сервер на порту 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Порт 3000 уже занят. Завершаем процесс..."
    pkill -f "node.*server.js" || true
    sleep 2
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
fi

# Проверяем подключение к базе данных
echo "🔍 Проверяем подключение к базе данных..."
if command -v node &> /dev/null; then
    node test-db.js
    if [ $? -ne 0 ]; then
        echo "❌ Не удалось подключиться к базе данных"
        echo "Проверьте настройки DATABASE_URL в .env файле"
        exit 1
    fi
else
    echo "⚠️ Node.js не найден, пропускаем тест БД"
fi

# Запускаем сервер
echo "🎯 Запускаем сервер..."
if command -v pm2 &> /dev/null; then
    echo "🔄 Используем PM2 для управления процессом"
    pm2 stop outtime-backend 2>/dev/null || true
    pm2 delete outtime-backend 2>/dev/null || true
    pm2 start server.js --name "outtime-backend" --env production
    pm2 save
    
    echo "✅ Сервер запущен через PM2"
    echo "Управление:"
    echo "  - Статус: pm2 status outtime-backend"
    echo "  - Логи: pm2 logs outtime-backend"
    echo "  - Остановка: pm2 stop outtime-backend"
    echo "  - Рестарт: pm2 restart outtime-backend"
    
else
    echo "🟡 PM2 не найден, запускаем в фоновом режиме"
    nohup node server.js > server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > server.pid
    
    echo "✅ Сервер запущен с PID: $SERVER_PID"
    echo "Логи: tail -f server.log"
    echo "Остановка: kill $SERVER_PID"
fi

# Ждем запуска сервера
echo "⏳ Ожидаем запуска сервера..."
sleep 3

# Проверяем статус
echo "🔍 Проверяем статус сервера..."
if curl -s http://localhost:3000/api/public/health > /dev/null; then
    echo "✅ Сервер успешно запущен!"
    echo "🌐 API доступен на: http://localhost:3000/api"
    echo "🩺 Health check: http://localhost:3000/api/public/health"
    
    # Показываем health check
    echo ""
    echo "📊 Результат health check:"
    curl -s http://localhost:3000/api/public/health | jq . 2>/dev/null || curl -s http://localhost:3000/api/public/health
    
else
    echo "❌ Сервер не отвечает"
    echo "Проверьте логи:"
    if command -v pm2 &> /dev/null; then
        pm2 logs outtime-backend --lines 20
    else
        tail -20 server.log
    fi
    exit 1
fi

echo ""
echo "🎉 Backend готов к работе!"
echo "🔗 Для проверки через Nginx: curl https://outtime.outcasts.dev/api/public/health" 