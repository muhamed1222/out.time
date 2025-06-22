import React from 'react'
import useAuth from '../../hooks/useAuth'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Out Time
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{user?.company?.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{user?.email}</div>
            </div>
            
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 