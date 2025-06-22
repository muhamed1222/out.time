import api from './api'

export const dashboardService = {
  async getDashboardData() {
    const response = await api.get('/dashboard')
    return response.data
  },

  async getWeeklyData() {
    const response = await api.get('/dashboard/weekly')
    return response.data
  },

  async getQuickActions() {
    const response = await api.get('/dashboard/quick-actions')
    return response.data
  }
}
