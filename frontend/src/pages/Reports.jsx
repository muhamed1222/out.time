import React from 'react'

const Reports = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Отчеты</h1>
          <p className="text-gray-600">Отчеты сотрудников за выбранный период</p>
        </div>
        <button className="btn-secondary">
          📊 Экспорт в Excel
        </button>
      </div>

      <div className="card">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет отчетов</h3>
          <p className="mt-1 text-sm text-gray-500">
            Отчеты появятся здесь, когда сотрудники начнут их отправлять
          </p>
        </div>
      </div>
    </div>
  )
}

export default Reports 