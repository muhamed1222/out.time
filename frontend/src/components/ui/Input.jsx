import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const inputVariants = {
  default: 'input-field',
  error: 'input-field input-error',
  success: 'input-field input-success'
}

const inputSizes = {
  sm: 'px-3 py-2 text-sm',
  base: 'px-3 py-2.5 text-base',
  lg: 'px-4 py-3 text-lg'
}

/**
 * Современный компонент поля ввода
 * 
 * @param {Object} props - Свойства компонента
 * @param {'default'|'error'|'success'} props.variant - Вариант стиля
 * @param {'sm'|'base'|'lg'} props.size - Размер поля
 * @param {string} props.label - Лейбл поля
 * @param {string} props.error - Текст ошибки
 * @param {string} props.hint - Подсказка
 * @param {React.ReactNode} props.leftIcon - Иконка слева
 * @param {React.ReactNode} props.rightIcon - Иконка справа
 * @param {string} props.className - Дополнительные CSS классы
 * @param {Object} props.rest - Остальные пропсы для input
 */
const Input = forwardRef(({
  variant = 'default',
  size = 'base',
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...rest
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  // Определяем вариант на основе наличия ошибки
  const finalVariant = error ? 'error' : variant
  
  const baseClasses = 'w-full border rounded-lg bg-white placeholder-gray-500 text-gray-900 transition-all duration-base focus:outline-none focus:ring-2 focus:ring-offset-0'
  const variantClasses = inputVariants[finalVariant] || inputVariants.default
  const sizeClasses = inputSizes[size] || inputSizes.base
  
  const inputClasses = cn(
    baseClasses,
    sizeClasses,
    {
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500': finalVariant === 'default',
      'border-danger-500 focus:border-danger-500 focus:ring-danger-500': finalVariant === 'error',
      'border-success-500 focus:border-success-500 focus:ring-success-500': finalVariant === 'success'
    },
    className
  )

  return (
    <div className="space-y-1.5">
      {/* Лейбл */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      {/* Поле ввода с иконками */}
      <div className="relative">
        {/* Левая иконка */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        {/* Поле ввода */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...rest}
        />
        
        {/* Правая иконка */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className={cn(
              'text-gray-400',
              finalVariant === 'error' && 'text-danger-500',
              finalVariant === 'success' && 'text-success-500'
            )}>
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {/* Сообщение об ошибке или подсказка */}
      {(error || hint) && (
        <div className={cn(
          'text-sm',
          error ? 'text-danger-600' : 'text-gray-500'
        )}>
          {error || hint}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

/**
 * Компонент поля ввода для поиска
 */
const SearchInput = forwardRef(({ placeholder = 'Поиск...', ...props }, ref) => {
  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      leftIcon={<SearchIcon />}
      {...props}
    />
  )
})

SearchInput.displayName = 'SearchInput'

/**
 * Компонент текстового поля
 */
const Textarea = forwardRef(({
  variant = 'default',
  label,
  error,
  hint,
  className,
  id,
  rows = 4,
  ...rest
}, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const finalVariant = error ? 'error' : variant
  
  const baseClasses = 'w-full px-3 py-2.5 border rounded-lg bg-white placeholder-gray-500 text-gray-900 transition-all duration-base focus:outline-none focus:ring-2 focus:ring-offset-0 resize-vertical'
  
  const textareaClasses = cn(
    baseClasses,
    {
      'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500': finalVariant === 'default',
      'border-danger-500 focus:border-danger-500 focus:ring-danger-500': finalVariant === 'error',
      'border-success-500 focus:border-success-500 focus:ring-success-500': finalVariant === 'success'
    },
    className
  )

  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={textareaClasses}
        {...rest}
      />
      
      {(error || hint) && (
        <div className={cn(
          'text-sm',
          error ? 'text-danger-600' : 'text-gray-500'
        )}>
          {error || hint}
        </div>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input
export { SearchInput, Textarea, inputVariants, inputSizes } 