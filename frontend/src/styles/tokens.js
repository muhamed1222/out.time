// 🎨 Design Tokens - Единая система дизайна для Out Time
// Базируется на современных принципах дизайна 2024

export const colors = {
  // Основная палитра
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // основной синий
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },

  // Семантические цвета
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // основной зеленый
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // основной желтый
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },

  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // основной красный
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },

  // Нейтральная палитра
  gray: {
    25: '#fcfcfd',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },

  // Специальные цвета
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Статусы работы (для бейджей)
  status: {
    work: {
      bg: 'rgba(16, 185, 129, 0.1)',
      text: '#059669',
      border: 'rgba(16, 185, 129, 0.2)'
    },
    sick: {
      bg: 'rgba(239, 68, 68, 0.1)', 
      text: '#dc2626',
      border: 'rgba(239, 68, 68, 0.2)'
    },
    vacation: {
      bg: 'rgba(245, 158, 11, 0.1)',
      text: '#d97706', 
      border: 'rgba(245, 158, 11, 0.2)'
    },
    default: {
      bg: '#f3f4f6',
      text: '#4b5563',
      border: '#e5e7eb'
    }
  }
}

export const typography = {
  // Размеры шрифтов (используем rem для масштабируемости)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem'     // 48px
  },

  // Веса шрифтов
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },

  // Межстрочные интервалы
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Семейства шрифтов
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'monospace']
  }
}

export const spacing = {
  // Система отступов (rem для адаптивности)
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  base: '1rem',    // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
  '5xl': '5rem',   // 80px
  '6xl': '6rem'    // 96px
}

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
}

export const shadows = {
  // Современные тени с правильными цветами
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',

  // Цветные тени для интерактивных элементов
  primary: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
  success: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
  danger: '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)'
}

export const transitions = {
  // Плавные переходы
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)', 
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Специальные easing-функции
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}

export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

export const zIndex = {
  dropdown: 10,
  sticky: 20,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80
}

// Вспомогательные функции для работы с токенами
export const getColor = (colorPath) => {
  const keys = colorPath.split('.')
  let result = colors
  
  for (const key of keys) {
    result = result[key]
    if (!result) return colorPath // возвращаем исходное значение если путь неверный
  }
  
  return result
}

export const getShadow = (name) => shadows[name] || shadows.base

export const getSpacing = (size) => spacing[size] || size

// Экспорт всех токенов одним объектом
export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex
}

export default tokens 