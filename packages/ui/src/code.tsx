import { type JSX } from 'react'

// [unused] export function Code({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}): JSX.Element {
  return <code className={className}>{children}</code>
}
