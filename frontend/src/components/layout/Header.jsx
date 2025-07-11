import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Notifications from '../ui/Notifications'
import { ThemeToggle } from '../ui'
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
            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
          >
            <MenuIcon />
          </button>

          <h1 className="text-[32px] md:text-[32px] font-semibold text-[#101010] dark:text-white truncate">
            {user?.company?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-[12px]">
          {/* Переключатель темы */}
          <ThemeToggle />
          
          <div className="hidden sm:block">
            <Notifications />
          </div>
          
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <div className="text-right hidden sm:block mr-3">
                <div className="font-semibold text-[#101010] dark:text-white">{user?.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user?.position || 'Сотрудник'}</div>
              </div>
              <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-lg">
                <img
                  src={`https://i.pravatar.cc/48?u=${user?.email}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute hidden group-hover:block right-0 top-full w-64 bg-white dark:bg-gray-800 rounded-[16px] shadow-xl py-2 z-10 border border-gray-100 dark:border-gray-700 mt-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{user?.position || 'Сотрудник'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Настройки
                </button>
                <button
                  onClick={() => navigate('/help')}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Помощь
                </button>
                <hr className="my-1 border-gray-100 dark:border-gray-700" />
                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Выйти из аккаунта
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