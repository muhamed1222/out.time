import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утилита для объединения и оптимизации CSS классов
 * Комбинирует clsx для условного добавления классов
 * и tailwind-merge для оптимизации конфликтующих Tailwind классов
 * 
 * @param {...any} inputs - Классы для объединения
 * @returns {string} Оптимизированная строка классов
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default cn 