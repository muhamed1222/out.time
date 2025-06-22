import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(companyName, email, password) {
    const response = await api.post('/auth/register', { 
      companyName, 
      email, 
      password 
    })
    return response.data
  },

  async getUserProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  }
} 