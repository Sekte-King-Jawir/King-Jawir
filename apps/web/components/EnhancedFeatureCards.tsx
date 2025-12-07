'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: '⚡',
    title: 'Real-time',
    description: 'Data diambil langsung dari marketplace tanpa cache',
  },
  {
    icon: '🎯',
    title: 'Akurat',
    description: 'Algoritma statistik untuk analisis data yang presisi',
  },
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'LLM memberikan insight kontekstual dan strategis',
  },
  {
    icon: '🚀',
    title: 'Cepat',
    description: 'Hasil analisis dalam hitungan detik via WebSocket',
  },
]

export function EnhancedFeatureCards(): React.JSX.Element {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => {
          const width = ((i * 8 + 20) % 100) + 20
          const height = ((i * 6 + 20) % 100) + 20
          const top = (i * 7) % 100
          const left = (i * 5) % 100
          // Generate a unique key based on the element properties
          const uniqueKey = `feature-bg-${width}-${height}-${top}-${left}`;

          return (
            <motion.div
              key={uniqueKey}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                top: `${top}%`,
                left: `${left}%`,
              }}
              animate={{
                y: [0, ((i * 10) % 100) - 50],
                x: [0, ((i * 12) % 100) - 50],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: ((i * 2 + 10) % 20) + 10,
                repeat: Infinity,
                repeatType: 'reverse' as const,
              }}
            />
          )
        })}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h3
          className="text-2xl font-bold text-center text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Mengapa Pilih King Jawir AI?
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <motion.div
              key={`feature-${feature.title}`}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{
                y: -10,
                rotateX: 10,
                rotateZ: 2,
                scale: 1.03,
                transition: { type: 'spring' as const, stiffness: 300 },
              }}
              style={{
                transformStyle: 'preserve-3d' as const,
              }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse' as const,
                  delay: 0.5,
                }}
              >
                {feature.icon}
              </motion.div>

              <motion.div
                className="text-2xl font-bold mb-2 text-white"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(255,255,255,0.5)',
                    '0 0 8px rgba(255,255,255,0.8)',
                    '0 0 0px rgba(255,255,255,0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse' as const,
                  delay: 0.5,
                }}
              >
                {feature.title}
              </motion.div>

              <div className="text-blue-100">{feature.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
