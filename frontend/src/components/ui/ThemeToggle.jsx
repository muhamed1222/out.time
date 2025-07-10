import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-10 w-10 items-center justify-center
        rounded-lg bg-gray-100 text-gray-500
        hover:bg-gray-200 transition-colors
        dark:bg-gray-800 dark:text-gray-400
        dark:hover:bg-gray-700
      `}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      <div className="relative h-5 w-5">
        <SunIcon
          className={`
            absolute inset-0 h-5 w-5 transition-transform duration-500
            ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}
          `}
        />
        <MoonIcon
          className={`
            absolute inset-0 h-5 w-5 transition-transform duration-500
            ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle; 