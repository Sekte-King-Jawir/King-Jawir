'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ParticleBackground } from './ParticleBackground'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 200
    }
  }
}

const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
}

export function AnimatedHero(): React.JSX.Element {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 z-[-2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <motion.section 
        className="pt-20 pb-20 px-4 relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 shadow-sm"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.2), 0 8px 10px -6px rgba(99, 102, 241, 0.2)'
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.span 
              animate={{ rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-lg"
            >
              ⚡
            </motion.span>
            <span>AI-Powered Price Intelligence</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Tentukan Harga{' '}
            <motion.span 
              className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              Optimal
            </motion.span>
            <br />
            dengan Kekuatan AI
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4"
            variants={itemVariants}
          >
            Platform analisis harga berbasis Artificial Intelligence yang membantu UMKM Indonesia
            menentukan strategi pricing yang kompetitif dan menguntungkan.
          </motion.p>

          <motion.p 
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10"
            variants={itemVariants}
          >
            Scraping data real-time dari Tokopedia, analisis statistik mendalam, dan rekomendasi
            harga cerdas dari AI—semuanya dalam satu platform. <strong>100% Gratis!</strong>
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/price-analysis"
                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-600/30 block text-center"
              >
                🚀 Mulai Analisis Harga
              </Link>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/product-description"
                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-green-600/30 block text-center"
              >
                📝 Generate Deskripsi Produk
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Floating elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500/10 blur-xl"
          style={{
            width: `${(i * 20 + 50) % 100 + 50}px`,
            height: `${(i * 15 + 50) % 100 + 50}px`,
            top: `${(i * 30) % 100}%`,
            left: `${(i * 25) % 100}%`,
          }}
          animate={{
            y: [0, ((i * 10) % 100) - 50],
            x: [0, ((i * 15) % 100) - 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: (i * 2 + 10) % 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  )
}