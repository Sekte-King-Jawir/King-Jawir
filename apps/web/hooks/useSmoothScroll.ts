'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll(): void {
  useEffect(() => {
    // Configure ScrollTrigger
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    })

    // Set up smooth scrolling
    const smoothScroll = (): void => {
      const html = document.documentElement
      const body = document.body

      // Store the original scroll position
      let scrollTop = window.pageYOffset || html.scrollTop || body.scrollTop || 0
      let scrollLeft = window.pageXOffset || html.scrollLeft || body.scrollLeft || 0

      // Set up the animation loop
      const update = (): void => {
        // Calculate the difference between current and target scroll positions
        const currentY = html.scrollTop ?? body.scrollTop ?? 0
        const currentX = html.scrollLeft ?? body.scrollLeft ?? 0

        // Apply easing to smooth the scroll
        const isValidCurrentY = typeof currentY === 'number' && !isNaN(currentY) && isFinite(currentY);
        const isValidCurrentX = typeof currentX === 'number' && !isNaN(currentX) && isFinite(currentX);
        
        if (isValidCurrentY && isValidCurrentX && currentY !== 0 && currentX !== 0) {
          scrollTop += (currentY - scrollTop) * 0.1
          scrollLeft += (currentX - scrollLeft) * 0.1
        }

        // Apply the smoothed scroll position
        window.scrollTo(scrollLeft, scrollTop)

        // Continue the animation loop
        requestAnimationFrame(update)
      }

      // Start the animation loop
      requestAnimationFrame(update)
    }

    // Initialize smooth scrolling
    smoothScroll()

    // Refresh ScrollTrigger on resize
    const handleResize = (): void => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])
}
