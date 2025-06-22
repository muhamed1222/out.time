import api from './api'

export const reportsService = {
  async getReports(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/reports?${params}`)
    return response.data
  },

  async exportReports(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/reports/export?${params}`, {
      responseType: 'blob'
    })
    return response.data
  },

  async getReportStats(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/reports/stats?${params}`)
    return response.data
  }
} 