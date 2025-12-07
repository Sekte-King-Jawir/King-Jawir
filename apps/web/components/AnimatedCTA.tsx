'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function AnimatedCTA(): React.JSX.Element {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.1)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(129,140,248,0.1)_0%,transparent_40%)]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Mulai Tentukan Harga Optimal dengan AI
        </motion.h2>

        <motion.p
          className="text-lg text-slate-600 dark:text-slate-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tidak perlu riset manual lagi. Biarkan AI yang bekerja untuk Anda—analisis komprehensif
          dalam hitungan detik.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/price-analysis"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-600/30"
          >
            <span>🚀 Coba Analisis AI Sekarang</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut' as const,
              }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        <motion.p
          className="text-sm text-slate-500 dark:text-slate-500 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Free to use • No credit card required • Instant results
        </motion.p>
      </div>

      {/* Floating elements */}
      {[...Array(8)].map((_, i) => {
        const width = ((i * 10 + 20) % 60) + 20
        const height = ((i * 8 + 20) % 60) + 20
        const top = (i * 15) % 100
        const left = (i * 12) % 100
        
        return (
          <motion.div
            key={`floating-element-${i}`}
            className="absolute rounded-full bg-blue-500/10 blur-xl"
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
    </section>
  )
}
