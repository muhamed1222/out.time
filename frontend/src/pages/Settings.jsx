import React from 'react'

const Settings = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600">Управление настройками компании</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Уведомления</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время утреннего уведомления
              </label>
              <input 
                type="time" 
                className="input-field max-w-32"
                defaultValue="09:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время вечернего уведомления
              </label>
              <input 
                type="time" 
                className="input-field max-w-32"
                defaultValue="18:00"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о компании</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название компании
              </label>
              <input 
                type="text" 
                className="input-field"
                placeholder="Название компании"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings 