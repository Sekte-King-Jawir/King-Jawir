'use client'

import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  size?: 'sm' | 'md'
}

export function Badge({ children, color = 'blue', size = 'md' }: BadgeProps): React.JSX.Element {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    red: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
    purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  )
}
