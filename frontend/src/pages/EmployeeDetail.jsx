import React from 'react'
import { useParams } from 'react-router-dom'

const EmployeeDetail = () => {
  const { id } = useParams()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Сотрудник #{id}</h1>
        <p className="text-gray-600">Подробная информация о сотруднике</p>
      </div>

      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500">Загрузка информации о сотруднике...</p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetail 