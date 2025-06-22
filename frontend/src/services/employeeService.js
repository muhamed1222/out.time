import api from './api'

export const employeeService = {
  async getEmployees() {
    const response = await api.get('/employees')
    return response.data
  },

  async getEmployee(id) {
    const response = await api.get(`/employees/${id}`)
    return response.data
  },

  async inviteEmployee(name) {
    const response = await api.post('/employees/invite', { name })
    return response.data
  },

  async updateEmployee(id, data) {
    const response = await api.put(`/employees/${id}`, data)
    return response.data
  },

  async deactivateEmployee(id) {
    const response = await api.delete(`/employees/${id}`)
    return response.data
  }
} 