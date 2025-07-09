import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Компонент индикатора тренда
 */
const TrendIndicator = ({ value, className }) => {
  if (!value) return null
  
  const isPositive = value > 0
  const isNegative = value < 0
  
  const TrendIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
      />
    </svg>
  )
  
  return (
    <div className={cn(
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
      {
        'bg-success-50 text-success-700': isPositive,
        'bg-danger-50 text-danger-700': isNegative,
        'bg-gray-100 text-gray-600': !isPositive && !isNegative
      },
      className
    )}>
      <TrendIcon />
      <span className="ml-1">
        {isPositive && '+'}
        {Math.abs(value)}%
      </span>
    </div>
  )
}

/**
 * Современный компонент карточки статистики
 * 
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.icon - Иконка (обычно в цветном контейнере)
 * @param {string} props.title - Заголовок карточки
 * @param {string|number} props.value - Основное значение
 * @param {string} props.subtitle - Дополнительная информация
 * @param {number} props.trend - Тренд в процентах (положительный/отрицательный)
 * @param {Object} props.color - Цветовая схема { background, text, accent }
 * @param {boolean} props.loading - Состояние загрузки
 * @param {string} props.className - Дополнительные CSS классы
 * @param {Function} props.onClick - Обработчик клика
 * @param {Object} props.rest - Остальные пропсы
 */
const StatsCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  color = {
    background: 'bg-primary-50',
    text: 'text-primary-600',
    accent: 'border-primary-200'
  },
  loading = false,
  className,
  onClick,
  ...rest
}) => {
  const isInteractive = Boolean(onClick)
  
  if (loading) {
    return (
      <div className={cn(
        'bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100',
        className
      )} {...rest}>
        <div className="flex items-center justify-between mb-4">
          <div className="animate-pulse bg-gray-200 h-10 sm:h-12 w-10 sm:w-12 rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-5 sm:h-6 w-14 sm:w-16 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 h-3 sm:h-4 w-20 sm:w-24 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-14 sm:w-16 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-base',
        {
          'transform hover:-translate-y-0.5': !isInteractive,
          'cursor-pointer hover:border-gray-200 hover:shadow-lg transform hover:-translate-y-1': isInteractive,
          'active:transform-none': true
        },
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {/* Верхняя часть - иконка и тренд */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        {/* Иконка */}
        <div className={cn('p-2 sm:p-3 rounded-lg', color.background)}>
          <div className={cn('w-5 h-5 sm:w-6 sm:h-6', color.text)}>
            {icon}
          </div>
        </div>
        
        {/* Тренд */}
        {trend !== undefined && (
          <TrendIndicator value={trend} />
        )}
      </div>
      
      {/* Нижняя часть - данные */}
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 leading-tight">
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-none mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Предустановленные цветовые схемы для разных типов статистики
 */
export const statsColorSchemes = {
  primary: {
    background: 'bg-primary-50',
    text: 'text-primary-600',
    accent: 'border-primary-200'
  },
  success: {
    background: 'bg-success-50', 
    text: 'text-success-600',
    accent: 'border-success-200'
  },
  warning: {
    background: 'bg-warning-50',
    text: 'text-warning-600', 
    accent: 'border-warning-200'
  },
  danger: {
    background: 'bg-danger-50',
    text: 'text-danger-600',
    accent: 'border-danger-200'
  },
  blue: {
    background: 'bg-blue-50',
    text: 'text-blue-600',
    accent: 'border-blue-200'
  },
  cyan: {
    background: 'bg-cyan-50',
    text: 'text-cyan-600', 
    accent: 'border-cyan-200'
  },
  purple: {
    background: 'bg-purple-50',
    text: 'text-purple-600',
    accent: 'border-purple-200'
  }
}

/**
 * Готовые иконки для статистических карточек
 */
export const statsIcons = {
  users: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  reports: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  clock: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  absent: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
    </svg>
  ),
  chart: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  trend: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

export default StatsCard
export { TrendIndicator } 