import React from 'react'
import { cn } from '../../utils/cn'

const cardVariants = {
  default: 'card',
  interactive: 'card-interactive', 
  flat: 'card-flat'
}

/**
 * Современный компонент карточки с hover-эффектами
 * 
 * @param {Object} props - Свойства компонента
 * @param {'default'|'interactive'|'flat'} props.variant - Вариант стиля карточки
 * @param {React.ReactNode} props.children - Содержимое карточки
 * @param {string} props.className - Дополнительные CSS классы
 * @param {React.ElementType} props.as - HTML элемент для рендера
 * @param {Function} props.onClick - Обработчик клика (делает карточку кликабельной)
 * @param {Object} props.rest - Остальные пропсы
 */
const Card = ({
  variant = 'default',
  children,
  className,
  as: Component = 'div',
  onClick,
  ...rest
}) => {
  const variantClasses = cardVariants[variant] || cardVariants.default
  
  // Если есть onClick, автоматически делаем карточку интерактивной
  const isInteractive = onClick || variant === 'interactive'
  
  const cardClasses = cn(
    variantClasses,
    {
      'cursor-pointer': isInteractive,
      'hover:border-gray-200 hover:shadow-lg transform hover:-translate-y-1': isInteractive && variant !== 'interactive'
    },
    className
  )

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  )
}

/**
 * Компонент заголовка карточки
 */
const CardHeader = ({ children, className, ...rest }) => (
  <div className={cn('mb-4', className)} {...rest}>
    {children}
  </div>
)

/**
 * Компонент заголовка карточки
 */
const CardTitle = ({ children, className, as: Component = 'h3', ...rest }) => (
  <Component className={cn('text-heading', className)} {...rest}>
    {children}
  </Component>
)

/**
 * Компонент описания карточки
 */
const CardDescription = ({ children, className, ...rest }) => (
  <p className={cn('text-caption mt-1', className)} {...rest}>
    {children}
  </p>
)

/**
 * Компонент контента карточки
 */
const CardContent = ({ children, className, ...rest }) => (
  <div className={cn('space-section', className)} {...rest}>
    {children}
  </div>
)

/**
 * Компонент футера карточки
 */
const CardFooter = ({ children, className, ...rest }) => (
  <div className={cn('mt-6 pt-4 border-t border-gray-100', className)} {...rest}>
    {children}
  </div>
)

// Экспорт всех компонентов
Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription  
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } 