'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const steps = [
  {
    id: 1,
    title: 'Input Produk & Harga',
    description: 'Masukkan nama produk dan harga yang ingin Anda bandingkan',
    icon: '1',
  },
  {
    id: 2,
    title: 'Web Scraping',
    description: 'Rust scraper mengambil data harga kompetitor dari Tokopedia',
    icon: '2',
  },
  {
    id: 3,
    title: 'Statistical Processing',
    description: 'Sistem menghitung mean, median, Q1, Q3, dan outlier detection',
    icon: '3',
  },
  {
    id: 4,
    title: 'AI Recommendation',
    description: 'LLM memberikan insight dan rekomendasi pricing strategy',
    icon: '4',
  },
]

export function AnimatedWorkflow(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
          Bagaimana AI Menganalisis Harga?
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          Proses end-to-end dari input data hingga rekomendasi pricing strategy
        </p>

        <div className="relative">
          {/* Connection lines */}
          <div className="absolute top-8 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full hidden md:block" />

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="text-center relative cursor-pointer"
                onMouseEnter={() => setActiveStep(step.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Step circle */}
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg relative z-10 ${
                    activeStep === step.id
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                  }`}
                  animate={{
                    scale: activeStep === step.id ? 1.1 : 1,
                    boxShadow:
                      activeStep === step.id
                        ? '0 10px 25px -5px rgba(99, 102, 241, 0.3), 0 8px 10px -6px rgba(99, 102, 241, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                >
                  {step.icon}
                </motion.div>

                <motion.h3
                  className={`text-lg font-semibold mb-2 ${
                    activeStep === step.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                  animate={{
                    fontWeight: activeStep === step.id ? ('bold' as const) : ('normal' as const),
                    scale: activeStep === step.id ? 1.05 : 1,
                  }}
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  className="text-slate-600 dark:text-slate-400 text-sm"
                  animate={{
                    opacity: activeStep === step.id ? 1 : 0.7,
                    y: activeStep === step.id ? -5 : 0,
                  }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
