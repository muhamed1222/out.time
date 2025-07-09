import React from 'react'
import { cn } from '../../utils/cn'

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary', 
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'bg-danger-600 hover:bg-danger-700 active:bg-danger-800 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]',
  success: 'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  base: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
}

/**
 * Современный компонент кнопки с hover-эффектами и анимациями
 * 
 * @param {Object} props - Свойства компонента
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'} props.variant - Вариант стиля кнопки
 * @param {'sm'|'base'|'lg'|'xl'} props.size - Размер кнопки
 * @param {boolean} props.disabled - Отключена ли кнопка
 * @param {boolean} props.loading - Состояние загрузки
 * @param {React.ReactNode} props.children - Содержимое кнопки
 * @param {string} props.className - Дополнительные CSS классы
 * @param {React.ElementType} props.as - HTML элемент или React компонент для рендера
 * @param {Object} props.rest - Остальные пропсы передаются в элемент
 */
const Button = ({
  variant = 'primary',
  size = 'base', 
  disabled = false,
  loading = false,
  children,
  className,
  as: Component = 'button',
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
  
  const variantClasses = buttonVariants[variant] || buttonVariants.primary
  const sizeClasses = buttonSizes[size] || buttonSizes.base
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    {
      'cursor-not-allowed opacity-50 transform-none': disabled || loading,
      'pointer-events-none': loading
    },
    className
  )

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    rest.onClick?.(e)
  }

  return (
    <Component
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Component>
  )
}

export default Button

// Экспорт для удобства использования
export { buttonVariants, buttonSizes } 