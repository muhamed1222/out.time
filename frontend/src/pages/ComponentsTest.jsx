import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  StatsCard,
  DataTable,
  LoadingSkeleton,
  Badge,
  Input,
  Toast,
  Tooltip,
  Breadcrumbs,
  ThemeToggle,
  EmptyState,
  statsColorSchemes,
  statsIcons
} from '../components/ui';
import api from '../services/api';

const ComponentsTest = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [apiDetails, setApiDetails] = useState(null);

  const testApiConnection = async () => {
    setTesting(true);
    setApiStatus(null);
    
    try {
      // Тестируем health check endpoint
      const result = await api.healthCheck();
      
      setApiStatus({
        status: result.status,
        data: result.data,
        error: result.error,
        statusCode: result.statusCode,
        baseURL: result.baseURL,
        currentHost: result.currentHost || window.location.hostname,
        timestamp: new Date().toISOString()
      });
      
      setApiDetails({
        currentDomain: window.location.hostname,
        apiUrl: api.defaults.baseURL,
        protocol: window.location.protocol,
        isDev: import.meta.env.DEV
      });
      
    } catch (error) {
      setApiStatus({
        status: 'error',
        error: error.message,
        baseURL: api.defaults.baseURL,
        currentHost: window.location.hostname,
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  const formatApiStatus = (status) => {
    switch (status?.status) {
      case 'ok':
        return { variant: 'success', text: 'Подключено' };
      case 'error':
        return { variant: 'destructive', text: 'Ошибка подключения' };
      default:
        return { variant: 'secondary', text: 'Не проверено' };
    }
  };

  const sampleData = [
    { id: 1, name: 'Иван Иванов', position: 'Разработчик', status: 'active' },
    { id: 2, name: 'Мария Петрова', position: 'Дизайнер', status: 'inactive' },
    { id: 3, name: 'Алексей Сидоров', position: 'Менеджер', status: 'active' },
  ];

  const columns = [
    { key: 'name', title: 'Имя', sortable: true },
    { key: 'position', title: 'Должность' },
    { 
      key: 'status', 
      title: 'Статус',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'secondary'}>
          {value === 'active' ? 'Активен' : 'Неактивен'}
        </Badge>
      )
    },
  ];

  const badgeStatus = formatApiStatus(apiStatus);

  return (
    <div className="space-content">
      {/* Заголовок */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🎨 Тестирование UI компонентов
            <ThemeToggle />
          </CardTitle>
        </CardHeader>
      </Card>

      {/* API тестирование */}
      <Card>
        <CardHeader>
          <CardTitle>🔌 Тест API подключения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={testApiConnection} 
                disabled={testing}
                variant="primary"
              >
                {testing ? 'Тестирование...' : 'Тестировать подключение'}
              </Button>
              
              {apiStatus && (
                <Badge variant={badgeStatus.variant}>
                  {badgeStatus.text}
                </Badge>
              )}
            </div>

            {apiDetails && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Детали подключения:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Текущий домен: <code>{apiDetails.currentDomain}</code></div>
                  <div>API URL: <code>{apiDetails.apiUrl}</code></div>
                  <div>Протокол: <code>{apiDetails.protocol}</code></div>
                  <div>Режим разработки: <code>{apiDetails.isDev ? 'да' : 'нет'}</code></div>
                </div>
              </div>
            )}

            {apiStatus && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Результат теста:</h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(apiStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={statsIcons.users}
          title="Общее количество"
          value="42"
          color={statsColorSchemes.success}
          trend={12}
        />
        <StatsCard
          icon={statsIcons.reports}
          title="Активные отчеты"
          value="18"
          color={statsColorSchemes.blue}
          trend={-5}
        />
        <StatsCard
          icon={statsIcons.clock}
          title="Среднее время"
          value="8.5ч"
          color={statsColorSchemes.cyan}
          trend={8}
        />
        <StatsCard
          icon={statsIcons.absent}
          title="Отсутствуют"
          value="3"
          color={statsColorSchemes.warning}
          trend={0}
        />
      </div>

      {/* Кнопки */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>

      {/* Бейджи */}
      <Card>
        <CardHeader>
          <CardTitle>Бейджи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Поля ввода */}
      <Card>
        <CardHeader>
          <CardTitle>Поля ввода</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <Input 
              label="Обычное поле"
              placeholder="Введите текст"
            />
            <Input 
              label="С ошибкой"
              placeholder="Поле с ошибкой"
              error="Это поле обязательно"
            />
            <Input 
              label="С иконкой"
              placeholder="Поиск..."
              icon="🔍"
            />
          </div>
        </CardContent>
      </Card>

      {/* Таблица */}
      <Card>
        <CardHeader>
          <CardTitle>Таблица данных</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sampleData}
            columns={columns}
            searchable
            sortable
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Empty State</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Нет данных"
            description="Здесь будут отображаться ваши данные, когда они появятся"
            icon="📊"
            action={{
              label: "Добавить данные",
              onClick: () => alert('Кнопка нажата!')
            }}
          />
        </CardContent>
      </Card>

      {/* Скелетоны загрузки */}
      <Card>
        <CardHeader>
          <CardTitle>Скелетоны загрузки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <LoadingSkeleton type="stats" />
            <LoadingSkeleton type="list" items={3} />
            <LoadingSkeleton type="card" />
          </div>
        </CardContent>
      </Card>

      {/* Tooltips */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Tooltip content="Tooltip сверху" position="top">
              <Button variant="outline">Сверху</Button>
            </Tooltip>
            <Tooltip content="Tooltip снизу" position="bottom">
              <Button variant="outline">Снизу</Button>
            </Tooltip>
            <Tooltip content="Tooltip слева" position="left">
              <Button variant="outline">Слева</Button>
            </Tooltip>
            <Tooltip content="Tooltip справа" position="right">
              <Button variant="outline">Справа</Button>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentsTest; 