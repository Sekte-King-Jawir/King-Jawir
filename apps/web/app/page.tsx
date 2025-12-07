'use client'

import Link from 'next/link'
import { AnimatedHero } from '@/components/AnimatedHero'
import { AnimatedWorkflow } from '@/components/AnimatedWorkflow'
import { EnhancedFeatureCards } from '@/components/EnhancedFeatureCards'
import { AnimatedCTA } from '@/components/AnimatedCTA'
import { motion } from 'framer-motion'
import { FloatingElements } from '@/components/FloatingElements'

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <FloatingElements />
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Animated AI Technology Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Teknologi AI yang Kami Gunakan
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Platform ini mengintegrasikan teknologi AI modern untuk memberikan analisis harga yang
            akurat dan actionable
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tech 1 */}
            <div className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🕷️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Web Scraping Engine
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Rust-powered headless browser untuk scraping data real-time dari Tokopedia dengan
                akurasi tinggi dan performa optimal.
              </p>
            </div>

            {/* Tech 2 */}
            <div className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Large Language Model
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                OpenAI-compatible AI model yang menganalisis data pasar, tren harga, dan memberikan
                rekomendasi strategis berbasis context.
              </p>
            </div>

            {/* Tech 3 */}
            <div className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Statistical Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Algoritma statistik untuk menghitung mean, median, quartile, dan confidence interval
                dari data kompetitor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated How It Works */}
      <AnimatedWorkflow />

      {/* Enhanced Feature Cards */}
      <EnhancedFeatureCards />

      {/* Animated CTA Section */}
      <AnimatedCTA />

      {/* Enhanced Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🤖
            </motion.span>
            <span className="font-semibold text-slate-900 dark:text-white">King Jawir AI</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2024 King Jawir AI. AI-Powered Price Analysis Platform for Indonesian SMEs
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/price-analysis"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              Start Analysis
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
