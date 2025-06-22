import React from 'react'
import useAuth from '../../hooks/useAuth'

const BellIcon = () => (
    <svg className="w-[24px] h-[24px]" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 14.5C15 12.3783 15 11.3174 14.5607 10.4382C14.1689 9.64831 13.4809 8.96029 12.0927 7.58425L11.5 7M3 14.5C3 12.3783 3 11.3174 3.43934 10.4382C3.83112 9.64831 4.51914 8.96029 5.90732 7.58425L6.5 7M11.5 7C11.5 4.23858 9.26142 2 6.5 2C3.73858 2 1.5 4.23858 1.5 7L1.5 9.5M6.5 7C6.5 4.23858 8.73858 2 11.5 2C14.2614 2 16.5 4.23858 16.5 7L16.5 9.5M7 17.5C7.33333 18.5 8.1 19.5 9 19.5C9.9 19.5 10.6667 18.5 11 17.5" stroke="#727272" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="py-[13px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold text-[#101010]">
            Outcasts агентство
          </h1>
        </div>
        
        <div className="flex items-center gap-[12px]">
          <div className="bg-[#fdfdfd] rounded-full w-[48px] h-[48px] flex items-center justify-center cursor-pointer">
            <BellIcon />
          </div>
          
          <div className="flex items-center gap-[12px]">
            <div className="bg-[#fdfdfd] rounded-full w-[48px] h-[48px] flex items-center justify-center cursor-pointer">
              <img
                src={`https://i.pravatar.cc/40?u=${user?.email}`}
                alt="Avatar"
                className="w-[40px] h-[40px] rounded-full"
              />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">{user?.company?.name}</div>
              <div className="text-gray-500">{user?.email}</div>
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