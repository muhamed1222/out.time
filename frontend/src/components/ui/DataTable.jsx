import React, { useState, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { SearchInput } from './Input'
import LoadingSkeleton from './LoadingSkeleton'
import Button from './Button'

/**
 * Компонент заголовка столбца с сортировкой
 */
const TableHeader = ({ column, sortConfig, onSort, className }) => {
  const isSorted = sortConfig?.key === column.key
  const isAscending = isSorted && sortConfig.direction === 'asc'
  
  const handleSort = () => {
    if (column.sortable !== false) {
      onSort(column.key)
    }
  }
  
  const SortIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={isAscending ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
      />
    </svg>
  )
  
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200',
        {
          'cursor-pointer hover:bg-gray-50 select-none': column.sortable !== false,
          'bg-gray-50': isSorted
        },
        className
      )}
      onClick={handleSort}
    >
      <div className="flex items-center">
        {column.title}
        {column.sortable !== false && (
          <span className={cn('transition-opacity', {
            'opacity-100': isSorted,
            'opacity-0 group-hover:opacity-50': !isSorted
          })}>
            <SortIcon />
          </span>
        )}
      </div>
    </th>
  )
}

/**
 * Компонент строки таблицы
 */
const TableRow = ({ item, columns, index, onRowClick, className }) => {
  const isClickable = Boolean(onRowClick)
  
  return (
    <tr
      className={cn(
        'transition-colors duration-base',
        {
          'hover:bg-gray-50': true,
          'cursor-pointer': isClickable,
          'bg-white': index % 2 === 0,
          'bg-gray-25': index % 2 === 1
        },
        className
      )}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={cn(
            'px-4 py-3 text-sm border-b border-gray-100',
            column.className
          )}
        >
          {column.render ? column.render(item[column.key], item, index) : item[column.key]}
        </td>
      ))}
    </tr>
  )
}

/**
 * Компонент пагинации
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  className 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    
    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }
    
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }
    
    rangeWithDots.push(...range)
    
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }
    
    return rangeWithDots
  }
  
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200', className)}>
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Вперед
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Показано <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> из{' '}
            <span className="font-medium">{totalItems}</span> результатов
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* Предыдущая страница */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="rounded-r-none"
            >
              Назад
            </Button>
            
            {/* Номера страниц */}
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <Button
                    variant={page === currentPage ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="rounded-none"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
            
            {/* Следующая страница */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="rounded-l-none"
            >
              Вперед
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}

/**
 * Мобильная карточка для отображения данных
 */
const MobileCard = ({ item, columns, onRowClick, className }) => {
  const isClickable = Boolean(onRowClick)
  
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm p-4 mb-3',
        { 'cursor-pointer hover:shadow-md transition-shadow': isClickable },
        className
      )}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column) => (
        <div key={column.key} className="mb-2 last:mb-0">
          <div className="text-xs font-medium text-gray-500 mb-1">
            {column.title}
          </div>
          <div className="text-sm text-gray-900">
            {column.render ? column.render(item[column.key], item) : item[column.key]}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Современный компонент таблицы данных
 * 
 * @param {Object} props - Свойства компонента
 * @param {Array} props.data - Массив данных для отображения
 * @param {Array} props.columns - Конфигурация столбцов
 * @param {boolean} props.loading - Состояние загрузки
 * @param {boolean} props.searchable - Включить поиск
 * @param {boolean} props.sortable - Включить сортировку
 * @param {boolean} props.paginated - Включить пагинацию
 * @param {number} props.itemsPerPage - Элементов на странице
 * @param {Function} props.onRowClick - Обработчик клика по строке
 * @param {string} props.emptyMessage - Сообщение при отсутствии данных
 * @param {string} props.className - Дополнительные CSS классы
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  sortable = true,
  paginated = true,
  itemsPerPage = 10,
  onRowClick,
  emptyMessage = 'Нет данных для отображения',
  className,
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState(null)
  
  // Фильтрованные и отсортированные данные
  const filteredData = useMemo(() => {
    let result = [...data]
    
    // Поиск
    if (searchTerm) {
      result = result.filter(item => 
        columns.some(column => {
          const value = item[column.key]
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }
    
    // Сортировка
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue === bValue) return 0
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1
        
        const comparison = aValue > bValue ? 1 : -1
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }
    
    return result
  }, [data, searchTerm, sortConfig, columns])

  // Пагинация
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentData = paginated
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData

  // Обработчики
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return <LoadingSkeleton type="table" rows={5} columns={columns.length} />
  }

  return (
    <div className={cn('w-full', className)} {...rest}>
      {/* Поиск */}
      {searchable && (
        <div className="mb-4">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Поиск..."
            className="max-w-md"
          />
        </div>
      )}

      {/* Десктопная таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  column={column}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className={column.className}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  item={item}
                  columns={columns}
                  index={index}
                  onRowClick={onRowClick}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Мобильные карточки */}
      <div className="md:hidden">
        {currentData.length > 0 ? (
          currentData.map((item, index) => (
            <MobileCard
              key={item.id || index}
              item={item}
              columns={columns}
              onRowClick={onRowClick}
            />
          ))
        ) : (
          <div className="text-center py-8 text-sm text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>

      {/* Пагинация */}
      {paginated && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default DataTable
export { TableHeader, TableRow, Pagination } 