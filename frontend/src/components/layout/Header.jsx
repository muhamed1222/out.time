import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Notifications from '../ui/Notifications'
import { useMobileMenu } from '../../context/MobileMenuContext'

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toggle } = useMobileMenu()

  return (
    <header className="py-[13px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Кнопка мобильного меню */}
          <button
            onClick={toggle}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <MenuIcon />
          </button>

          <h1 className="text-[32px] md:text-[32px] font-semibold text-[#101010] truncate">
            {user?.company?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-[12px]">
          <div className="hidden sm:block">
            <Notifications />
          </div>
          
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <div className="text-right hidden sm:block">
                <div className="font-semibold text-[#101010]">{user?.name}</div>
              </div>
              <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
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