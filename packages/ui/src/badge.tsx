'use client'

import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  size?: 'sm' | 'md'
}

export function Badge({ children, color = 'gray', size = 'md' }: BadgeProps): React.JSX.Element {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
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