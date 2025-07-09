import React, { useState } from 'react'
import {
  Button,
  Card,
  Badge,
  Input,
  SearchInput,
  Textarea,
  LoadingSkeleton,
  WorkStatusBadge,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatsCard,
  TrendIndicator,
  DataTable,
  statsColorSchemes,
  statsIcons
} from '../components/ui'

const ComponentsTest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  const handleLoadingTest = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className="space-content max-w-6xl mx-auto">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-heading mb-2">🎨 Тестирование UI компонентов</h1>
        <p className="text-caption">Демонстрация новых компонентов дизайн-системы</p>
      </div>

      {/* Кнопки */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки</CardTitle>
          <CardDescription>Различные варианты и размеры кнопок</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-section">
            {/* Варианты кнопок */}
            <div>
              <h4 className="text-subheading mb-3">Варианты</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Размеры кнопок */}
            <div>
              <h4 className="text-subheading mb-3">Размеры</h4>
              <div className="flex flex-wrap items-end gap-3">
                <Button size="sm">Small</Button>
                <Button size="base">Base</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Состояния кнопок */}
            <div>
              <h4 className="text-subheading mb-3">Состояния</h4>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button loading={isLoading} onClick={handleLoadingTest}>
                  {isLoading ? 'Загрузка...' : 'Тест загрузки'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Карточки */}
      <Card>
        <CardHeader>
          <CardTitle>Карточки</CardTitle>
          <CardDescription>Различные варианты карточек с hover-эффектами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Обычная карточка */}
            <Card variant="default">
              <CardTitle as="h4">Обычная карточка</CardTitle>
              <CardDescription>Стандартная карточка с hover-эффектом</CardDescription>
              <CardContent>
                <p className="text-body">Содержимое карточки с базовыми стилями.</p>
              </CardContent>
            </Card>

            {/* Интерактивная карточка */}
            <Card variant="interactive" onClick={() => alert('Карточка нажата!')}>
              <CardTitle as="h4">Интерактивная</CardTitle>
              <CardDescription>Кликабельная карточка</CardDescription>
              <CardContent>
                <p className="text-body">Эта карточка реагирует на клики.</p>
              </CardContent>
            </Card>

            {/* Плоская карточка */}
            <Card variant="flat">
              <CardTitle as="h4">Плоская карточка</CardTitle>
              <CardDescription>Карточка без теней</CardDescription>
              <CardContent>
                <p className="text-body">Минималистичный стиль без эффектов.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Бейджи */}
      <Card>
        <CardHeader>
          <CardTitle>Бейджи и статусы</CardTitle>
          <CardDescription>Цветные бейджи для статусов и категорий</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-section">
            {/* Статусы работы */}
            <div>
              <h4 className="text-subheading mb-3">Статусы работы</h4>
              <div className="flex flex-wrap gap-2">
                <WorkStatusBadge status="work" />
                <WorkStatusBadge status="sick" />
                <WorkStatusBadge status="vacation" />
                <WorkStatusBadge status="break" />
                <WorkStatusBadge status="absent" />
              </div>
            </div>

            {/* Обычные бейджи */}
            <div>
              <h4 className="text-subheading mb-3">Цветные бейджи</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="gray">Gray</Badge>
                <Badge variant="default">Default</Badge>
              </div>
            </div>

            {/* Размеры бейджей */}
            <div>
              <h4 className="text-subheading mb-3">Размеры</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm" variant="primary">Small</Badge>
                <Badge size="base" variant="primary">Base</Badge>
                <Badge size="lg" variant="primary">Large</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Поля ввода */}
      <Card>
        <CardHeader>
          <CardTitle>Поля ввода</CardTitle>
          <CardDescription>Современные поля ввода с валидацией</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-section">
              <Input
                label="Обычное поле"
                placeholder="Введите текст..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                hint="Подсказка для пользователя"
              />

              <Input
                label="Поле с ошибкой"
                placeholder="Некорректные данные"
                error="Это поле обязательно для заполнения"
                variant="error"
              />

              <Input
                label="Успешное поле"
                placeholder="Валидные данные"
                variant="success"
                rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
            </div>

            <div className="space-section">
              <SearchInput
                label="Поиск"
                placeholder="Поиск сотрудников..."
              />

              <Textarea
                label="Описание"
                placeholder="Введите описание..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                hint="Максимум 500 символов"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Скелетоны загрузки */}
      <Card>
        <CardHeader>
          <CardTitle>Состояния загрузки</CardTitle>
          <CardDescription>Современные скелетоны вместо спиннеров</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Скелетон карточки */}
            <div>
              <h4 className="text-subheading mb-3">Карточка</h4>
              <LoadingSkeleton type="card" />
            </div>

            {/* Скелетон статистики */}
            <div>
              <h4 className="text-subheading mb-3">Статистика</h4>
              <LoadingSkeleton type="stats" />
            </div>

            {/* Скелетон списка */}
            <div>
              <h4 className="text-subheading mb-3">Список</h4>
              <LoadingSkeleton type="list" items={3} />
            </div>
          </div>

          {/* Скелетон таблицы */}
          <div className="mt-6">
            <h4 className="text-subheading mb-3">Таблица</h4>
            <LoadingSkeleton type="table" rows={4} columns={5} />
          </div>
        </CardContent>
      </Card>

      {/* Демонстрация анимаций */}
      <Card>
        <CardHeader>
          <CardTitle>Анимации и эффекты</CardTitle>
          <CardDescription>Примеры hover-эффектов и анимаций</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="hover-lift card-flat text-center p-6">
              <h4 className="text-subheading mb-2">Hover Lift</h4>
              <p className="text-caption">Поднимается при наведении</p>
            </div>

            <div className="hover-scale card-flat text-center p-6">
              <h4 className="text-subheading mb-2">Hover Scale</h4>
              <p className="text-caption">Увеличивается при наведении</p>
            </div>

            <div className="hover-glow card-flat text-center p-6">
              <h4 className="text-subheading mb-2">Hover Glow</h4>
              <p className="text-caption">Тень при наведении</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистические карточки */}
      <Card>
        <CardHeader>
          <CardTitle>Статистические карточки</CardTitle>
          <CardDescription>Современные карточки с иконками и трендами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={statsIcons.users}
              title="Активные пользователи"
              value="2,345"
              trend={12}
              color={statsColorSchemes.primary}
            />
            
            <StatsCard
              icon={statsIcons.reports}
              title="Отчеты за месяц"
              value="486"
              subtitle="на 15% больше"
              trend={15}
              color={statsColorSchemes.success}
            />
            
            <StatsCard
              icon={statsIcons.clock}
              title="Среднее время"
              value="8.5ч"
              trend={-5}
              color={statsColorSchemes.warning}
            />
            
            <StatsCard
              icon={statsIcons.chart}
              title="Конверсия"
              value="94.2%"
              color={statsColorSchemes.cyan}
              onClick={() => alert('Карточка кликабельна!')}
            />
          </div>
          
          {/* Демонстрация загрузки */}
          <div className="mt-6">
            <h4 className="text-subheading mb-3">Состояние загрузки</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard loading />
              <StatsCard loading />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица данных */}
      <Card>
        <CardHeader>
          <CardTitle>Таблица данных</CardTitle>
          <CardDescription>Интерактивная таблица с поиском и сортировкой</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={[
              { id: 1, name: 'Иван Петров', role: 'Разработчик', status: 'work', reports: 24, lastActivity: '2024-12-01' },
              { id: 2, name: 'Мария Сидорова', role: 'Дизайнер', status: 'sick', reports: 18, lastActivity: '2024-11-30' },
              { id: 3, name: 'Алексей Кузнецов', role: 'Менеджер', status: 'vacation', reports: 32, lastActivity: '2024-11-29' },
              { id: 4, name: 'Елена Васильева', role: 'Аналитик', status: 'work', reports: 15, lastActivity: '2024-12-01' },
              { id: 5, name: 'Дмитрий Козлов', role: 'Тестировщик', status: 'work', reports: 28, lastActivity: '2024-12-01' },
              { id: 6, name: 'Анна Морозова', role: 'Разработчик', status: 'break', reports: 21, lastActivity: '2024-11-28' },
              { id: 7, name: 'Павел Николаев', role: 'DevOps', status: 'work', reports: 19, lastActivity: '2024-12-01' },
              { id: 8, name: 'Ольга Семенова', role: 'HR', status: 'vacation', reports: 12, lastActivity: '2024-11-27' },
            ]}
            columns={[
              {
                key: 'name',
                title: 'Имя',
                render: (value) => <span className="font-medium">{value}</span>
              },
              {
                key: 'role',
                title: 'Должность',
                className: 'text-gray-600'
              },
              {
                key: 'status',
                title: 'Статус',
                render: (value) => <WorkStatusBadge status={value} />,
                sortable: false
              },
              {
                key: 'reports',
                title: 'Отчеты',
                className: 'text-right font-mono'
              },
              {
                key: 'lastActivity',
                title: 'Последняя активность',
                render: (value) => new Date(value).toLocaleDateString('ru-RU'),
                className: 'text-gray-600'
              }
            ]}
            itemsPerPage={5}
            onRowClick={(row) => alert(`Выбран сотрудник: ${row.name}`)}
          />
        </CardContent>
      </Card>

      {/* Компоненты тренда */}
      <Card>
        <CardHeader>
          <CardTitle>Индикаторы трендов</CardTitle>
          <CardDescription>Компоненты для отображения изменений</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-section">
            <div>
              <h4 className="text-subheading mb-3">Положительные тренды</h4>
              <div className="flex flex-wrap gap-4">
                <TrendIndicator value={5} />
                <TrendIndicator value={12} />
                <TrendIndicator value={25} />
                <TrendIndicator value={100} />
              </div>
            </div>
            
            <div>
              <h4 className="text-subheading mb-3">Отрицательные тренды</h4>
              <div className="flex flex-wrap gap-4">
                <TrendIndicator value={-3} />
                <TrendIndicator value={-8} />
                <TrendIndicator value={-15} />
                <TrendIndicator value={-50} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Цветовая палитра */}
      <Card>
        <CardHeader>
          <CardTitle>Цветовая палитра</CardTitle>
          <CardDescription>Семантические цвета дизайн-системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-full h-16 bg-primary-500 rounded-lg mb-2"></div>
              <p className="text-caption">Primary</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-success-500 rounded-lg mb-2"></div>
              <p className="text-caption">Success</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-warning-500 rounded-lg mb-2"></div>
              <p className="text-caption">Warning</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-danger-500 rounded-lg mb-2"></div>
              <p className="text-caption">Danger</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComponentsTest 