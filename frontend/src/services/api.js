import axios from 'axios'

// Определяем API URL
const getApiUrl = () => {
  // Получаем текущий хост
  const currentHost = window.location.hostname
  
  console.log('Current environment:', {
    hostname: currentHost,
    isDev: import.meta.env.DEV,
    envApiUrl: import.meta.env.VITE_API_URL
  })
  
  // В режиме разработки (localhost) используем локальный сервер
  if (import.meta.env.DEV || currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:3000/api'
  }
  
  // На production домене используем тот же домен для API
  if (currentHost === 'outtime.outcasts.dev') {
    return 'https://outtime.outcasts.dev/api'
  }
  
  // Fallback: используем переменную окружения или текущий протокол/хост
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Последний fallback: используем текущий протокол и хост
  return `${window.location.protocol}//${window.location.host}/api`
}

const apiUrl = getApiUrl()
console.log('Final API URL:', apiUrl)

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  // Добавляем таймаут для запросов
  timeout: 15000, // Увеличиваем таймаут для production
  // Разрешаем отправку куки
  withCredentials: false // Отключаем для cross-origin requests
})

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Логирование запросов для отладки
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    })
    
    return config
  },
  error => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Перехватчик для обработки ответов
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  error => {
    // Подробное логирование ошибок
    console.error('API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    })
    
    // Обработка ошибок аутентификации
    if (error.response?.status === 401) {
      // Проверяем, не является ли текущий URL страницей входа
      if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('token')
        localStorage.removeItem('user')
      window.location.href = '/login'
    }
    }
    
    // Обработка ошибок сервера
    if (error.response?.status === 500) {
      console.error('Серверная ошибка:', error.response.data)
    }
    
    // Обработка ошибок 502 Bad Gateway
    if (error.response?.status === 502) {
      console.error('502 Bad Gateway - сервер недоступен или не запущен')
      console.error('Проверьте статус backend сервера на:', apiUrl.replace('/api', ''))
    }
    
    // Обработка ошибок 404
    if (error.response?.status === 404) {
      console.error('Ресурс не найден:', error.response.data)
    }
    
    // Обработка ошибок подключения
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('Не удалось подключиться к серверу. Проверьте:')
      console.error('1. Работает ли backend сервер')
      console.error('2. Правильность API URL:', api.defaults.baseURL)
      console.error('3. Настройки CORS на сервере')
      console.error('4. Сетевое подключение')
    }
    
    // Обработка таймаута
    if (error.code === 'ECONNABORTED') {
      console.error('Превышено время ожидания запроса')
    }
    
    return Promise.reject(error)
  }
)

// Добавляем метод для проверки здоровья API
api.healthCheck = async () => {
  try {
    const response = await api.get('/public/health')
    return {
      status: 'ok',
      data: response.data,
      baseURL: api.defaults.baseURL
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      statusCode: error.response?.status,
      baseURL: api.defaults.baseURL,
      currentHost: window.location.hostname
    }
  }
}

export default api 