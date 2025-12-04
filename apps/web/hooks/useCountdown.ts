'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TimeLeft } from '@/types'

interface UseCountdownOptions {
  initialHours?: number
  initialMinutes?: number
  initialSeconds?: number
  onComplete?: () => void
}

interface UseCountdownReturn {
  timeLeft: TimeLeft
  isExpired: boolean
  reset: (hours?: number, minutes?: number, seconds?: number) => void
  formattedTime: {
    hours: string
    minutes: string
    seconds: string
  }
}

/**
 * Custom hook untuk countdown timer
 * Memisahkan logika timer dari UI component
 */
export function useCountdown(options: UseCountdownOptions = {}): UseCountdownReturn {
  const {
    initialHours = 12,
    initialMinutes = 45,
    initialSeconds = 30,
    onComplete,
  } = options

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  })

  const [isExpired, setIsExpired] = useState(false)

  // Reset timer function
  const reset = useCallback((hours?: number, minutes?: number, seconds?: number) => {
    setTimeLeft({
      hours: hours ?? initialHours,
      minutes: minutes ?? initialMinutes,
      seconds: seconds ?? initialSeconds,
    })
    setIsExpired(false)
  }, [initialHours, initialMinutes, initialSeconds])

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // Jika masih ada seconds
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        // Jika seconds habis tapi masih ada minutes
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        // Jika minutes habis tapi masih ada hours
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        // Timer selesai - reset ke 24 jam (untuk flash sale yang loop)
        setIsExpired(true)
        onComplete?.()
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete])

  // Format time dengan leading zero
  const formattedTime = {
    hours: String(timeLeft.hours).padStart(2, '0'),
    minutes: String(timeLeft.minutes).padStart(2, '0'),
    seconds: String(timeLeft.seconds).padStart(2, '0'),
  }

  return {
    timeLeft,
    isExpired,
    reset,
    formattedTime,
  }
}
