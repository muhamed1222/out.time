// 🎨 UI Components - Современная библиотека компонентов для Out Time

// Базовые компоненты
export { default as Button } from './Button'
export { default as Card } from './Card'
export { default as Badge, WorkStatusBadge } from './Badge'
export { default as Input, SearchInput, Textarea } from './Input'
export { default as LoadingSkeleton } from './LoadingSkeleton'

// Продвинутые компоненты
export { default as StatsCard, TrendIndicator } from './StatsCard'
export { default as DataTable, TableHeader, TableRow, Pagination } from './DataTable'

// Экспорт отдельных компонентов из Card
export {
  CardHeader,
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter
} from './Card'

// Экспорт отдельных компонентов из LoadingSkeleton
export {
  Skeleton,
  TextSkeleton,
  CardSkeleton,
  TableSkeleton,
  StatsCardSkeleton,
  ListSkeleton
} from './LoadingSkeleton'

// Реэкспорт констант и утилит
export { buttonVariants, buttonSizes } from './Button'
export { badgeVariants, badgeSizes, getWorkStatusBadge } from './Badge'
export { inputVariants, inputSizes } from './Input'
export { statsColorSchemes, statsIcons } from './StatsCard' 