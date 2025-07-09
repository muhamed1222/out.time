import React from 'react'
import { cn } from '../../utils/cn'

const badgeVariants = {
  work: 'badge-work',
  sick: 'badge-sick', 
  vacation: 'badge-vacation',
  default: 'badge-default',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  danger: 'bg-danger-50 text-danger-700 border-danger-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200'
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  base: 'px-2.5 py-0.5 text-xs', 
  lg: 'px-3 py-1 text-sm'
}

/**
 * Компонент бейджа для отображения статусов и меток
 * 
 * @param {Object} props - Свойства компонента
 * @param {'work'|'sick'|'vacation'|'default'|'primary'|'success'|'warning'|'danger'|'gray'} props.variant - Вариант цветовой схемы
 * @param {'sm'|'base'|'lg'} props.size - Размер бейджа
 * @param {React.ReactNode} props.children - Содержимое бейджа
 * @param {string} props.className - Дополнительные CSS классы
 * @param {React.ElementType} props.as - HTML элемент для рендера
 * @param {Object} props.rest - Остальные пропсы
 */
const Badge = ({
  variant = 'default',
  size = 'base',
  children,
  className,
  as: Component = 'span',
  ...rest
}) => {
  const baseClasses = 'badge'
  const variantClasses = badgeVariants[variant] || badgeVariants.default
  const sizeClasses = badgeSizes[size] || badgeSizes.base
  
  const badgeClasses = cn(
    baseClasses,
    variantClasses, 
    sizeClasses,
    className
  )

  return (
    <Component className={badgeClasses} {...rest}>
      {children}
    </Component>
  )
}

/**
 * Вспомогательная функция для получения бейджа статуса работы
 * @param {string} status - Статус работы
 * @returns {Object} Пропсы для компонента Badge
 */
export const getWorkStatusBadge = (status) => {
  const statusMap = {
    'work': { variant: 'work', children: 'Работа' },
    'sick': { variant: 'sick', children: 'Болничный' },
    'vacation': { variant: 'vacation', children: 'Отпуск' },
    'break': { variant: 'warning', children: 'Перерыв' },
    'absent': { variant: 'danger', children: 'Отсутствует' }
  }
  
  return statusMap[status] || { variant: 'default', children: status || 'Неизвестно' }
}

/**
 * Компонент бейджа статуса работы с автоматическим определением цвета
 */
const WorkStatusBadge = ({ status, ...props }) => {
  const badgeProps = getWorkStatusBadge(status)
  
  return (
    <Badge {...badgeProps} {...props} />
  )
}

export default Badge
export { WorkStatusBadge, badgeVariants, badgeSizes } 