import React from 'react'

const Employees = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
          <p className="text-gray-600">Управление сотрудниками компании</p>
        </div>
        <button className="btn-primary">
          + Пригласить сотрудника
        </button>
      </div>

      <div className="card">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Пока нет сотрудников</h3>
          <p className="mt-1 text-sm text-gray-500">
            Пригласите первого сотрудника в вашу команду
          </p>
        </div>
      </div>
    </div>
  )
}

export default Employees 