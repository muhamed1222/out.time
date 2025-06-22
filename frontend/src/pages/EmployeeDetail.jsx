import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import { toast } from 'react-hot-toast'

const EmployeeDetail = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEmployeeDetails()
  }, [id])

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getEmployee(id)
      setEmployee(data.employee)
      setError(null)
    } catch (error) {
      console.error('Ошибка загрузки данных сотрудника:', error)
      setError(error.response?.data?.error || 'Не удалось загрузить данные сотрудника')
      toast.error(error.response?.data?.error || 'Не удалось загрузить данные сотрудника')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadEmployeeDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Сотрудник не найден</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
        <p className="text-gray-600">Подробная информация о сотруднике</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Основная информация */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500">Статус:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {employee.isActive ? 'Активен' : 'Неактивен'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Дата регистрации:</span>
              <span className="ml-2">{new Date(employee.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            {employee.telegramId && (
              <div>
                <span className="text-gray-500">Telegram ID:</span>
                <span className="ml-2">{employee.telegramId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Статистика за неделю */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Статистика за неделю</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500">Рабочих дней:</span>
              <span className="ml-2">{employee.weekStats?.totalDays || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Отработано часов:</span>
              <span className="ml-2">{employee.weekStats?.totalHours || '0ч 0мин'}</span>
            </div>
            <div>
              <span className="text-gray-500">Отчетов за неделю:</span>
              <span className="ml-2">{employee.weekStats?.reportsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Сегодняшний день */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Сегодня</h3>
        {employee.today?.timeRecord ? (
          <div className="space-y-3">
            <div>
              <span className="text-gray-500">Статус:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                employee.today.timeRecord.status === 'work' ? 'bg-green-100 text-green-800' :
                employee.today.timeRecord.status === 'sick' ? 'bg-red-100 text-red-800' :
                employee.today.timeRecord.status === 'vacation' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {employee.today.timeRecord.status === 'work' ? 'Работает' :
                 employee.today.timeRecord.status === 'sick' ? 'Болеет' :
                 employee.today.timeRecord.status === 'vacation' ? 'В отпуске' :
                 'Опаздывает'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Начало работы:</span>
              <span className="ml-2">
                {new Date(employee.today.timeRecord.startTime).toLocaleTimeString('ru-RU')}
              </span>
            </div>
            {employee.today.timeRecord.endTime && (
              <>
                <div>
                  <span className="text-gray-500">Окончание работы:</span>
                  <span className="ml-2">
                    {new Date(employee.today.timeRecord.endTime).toLocaleTimeString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Отработано:</span>
                  <span className="ml-2">{employee.today.timeRecord.workDuration}</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Сегодня еще не приступал к работе</p>
        )}
      </div>

      {/* Последние отчеты */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Последние отчеты</h3>
        {employee.recentReports?.length > 0 ? (
          <div className="space-y-4">
            {employee.recentReports.map(report => (
              <div key={report.id} className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString('ru-RU')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(report.createdAt).toLocaleTimeString('ru-RU')}
                  </span>
                </div>
                <p className="text-gray-900 whitespace-pre-wrap">{report.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Нет отчетов</p>
        )}
      </div>
    </div>
  )
}

export default EmployeeDetail 