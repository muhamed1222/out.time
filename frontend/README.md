# Out Time - Frontend

Web-приложение для управления системой учета рабочего времени.

## Технологии

- **React 19** - библиотека для создания пользовательских интерфейсов
- **Vite** - инструмент сборки и dev-сервер
- **TailwindCSS** - CSS фреймворк для стилизации
- **React Router** - маршрутизация в приложении
- **Axios** - HTTP клиент для API запросов
- **date-fns** - работа с датами

## Установка и запуск

### Требования

- Node.js 18+
- pnpm 8+

### Установка зависимостей

```bash
cd frontend
pnpm install
```

### Конфигурация

Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

Настройте переменные окружения:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Development
VITE_NODE_ENV=development
```

### Запуск в режиме разработки

```bash
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для продакшена

```bash
pnpm build
```

Собранное приложение будет в папке `dist`.

### Просмотр собранного приложения

```bash
pnpm preview
```

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── ui/             # UI компоненты (кнопки, инпуты)
│   ├── layout/         # Компоненты макета (Header, Sidebar)
│   └── common/         # Общие компоненты (LoadingSpinner)
├── pages/              # Страницы приложения
├── services/           # API сервисы
├── context/            # React контексты
├── hooks/              # Custom hooks
├── utils/              # Утилиты
├── App.jsx             # Основной компонент
└── main.jsx            # Точка входа
```

## Основные страницы

- `/login` - Авторизация и регистрация
- `/dashboard` - Главная панель с аналитикой
- `/employees` - Управление сотрудниками
- `/employees/:id` - Детальная информация о сотруднике
- `/reports` - Просмотр отчетов
- `/settings` - Настройки компании

## API интеграция

Все API запросы проходят через сервисы в папке `src/services/`:

- `authService.js` - аутентификация
- `employeeService.js` - управление сотрудниками
- `dashboardService.js` - данные дашборда
- `reportsService.js` - отчеты

## Стилизация

Проект использует TailwindCSS с кастомными компонентами и утилитными классами.

Основные цвета:
- Primary: `#3B82F6` (синий)
- Gray: оттенки серого для текста и фонов

## Состояние приложения

Управление состоянием осуществляется через:
- React Context (AuthContext) - аутентификация
- Local state в компонентах
- Custom hooks для переиспользуемой логики 