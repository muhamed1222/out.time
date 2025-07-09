import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://outtime.outcasts.dev/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Таймаут 10 секунд
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

// Перехватчик для обработки ошибок
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
    console.error('API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Добавляем обработку 404 ошибки
    if (error.response?.status === 404) {
      console.error('Ресурс не найден:', error.response.data)
    }
    
    // Обработка ошибок подключения
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('Не удалось подключиться к серверу. Проверьте:')
      console.error('1. Работает ли backend сервер')
      console.error('2. Правильность API URL:', api.defaults.baseURL)
      console.error('3. Настройки CORS на сервере')
    }
    
    return Promise.reject(error)
  }
)

export default api 