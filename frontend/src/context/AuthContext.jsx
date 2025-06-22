import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      // We can still verify with the server in the background if needed
      // checkAuth(); 
    }
    setLoading(false)
  }, [])

  const checkAuth = async () => {
    // This function can be used to verify the token with the server,
    // but the initial state is now set synchronously from localStorage.
    try {
      const response = await api.get('/auth/me')
      const fetchedUser = response.data.user;
      setUser(fetchedUser)
      localStorage.setItem('user', JSON.stringify(fetchedUser));
      setIsAuthenticated(true)
    } catch (error) {
      logout();
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { accessToken, user } = response.data
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user));
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
    localStorage.removeItem('user');
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
      const { accessToken, user } = response.data
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      console.error('Registration failed:', error.response || error)
      throw error
    }
  }

  const updateUser = (updatedUserData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const updateUserCompany = (companyName) => {
    if (user) {
        const updatedUser = { ...user, company: { ...user.company, name: companyName } };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register,
    updateUserCompany
  }

  // The loading screen is now simpler as we don't need to wait for checkAuth
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