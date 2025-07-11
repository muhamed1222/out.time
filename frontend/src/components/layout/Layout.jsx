import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { Breadcrumbs } from '../ui'
import { useMobileMenu } from '../../context/MobileMenuContext'

const Layout = () => {
  const { isOpen } = useMobileMenu();

  return (
    <div className="flex h-screen bg-[#F8F8F8] dark:bg-gray-900 p-[10px] gap-[23px] overflow-hidden">
      {/* Sidebar - скрыт на мобильных по умолчанию */}
      <div className={`
        fixed md:relative md:translate-x-0 z-30
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      <Sidebar />
      </div>
      
      {/* Затемнение фона при открытом меню */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => useMobileMenu().close()}
        />
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="pb-[13px]">
          <Breadcrumbs />
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 