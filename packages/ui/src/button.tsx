'use client'

import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  appName: string
}

export const Button = ({ children, className, appName }: ButtonProps): React.JSX.Element => {
  return (
    <button
      className={className}
      onClick={(): void => {
        // eslint-disable-next-line no-console
        console.log(`Hello from your ${appName} app!`)
      }}
    >
      {children}
    </button>
  )
}
