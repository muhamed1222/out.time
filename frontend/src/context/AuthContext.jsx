import React, { createContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        
        // Проверяем валидность токена
        await checkAuth()
      } catch (error) {
        console.error('Error initializing auth:', error)
        handleLogout()
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me')
      const fetchedUser = response.data.user
      setUser(fetchedUser)
      localStorage.setItem('user', JSON.stringify(fetchedUser))
      setIsAuthenticated(true)
      setError(null)
    } catch (error) {
      console.error('Auth check failed:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', { email, password })
      const { accessToken, user } = response.data
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      navigate('/dashboard', { replace: true })
      
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.response?.data?.error || 'Ошибка входа')
      throw error
    }
  }

  const register = async (companyName, email, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/register', {
        companyName,
        email,
        password
      })
      const { accessToken, user } = response.data
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      navigate('/dashboard', { replace: true })
      
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error.response?.data?.error || 'Ошибка регистрации')
      throw error
    }
  }

  const updateUser = useCallback((updatedUserData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedUserData }
      localStorage.setItem('user', JSON.stringify(newUser))
      return newUser
    })
  }, [])

  const updateUserCompany = useCallback((companyName) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        company: { ...user.company, name: companyName } 
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }, [user])

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout: handleLogout,
    register,
    updateUser,
    updateUserCompany,
    checkAuth
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 