'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname()
  const previousPathname = useRef<string | null>(null)
  
  // Determine animation direction
  const getDirection = (): number => {
    if (previousPathname.current === null) return 0
    
    // Simple direction logic based on pathname length
    // In a real app, you might want more sophisticated logic
    return pathname.length > (previousPathname.current?.length || 0) ? 1 : -1
  }
  
  useEffect(() => {
    previousPathname.current = pathname
  }, [pathname])

  return (
    <motion.div
      key={pathname}
      initial={{ 
        opacity: 0, 
        x: getDirection() * 50,
        y: 20
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0
      }}
      exit={{ 
        opacity: 0, 
        x: -getDirection() * 50,
        y: -20
      }}
      transition={{
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  )
}