import axios from 'axios'

// Определяем API URL
const getApiUrl = () => {
  // В режиме разработки всегда используем локальный сервер
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api'
  }
  
  // В продакшене используем URL из переменной окружения или продакшн URL
  return import.meta.env.VITE_API_URL || 'https://outtime.outcasts.dev/api'
}

const apiUrl = getApiUrl()
console.log('Final API URL:', apiUrl)

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  // Добавляем таймаут для запросов
  timeout: 10000,
  // Разрешаем отправку куки
  withCredentials: true
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

export default api 