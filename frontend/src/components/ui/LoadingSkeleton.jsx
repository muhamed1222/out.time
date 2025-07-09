import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Базовый компонент скелетона
 */
const Skeleton = ({ 
  className, 
  width, 
  height,
  rounded = 'md',
  ...rest 
}) => {
  return (
    <div
      className={cn(
        'loading-shimmer bg-gray-200',
        `rounded-${rounded}`,
        className
      )}
      style={{ width, height }}
      {...rest}
    />
  )
}

/**
 * Скелетон для текста
 */
const TextSkeleton = ({ 
  lines = 1, 
  className,
  lineHeight = 'h-4',
  spacing = 'space-y-2',
  lastLineWidth = '75%',
  ...rest 
}) => {
  if (lines === 1) {
    return <Skeleton className={cn(lineHeight, 'w-full', className)} {...rest} />
  }

  return (
    <div className={cn(spacing, className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            lineHeight,
            i === lines - 1 ? `w-[${lastLineWidth}]` : 'w-full'
          )}
          {...rest}
        />
      ))}
    </div>
  )
}

/**
 * Скелетон для карточки
 */
const CardSkeleton = ({ 
  showImage = true,
  showHeader = true, 
  textLines = 3,
  showFooter = false,
  className,
  ...rest 
}) => {
  return (
    <div className={cn('card space-section', className)} {...rest}>
      {/* Изображение/иконка */}
      {showImage && (
        <Skeleton className="h-12 w-12 rounded-lg mb-4" />
      )}
      
      {/* Заголовок */}
      {showHeader && (
        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      
      {/* Основной текст */}
      <TextSkeleton lines={textLines} />
      
      {/* Футер */}
      {showFooter && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      )}
    </div>
  )
}

/**
 * Скелетон для таблицы
 */
const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className,
  ...rest 
}) => {
  return (
    <div className={cn('space-y-4', className)} {...rest}>
      {/* Заголовок таблицы */}
      {showHeader && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      )}
      
      {/* Строки таблицы */}
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className="h-5 w-full" 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Скелетон для статистических карточек
 */
const StatsCardSkeleton = ({ className, ...rest }) => {
  return (
    <div className={cn('card', className)} {...rest}>
      <div className="flex items-center justify-between mb-4">
        {/* Иконка */}
        <Skeleton className="h-12 w-12 rounded-lg" />
        {/* Тренд */}
        <Skeleton className="h-6 w-16" />
      </div>
      
      <div>
        {/* Заголовок */}
        <Skeleton className="h-4 w-24 mb-2" />
        {/* Значение */}
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

/**
 * Скелетон для списка элементов
 */
const ListSkeleton = ({ 
  items = 5,
  showAvatar = true,
  className,
  ...rest 
}) => {
  return (
    <div className={cn('space-y-4', className)} {...rest}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {/* Аватар */}
          {showAvatar && (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}
          
          {/* Контент */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          
          {/* Действие */}
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

/**
 * Основной компонент LoadingSkeleton с предустановленными шаблонами
 */
const LoadingSkeleton = ({ 
  type = 'text',
  className,
  ...props 
}) => {
  const skeletonTypes = {
    text: TextSkeleton,
    card: CardSkeleton,
    table: TableSkeleton,
    stats: StatsCardSkeleton,
    list: ListSkeleton
  }
  
  const SkeletonComponent = skeletonTypes[type] || TextSkeleton
  
  return <SkeletonComponent className={className} {...props} />
}

export default LoadingSkeleton

export {
  Skeleton,
  TextSkeleton,
  CardSkeleton,
  TableSkeleton,
  StatsCardSkeleton,
  ListSkeleton
} 