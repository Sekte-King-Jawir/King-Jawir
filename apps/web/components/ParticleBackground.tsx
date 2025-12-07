'use client'

import { useEffect, useRef } from 'react'

export function ParticleBackground(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return

    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    // Set canvas size
    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle system
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      angle: number
      angularVelocity: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
        this.opacity = Math.random() * 0.5 + 0.1
        this.angle = Math.random() * Math.PI * 2
        this.angularVelocity = Math.random() * 0.05 - 0.025
      }

      update(canvasWidth: number, canvasHeight: number): void {
        this.x += this.speedX
        this.y += this.speedY
        this.angle += this.angularVelocity

        // Reset particles that go off screen
        if (this.x > canvasWidth || this.x < 0) this.speedX *= -1
        if (this.y > canvasHeight || this.y < 0) this.speedY *= -1
      }

      draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity

        // Draw particle as a rotated rectangle
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)

        ctx.restore()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 5000), 150)

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    // Animation loop
    let animationFrameId: number

    const animate = (): void => {
      if (ctx === null) return

      // Clear with a semi-transparent fill for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height)
        particle.draw(ctx)
      })

      // Connect nearby particles
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)'
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const particle1 = particles[i]
          const particle2 = particles[j]

          if (particle1 !== null && particle2 !== null) {
            const dx = particle1.x - particle2.x
            const dy = particle1.y - particle2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.globalAlpha = 1 - distance / 100
              ctx.beginPath()
              ctx.moveTo(particle1.x, particle1.y)
              ctx.lineTo(particle2.x, particle2.y)
              ctx.stroke()
            }
          }
        }
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}
