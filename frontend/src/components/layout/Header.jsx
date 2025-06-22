import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 9C6 6.23858 8.23858 4 11 4H13C15.7614 4 18 6.23858 18 9V15C18 16.1046 17.1046 17 16 17H8C6.89543 17 6 16.1046 6 15V9Z" stroke="#727272" strokeWidth="1.5"/>
        <path d="M10 20H14" stroke="#727272" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="py-[13px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold text-[#101010]">
            {user?.company?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-[12px]">
          <div className="bg-[#fdfdfd] rounded-full w-[48px] h-[48px] flex items-center justify-center cursor-pointer">
            <BellIcon />
          </div>
          
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <div className="text-right">
                <div className="font-semibold text-[#101010]">{user?.name}</div>
              </div>
              <div className="w-[48px] h-[48px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={`https://i.pravatar.cc/48?u=${user?.email}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute hidden group-hover:block right-0 top-full w-56 bg-white rounded-[16px] shadow-lg py-2 z-10 border border-gray-100">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  Настройки
                </button>
                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 