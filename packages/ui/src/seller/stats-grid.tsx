'use client'

import type { SellerStats } from '../types/index.js'

export interface StatsGridProps {
  stats: SellerStats
}

export interface StatCardProps {
  title: string
  value: string | number
  icon: string
  trend?: string
  trendType?: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, icon, trend, trendType = 'neutral' }: StatCardProps): React.JSX.Element {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-500 dark:text-slate-400',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trendColors[trendType]}`}>{trend}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  )
}

export function StatsGrid({ stats }: StatsGridProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Pendapatan"
        value={formatCurrency(stats.totalRevenue)}
        icon="💰"
      />
      <StatCard
        title="Total Pesanan"
        value={stats.totalOrders}
        icon="📦"
      />
      <StatCard
        title="Produk Aktif"
        value={stats.totalProducts}
        icon="🏷️"
      />
      <StatCard
        title="Pesanan Pending"
        value={stats.pendingOrders}
        icon="⏳"
        trendType={stats.pendingOrders > 0 ? 'up' : 'neutral'}
      />
    </div>
  )
}
