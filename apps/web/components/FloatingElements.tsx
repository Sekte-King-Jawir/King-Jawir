'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type FloatingElement = {
  id: number
  top: number
  left: number
  size: number
  color: 'blue' | 'indigo' | 'purple'
  duration: number
}

export function FloatingElements(): React.JSX.Element {
  const [elements, setElements] = useState<FloatingElement[]>([
    // Initial values for server-side rendering to prevent hydration mismatch
    ...Array.from({ length: 15 }, (_, i) => {
      const colors: ('blue' | 'indigo' | 'purple')[] = ['blue', 'indigo', 'purple']
      const colorIndex = i % 3

      return {
        id: i,
        top: (i * 7) % 100,
        left: (i * 5) % 100,
        size: ((i * 4 + 20) % 60) + 20,
        color: colors[colorIndex],
        duration: ((i * 2 + 10) % 20) + 10,
      } as FloatingElement
    }),
  ])

  useEffect(() => {
    // Create floating elements with random values on client side
    const newElements: FloatingElement[] = []
    for (let i = 0; i < 15; i++) {
      const colors: ('blue' | 'indigo' | 'purple')[] = ['blue', 'indigo', 'purple']
      const randomIndex = Math.floor(Math.random() * 3)
      const randomColor = colors[randomIndex] || 'blue' // Fallback to 'blue' if undefined

      newElements.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 60 + 20,
        color: randomColor,
        duration: Math.random() * 20 + 10,
      })
    }

    setElements(newElements)
  }, [])

  return (
    <>
      {elements.map(element => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full blur-xl opacity-10 ${
            element.color === 'blue'
              ? 'bg-blue-500'
              : element.color === 'indigo'
                ? 'bg-indigo-500'
                : 'bg-purple-500'
          }`}
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            top: `${element.top}%`,
            left: `${element.left}%`,
          }}
          animate={{
            y: [0, ((element.id * 10) % 100) - 50],
            x: [0, ((element.id * 12) % 100) - 50],
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: 'reverse' as const,
          }}
        />
      ))}
    </>
  )
}
