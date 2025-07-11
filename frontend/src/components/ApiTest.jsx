import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from './ui';

const ApiTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const performDiagnostics = async () => {
    setTesting(true);
    setTestResults(null);

    const results = {
      timestamp: new Date().toISOString(),
      currentHost: window.location.hostname,
      currentProtocol: window.location.protocol,
      isDevelopment: import.meta.env.DEV,
      tests: []
    };

    // Тест 1: Определение API URL
    const apiUrl = getApiUrl();
    results.apiUrl = apiUrl;
    results.tests.push({
      name: 'API URL определение',
      status: 'success',
      details: `Определен как: ${apiUrl}`
    });

    // Тест 2: Health Check
    try {
      console.log('Тестирование подключения к API:', apiUrl);
      console.log('Health URL:', `${apiUrl}/public/health`);
      
      const response = await fetch(`${apiUrl}/public/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        results.tests.push({
          name: 'Health Check',
          status: 'success',
          details: `HTTP ${response.status}: ${JSON.stringify(data)}`
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Ошибка при тестировании API:', error);
      results.tests.push({
        name: 'Health Check',
        status: 'error',
        details: error.message,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      });
    }

    // Тест 3: Проверка CORS
    try {
      const corsResponse = await fetch(`${apiUrl}/public/health`, {
        method: 'OPTIONS'
      });
      
      results.tests.push({
        name: 'CORS Preflight',
        status: corsResponse.ok ? 'success' : 'warning',
        details: `HTTP ${corsResponse.status}, Headers: ${JSON.stringify(Object.fromEntries(corsResponse.headers))}`
      });
    } catch (error) {
      results.tests.push({
        name: 'CORS Preflight',
        status: 'error',
        details: error.message
      });
    }

    // Тест 4: Проверка сети
    try {
      const networkTest = await fetch('https://httpbin.org/status/200', {
        method: 'GET',
        mode: 'cors'
      });
      
      results.tests.push({
        name: 'Тест сети',
        status: networkTest.ok ? 'success' : 'warning',
        details: `Внешний API доступен: HTTP ${networkTest.status}`
      });
    } catch (error) {
      results.tests.push({
        name: 'Тест сети',
        status: 'error',
        details: `Проблемы с сетью: ${error.message}`
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  // Функция определения API URL (копия из api.js)
  const getApiUrl = () => {
    const currentHost = window.location.hostname;
    
    if (import.meta.env.DEV || currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    
    if (currentHost === 'outtime.outcasts.dev') {
      return 'https://outtime.outcasts.dev/api';
    }
    
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    return `${window.location.protocol}//${window.location.host}/api`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">✅ Успешно</Badge>;
      case 'warning':
        return <Badge variant="warning">⚠️ Предупреждение</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Ошибка</Badge>;
      default:
        return <Badge variant="secondary">❓ Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🔍 Диагностика API подключения
            <Button 
              onClick={performDiagnostics} 
              disabled={testing}
              variant="primary"
            >
              {testing ? 'Тестирование...' : 'Запустить диагностику'}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {testResults && (
          <CardContent>
            <div className="space-y-4">
              {/* Общая информация */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Информация о среде:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Хост: <code>{testResults.currentHost}</code></div>
                  <div>Протокол: <code>{testResults.currentProtocol}</code></div>
                  <div>Режим разработки: <code>{testResults.isDevelopment ? 'да' : 'нет'}</code></div>
                  <div>API URL: <code>{testResults.apiUrl}</code></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Тестирование: {new Date(testResults.timestamp).toLocaleString('ru-RU')}
                </div>
              </div>

              {/* Результаты тестов */}
              <div className="space-y-3">
                <h4 className="font-semibold">Результаты тестов:</h4>
                {testResults.tests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{test.name}</span>
                      {getStatusBadge(test.status)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {test.details}
                    </div>
                    {test.error && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-600 cursor-pointer">
                          Подробности ошибки
                        </summary>
                        <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(test.error, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>

              {/* Рекомендации */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">💡 Рекомендации по устранению:</h4>
                <div className="text-sm space-y-1">
                  {testResults.tests.some(t => t.status === 'error' && t.name === 'Health Check') && (
                    <div>
                      <strong>🔧 Backend сервер не запущен:</strong>
                      <ol className="list-decimal list-inside ml-4 mt-1">
                        <li>Подключитесь к серверу: <code>ssh your-username@outtime.outcasts.dev</code></li>
                        <li>Перейдите в папку: <code>cd /var/www/outtime.outcasts.dev/backend</code></li>
                        <li>Запустите: <code>./start-production.sh</code></li>
                        <li>Проверьте: <code>curl http://localhost:3000/api/public/health</code></li>
                      </ol>
                    </div>
                  )}
                  
                  {testResults.tests.some(t => t.status === 'error' && t.name === 'CORS Preflight') && (
                    <div>
                      <strong>🌐 Проблема с CORS:</strong> Проверьте настройки Nginx и убедитесь, что CORS заголовки настроены правильно.
                    </div>
                  )}
                  
                  {testResults.tests.some(t => t.status === 'error' && t.name === 'Тест сети') && (
                    <div>
                      <strong>📡 Проблема с сетью:</strong> Проверьте подключение к интернету и настройки брандмауэра.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ApiTest; 