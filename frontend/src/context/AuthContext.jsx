import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      console.log('Found token in localStorage:', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      checkAuth()
    } else {
      console.log('No token found in localStorage')
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      console.log('Checking auth with headers:', api.defaults.headers.common)
      const response = await api.get('/auth/me')
      console.log('Auth check response:', response.data)
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error.response || error)
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      console.log('Login response:', response.data)
      
      const { accessToken, user } = response.data
      
      if (!accessToken) {
        throw new Error('No token received from server')
      }
      
      localStorage.setItem('token', accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      console.error('Login failed:', error.response || error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  const register = async (companyName, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        companyName,
        email,
        password
      })
      console.log('Register response:', response.data)
      
      const { accessToken, user } = response.data
      
      if (!accessToken) {
        throw new Error('No token received from server')
      }
      
      localStorage.setItem('token', accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      console.error('Registration failed:', error.response || error)
      throw error
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 