import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-hot-toast'
import ApiTest from '../components/common/ApiTest'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showApiTest, setShowApiTest] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      toast.success('Вход выполнен успешно!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.error || 'Произошла ошибка при входе'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Вход в Out Time
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Система учета рабочего времени
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showApiTest && <ApiTest />}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                                 <input
                   id="email"
                   name="email"
                   type="email"
                   autoComplete="email"
                   required
                   value={formData.email}
                   onChange={handleChange}
                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1">
                                 <input
                   id="password"
                   name="password"
                   type="password"
                   autoComplete="current-password"
                   required
                   value={formData.password}
                   onChange={handleChange}
                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => setShowApiTest(!showApiTest)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {showApiTest ? 'Скрыть тест API' : 'Показать тест API'}
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Нет аккаунта? </span>
                <Link
                  to="/register"
                                     className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login 